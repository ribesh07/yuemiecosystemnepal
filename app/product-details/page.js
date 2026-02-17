"use client";

import { useState } from "react";
import RelatedProduct from "../../components/relatedProduct";
import Link from "next/link";

function RelatedProducts() {
  return <RelatedProduct />;
}

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // Add the product to the cart
  };

  const product = {
    name: "Yuemi C-3, 1080P Dome Cap Style Rear AHD Camera",
    brand: "YUEMI ECOSYSTEM",
    price: 2499.0,
    rating: 4.5,
    reviews: 2,
    images: [
      "https://yuemiecosystem.com/cdn/shop/files/Yuemi_c3_1st.jpg?v=1732186338",
      "https://yuemiecosystem.com/cdn/shop/files/Yuemi_c3_2nd.jpg?v=1732186338",
      "https://yuemiecosystem.com/cdn/shop/files/Yuemi_c3_3rd.jpg?v=1732186338",
    ],
    inStock: true,
    shipping: "Free Shipping | Pan India",
    features: [
      "160° Field of View",
      "1080P HD Resolution",
      "Dome Cap Style Design",
      "AHD Technology",
    ],
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl overflow-hidden aspect-square">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8 transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative bg-gray-50 rounded-xl overflow-hidden aspect-square transition-all duration-300 ${
                    selectedImage === index
                      ? "ring-4 ring-orange-500 scale-95"
                      : "hover:ring-2 ring-gray-300"
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-contain p-4"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Brand */}
            <div className="text-sm text-gray-600 uppercase tracking-wider">
              {product.brand}
            </div>

            {/* Product Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center justify-between">
              {/* LEFT: rating + reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(product.rating)
                          ? "text-yellow-400 fill-current"
                          : star - 0.5 <= product.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <span className="text-gray-600 text-sm">
                  ({product.reviews})
                </span>
              </div>

              {/* RIGHT: share button */}
              <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-gray-600">MRP</span>
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="text-sm text-gray-500">Inclusive of all taxes.</p>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={decrementQuantity}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-16 h-10 text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 active:scale-95"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full py-4 bg-white border-2 border-gray-900 rounded-full text-gray-900 font-semibold text-lg hover:bg-gray-50 transition-all duration-300 active:scale-98">
                ADD TO CART
              </button>
              import Link from "next/link";
              <Link href="/Checkout">
                <button className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-white font-semibold text-lg hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 active:scale-98">
                  BUY IT NOW
                </button>
              </Link>
            </div>

            {/* Shipping Info */}
            <div className="flex items-center gap-2 text-gray-700 py-4 border-t border-gray-200">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-sm">{product.shipping}</span>
            </div>

            {/* Product Tabs */}
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-2">
                {/* Description */}
                <button
                  onClick={() =>
                    setActiveTab(
                      activeTab === "description" ? "" : "description",
                    )
                  }
                  className="w-full flex items-center justify-between py-4 border-b border-gray-200 text-left group"
                >
                  <span className="text-lg font-medium text-gray-900">
                    Description
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                      activeTab === "description" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeTab === "description" && (
                  <div className="py-4 text-gray-700 space-y-3 animate-slideDown">
                    <p>
                      The Yuemi C-3 is a premium 1080P rear view camera
                      featuring dome cap style design with advanced AHD
                      technology for crystal clear video quality.
                    </p>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Specification */}
                <button
                  onClick={() =>
                    setActiveTab(activeTab === "specs" ? "" : "specs")
                  }
                  className="w-full flex items-center justify-between py-4 border-b border-gray-200 text-left"
                >
                  <span className="text-lg font-medium text-gray-900">
                    Technical Specification
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                      activeTab === "specs" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeTab === "specs" && (
                  <div className="py-4 text-gray-700 space-y-2 animate-slideDown">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-medium text-gray-900">Resolution</p>
                        <p className="text-sm">1080P HD</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Field of View
                        </p>
                        <p className="text-sm">160°</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Technology</p>
                        <p className="text-sm">AHD</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Style</p>
                        <p className="text-sm">Dome Cap</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Shipping Information */}
                <button
                  onClick={() =>
                    setActiveTab(activeTab === "shipping" ? "" : "shipping")
                  }
                  className="w-full flex items-center justify-between py-4 border-b border-gray-200 text-left"
                >
                  <span className="text-lg font-medium text-gray-900">
                    Shipping information
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${
                      activeTab === "shipping" ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {activeTab === "shipping" && (
                  <div className="py-4 text-gray-700 space-y-2 animate-slideDown">
                    <p>
                      We offer free shipping across India. Orders are typically
                      processed within 1-2 business days and delivered within
                      5-7 business days.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <section className="relative h-[340px] overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 hover:scale-105"
              style={{
                backgroundImage: "url('/image.png')",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
          </section>
        </div>
        <RelatedProducts />
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .active\:scale-98:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}
