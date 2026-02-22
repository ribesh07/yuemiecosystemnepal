"use client";

import { useState, useEffect } from "react";
import { X, Plus, Minus, ShoppingCart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { isAuthenticatedClient } from "@/utils/clientAuth";

export default function CartSidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart + listen for open event
  useEffect(() => {
    loadCart();

    const handleOpenCart = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-cart", handleOpenCart);

    return () => {
      window.removeEventListener("open-cart", handleOpenCart);
    };
  }, []);

  const loadCart = async () => {
    try {
      if (!window?.storage) return;

      const result = await window.storage.get("cart");
      if (result?.value) {
        setCartItems(JSON.parse(result.value));
      }
    } catch (err) {
      console.log("No cart found");
    } finally {
      setLoading(false);
    }
  };

  const saveCart = async (items) => {
    try {
      if (!window?.storage) return;
      await window.storage.set("cart", JSON.stringify(items));
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const updateQuantity = (id, delta) => {
    const updated = cartItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );

    setCartItems(updated);
    saveCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    saveCart(updated);
  };

  const clearCart = async () => {
    setCartItems([]);
    if (window?.storage) {
      await window.storage.delete("cart");
    }
  };

  const handleCheckout = async () => {
    const authed = await isAuthenticatedClient();
    if (!authed) {
      toast.error("Please login first");
      setIsOpen(false);
      router.push("/account?next=/Checkout");
      return;
    }

    setIsOpen(false);
    router.push("/Checkout");
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Shopping Cart
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : cartItems.length === 0 ? (
              <div className="text-center text-gray-500">
                <ShoppingCart className="mx-auto w-16 h-16 mb-3 opacity-40" />
                Your cart is empty
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 border rounded flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-gray-400 text-xl">
                            {item.name?.[0]}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-semibold truncate">
                            {item.name}
                          </h3>
                          <button onClick={() => removeItem(item.id)}>
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-2">
                          <div className="flex border rounded">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-2"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-2"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <div className="font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-red-600 text-sm w-full mt-3"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-6 bg-gray-50">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
