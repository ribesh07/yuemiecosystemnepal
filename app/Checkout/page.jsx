"use client";
import Image from 'next/image';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { getSessionToken, isAuthenticatedClient } from "@/utils/clientAuth";
import {
  clearCheckoutSelection,
  getCartItems,
  getCheckoutSelection,
  removeCartItemsByIds,
} from "@/utils/cartClient";

const CheckoutPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const isCartCheckout = searchParams.get("cart") === "1";
  const qtyParam = Number(searchParams.get("qty") || "1");
  const quantity = Number.isNaN(qtyParam) || qtyParam < 1 ? 1 : qtyParam;
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [product, setProduct] = useState(null);
  const [productLoading, setProductLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    let mounted = true;

    const validateAuth = async () => {
      const authed = await isAuthenticatedClient();
      if (!authed) {
        toast.error("Please login first");
        router.replace("/account?next=/Checkout");
        return;
      }

      if (!productId && !isCartCheckout) {
        toast.error("No product selected for checkout.");
        router.replace("/all-product");
        return;
      }

      const token = getSessionToken();
      const addressRes = await fetch("/api/customers/addresses", {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const addressData = await addressRes.json();

      if (!addressRes.ok) {
        toast.error(addressData?.message || "Failed to load addresses");
      } else if (mounted) {
        const list = addressData?.data || [];
        setSavedAddresses(list);
        const defaultAddr = list.find((a) => a.defaultShipping) || list[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        }
      }

      if (isCartCheckout) {
        const selected = getCheckoutSelection();
        const items = selected.length ? selected : getCartItems();
        if (!items.length) {
          toast.error("Your cart is empty.");
          router.replace("/all-product");
          return;
        }
        if (mounted) {
          setCartItems(items);
        }
      } else {
        const productsRes = await fetch("/api/products");
        const productsData = await productsRes.json();
        const list = productsData?.products || [];
        const selected = list.find((p) => String(p.id) === String(productId));
        if (!selected) {
          toast.error("Product not found");
          router.replace("/all-product");
          return;
        }
        if (mounted) {
          setProduct(selected);
        }
      }

      if (mounted) {
        setAddressLoading(false);
        setProductLoading(false);
        setPaymentMethod("cod");
        setAuthChecked(true);
      }
    };

    validateAuth();

    return () => {
      mounted = false;
    };
  }, [router, productId, isCartCheckout]);

  const summaryItems = isCartCheckout
    ? cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        categoryName: item.categoryName || "",
        sellPrice: Number(item.price || 0),
        quantity: Number(item.quantity || 1),
      }))
    : product
      ? [{
          id: product.id,
          name: product.name,
          image: product.mainImage,
          categoryName: product.categoryName || "",
          sellPrice: Number(product.sellPrice || 0),
          quantity,
        }]
      : [];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!summaryItems.length) {
      toast.error("No items found for checkout.");
      return;
    }
    
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }
    
    if (paymentMethod !== "cod") {
      toast.error('Please select a payment method');
      return;
    }

    const token = getSessionToken();
    setPlacingOrder(true);
    fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        ...(isCartCheckout
          ? {
              items: summaryItems.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
              })),
            }
          : {
              productId: summaryItems[0].id,
              quantity: summaryItems[0].quantity,
            }),
        addressId: selectedAddressId,
        paymentMethod: "cod",
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Failed to place order");
        }
        toast.success("Order placed successfully!");
        if (isCartCheckout) {
          removeCartItemsByIds(summaryItems.map((item) => item.id));
          clearCheckoutSelection();
        }
        router.push("/profile");
      })
      .catch((err) => {
        toast.error(err.message || "Order failed");
      })
      .finally(() => {
        setPlacingOrder(false);
      });
  };

  const selectedAddress = savedAddresses.find((a) => String(a.id) === String(selectedAddressId));
  const shipping = Number(selectedAddress?.city?.shippingCost || 0);
  const subtotal = summaryItems.reduce(
    (sum, item) => sum + Number(item.sellPrice || 0) * Number(item.quantity || 0),
    0
  );
  const total = subtotal + shipping;

  if (!authChecked || productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-10 w-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8 px-4">
      {placingOrder && (
        <div className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm text-center">
            <div className="mx-auto h-12 w-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4" />
            <h3 className="text-lg font-bold text-gray-900">Placing your order</h3>
            <p className="text-sm text-gray-600 mt-1">
              Please wait while we confirm stock and payment details.
            </p>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Checkout Forms */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Delivery Address Section */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Delivery Address
                </h2>

                {/* Address Dropdown */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Saved Address
                  </label>
                  <select
                    value={selectedAddressId}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                    required
                  >
                    <option value="">-- Choose an address --</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.fullName} - {addr.address}, {addr.city?.city}
                      </option>
                    ))}
                  </select>
                  {addressLoading && (
                    <p className="text-xs text-gray-500 mt-2">Loading addresses...</p>
                  )}
                  {!addressLoading && savedAddresses.length === 0 && (
                    <p className="text-xs text-gray-500 mt-2">
                      No saved address found. Add one from Profile.
                    </p>
                  )}
                </div>

                {/* Selected Address Display */}
                {selectedAddressId && (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mt-4">
                    {selectedAddress ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              {selectedAddress.addressType || "HOME"}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800 mb-1">{selectedAddress.fullName}</p>
                          <p className="text-sm text-gray-700">{selectedAddress.address}</p>
                          <p className="text-sm text-gray-700">
                            {selectedAddress.zone?.zoneName}, {selectedAddress.city?.city}, {selectedAddress.province?.name}
                          </p>
                          <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {selectedAddress.phone}
                          </p>
                        </div>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Method
                </h2>

                <div className="space-y-4">
                  <div
                    onClick={() => setPaymentMethod("cod")}
                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 ${
                      paymentMethod === "cod"
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "cod"
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === "cod" && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-800 text-lg">Cash on Delivery</h3>
                          <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                            Pay Later
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                        <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          No extra COD fee applied
                        </p>
                      </div>
                      <div className="text-4xl">
                        💵
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={placingOrder}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {placingOrder ? (
                  <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {placingOrder
                  ? "Placing Order..."
                  : `Place Order - Rs. ${total.toLocaleString()}`}
              </button>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-4">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

                {/* Product Details */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="space-y-4">
                    {summaryItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200">
                          <Image
                            src={item?.image || "/yumei_logo.png"}
                            alt={item?.name || "Product"}
                            fill
                            className="object-cover"
                            sizes="96px"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                            {item?.name}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {item?.categoryName || "-"}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Qty: {item.quantity}
                            </span>
                            <span className="font-bold text-orange-500">
                              Rs. {Number(item.sellPrice || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {isCartCheckout && (
                  <div className="mb-4 text-xs text-gray-500">
                    Total Items:{" "}
                    {summaryItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0)}
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-800">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charge</span>
                    <span className="font-medium text-gray-800">Rs. {shipping}</span>
                  </div>
                  {paymentMethod === "cod" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">COD Fee</span>
                      <span className="font-medium text-gray-800">Rs. 0</span>
                    </div>
                  )}
                  <div className="pt-3 border-t-2 border-gray-200 flex justify-between">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="font-bold text-2xl text-orange-500">
                      Rs. {total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Security & Info */}
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-xl p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-sm text-green-800">Secure Checkout</span>
                    </div>
                    <p className="text-xs text-green-700">Your information is encrypted</p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <span className="font-semibold text-sm text-blue-800">Free Returns</span>
                    </div>
                    <p className="text-xs text-blue-700">7 days return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="h-10 w-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CheckoutPageContent />
    </Suspense>
  );
}
