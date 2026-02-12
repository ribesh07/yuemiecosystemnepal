"use client";
import Image from 'next/image';
import { useState } from 'react';
import toast from "react-hot-toast";

const CheckoutPage = () => {
  const [selectedAddress, setSelectedAddress] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  
  // Sample saved addresses - replace with actual user data
  const savedAddresses = [
    {
      id: 1,
      label: 'Home',
      fullName: 'Gyanendra Shah',
      address: 'Naxal, Kathmandu 44600',
      city: 'Kathmandu',
      phone: '+977 9876543210'
    },
    {
      id: 2,
      label: 'Office',
      fullName: 'Rajendra Shah',
      address: 'Pulchowk, Lalitpur 44700',
      city: 'Lalitpur',
      phone: '+977 9876543210'
    }
  ];

  // Sample product data
  const product = {
    id: 1,
    name: 'Yuemi Premium Car Air Freshener',
    image: '/images/products/air-freshener.jpg',
    price: 2999,
    quantity: 2,
    category: 'Car Air Fresheners'
  };

  const [newAddress, setNewAddress] = useState({
    label: '',
    fullName: '',
    phone: '',
    address: '',
    city: ''
  });

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedAddress && !showAddressForm) {
      toast.error('Please select or add a delivery address');
      return;
    }
    
    if (!paymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    console.log('Order submitted:', {
      address: selectedAddress || newAddress,
      paymentMethod
    });
    
    toast.success('Order placed successfully!');
  };

  const subtotal = product.price * product.quantity;
  const shipping = 150;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8 px-4">
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
                    value={selectedAddress}
                    onChange={(e) => {
                      setSelectedAddress(e.target.value);
                      if (e.target.value !== 'new') {
                        setShowAddressForm(false);
                      } else {
                        setShowAddressForm(true);
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all bg-white"
                    required={!showAddressForm}
                  >
                    <option value="">-- Choose an address --</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.label} - {addr.address}, {addr.city}
                      </option>
                    ))}
                    <option value="new">+ Add New Address</option>
                  </select>
                </div>

                {/* Selected Address Display */}
                {selectedAddress && selectedAddress !== 'new' && (
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mt-4">
                    {(() => {
                      const addr = savedAddresses.find(a => a.id === parseInt(selectedAddress));
                      return addr ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                              {addr.label}
                            </span>
                          </div>
                          <p className="font-semibold text-gray-800 mb-1">{addr.fullName}</p>
                          <p className="text-sm text-gray-700">{addr.address}</p>
                          <p className="text-sm text-gray-700">{addr.city}</p>
                          <p className="text-sm text-gray-700 mt-2 flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {addr.phone}
                          </p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* Add New Address Form */}
                {showAddressForm && (
                  <div className="mt-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add New Address
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Address Label *
                        </label>
                        <input
                          type="text"
                          name="label"
                          value={newAddress.label}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="e.g., Home, Office"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={newAddress.fullName}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={newAddress.phone}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="+977 9876543210"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={newAddress.address}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="Street, Apartment, Building"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={newAddress.city}
                          onChange={handleAddressChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                          placeholder="Kathmandu"
                          required
                        />
                      </div>
                    </div>
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
                  {/* ConnectIPS */}
                  <div
                    onClick={() => setPaymentMethod('connectips')}
                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 ${
                      paymentMethod === 'connectips'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'connectips'
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'connectips' && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-gray-800 text-lg">ConnectIPS</h3>
                          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded-full">
                            Online Banking
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Pay securely with your bank account</p>
                        <div className="flex items-center gap-2 mt-2">
                          <img src="/images/banks-logo.png" alt="Banks" className="h-6 opacity-70" onError={(e) => {
                            e.target.style.display = 'none';
                          }} />
                          <span className="text-xs text-gray-500">All major banks supported</span>
                        </div>
                      </div>
                      <div className="text-4xl">
                        🏦
                      </div>
                    </div>
                  </div>

                  {/* Cash on Delivery */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`cursor-pointer p-5 rounded-xl border-2 transition-all duration-200 ${
                      paymentMethod === 'cod'
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === 'cod'
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {paymentMethod === 'cod' && (
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
                          Additional Rs. 50 handling fee may apply
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
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 text-lg"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Place Order - Rs. {total.toLocaleString()}
              </button>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-4">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

                {/* Product Details */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm mb-1 line-clamp-2">
                        {product.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Qty: {product.quantity}</span>
                        <span className="font-bold text-orange-500">Rs. {product.price}</span>
                      </div>
                    </div>
                  </div>
                </div>

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
                  {paymentMethod === 'cod' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">COD Fee</span>
                      <span className="font-medium text-gray-800">Rs. 50</span>
                    </div>
                  )}
                  <div className="pt-3 border-t-2 border-gray-200 flex justify-between">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="font-bold text-2xl text-orange-500">
                      Rs. {(paymentMethod === 'cod' ? total + 50 : total).toLocaleString()}
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

export default CheckoutPage;