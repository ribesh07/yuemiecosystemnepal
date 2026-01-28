"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const RELATED_PRODUCTS = [
  {
    id: 1,
    name: "YueMi M75 150W LED Light (6000K) – Hi/Low (H4/H19)",
    price: 11249,
    images: [
      "https://yuemiecosystem.com/cdn/shop/files/M75_4300k_LED.jpg?v=1730719394",
      "https://yuemiecosystem.com/cdn/shop/files/150W_LED_22f81754-6547-40df-870c-a8f0f54244ac.jpg?v=1728984552",
    ],
  },
  {
    id: 2,
    name: "YueMi M75 150W LED Light (6000K) – Single Beam",
    price: 9999,
    images: [
      "https://yuemiecosystem.com/cdn/shop/files/M100_4300k_LED.jpg?v=1730719286",
      "https://yuemiecosystem.com/cdn/shop/files/200W_LED.jpg?v=1728984431",
    ],
    rating: 4,
    reviews: 2,
  },
  {
    id: 3,
    name: "YueMi M75 150W LED Light (4300K) – Single Beam",
    price: 9999,
    images: [
      "https://yuemiecosystem.com/cdn/shop/files/150W_LED_22f81754-6547-40df-870c-a8f0f54244ac.jpg?v=1728984552", // only one image
    ],
  },
  {
    id: 4,
    name: "YueMi M100 200W LED Light (4300K) – Hi/Low (H4/H19)",
    price: 13749,
    images: [
      "https://yuemiecosystem.com/cdn/shop/files/150W_LED_22f81754-6547-40df-870c-a8f0f54244ac.jpg?v=1728984552",
      "https://yuemiecosystem.com/cdn/shop/files/M75_4300k_LED.jpg?v=1730719394",
    ],
  },
];

export default function RelatedProduct() {
  const router = useRouter();

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">
        You may also like
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {RELATED_PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() =>
              router.push(`/product-details?id=${product.id}`)
            }
          />
        ))}
      </div>
    </section>
  );
}

/* ---------------- CARD ---------------- */

function ProductCard({ product, onClick }) {
  const [hovered, setHovered] = useState(false);

  const hasSecondImage = product.images.length > 1;
  const displayImage =
    hovered && hasSecondImage
      ? product.images[1]
      : product.images[0];

  return (
    <div
      onClick={onClick}
      className="cursor-pointer text-center group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="bg-gray-50 rounded-lg overflow-hidden mb-4 h-64 flex items-center justify-center">
        <img
          src={displayImage}
          alt={product.name}
          className="h-full object-contain transition-all duration-300 group-hover:scale-105"
        />
      </div>

      {/* Name */}
      <h3 className="text-sm font-medium text-gray-900 leading-snug mb-2">
        {product.name}
      </h3>

      {/* Rating (optional) */}
      {product.rating && (
        <div className="flex justify-center items-center gap-1 mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= product.rating
                  ? "text-black fill-current"
                  : "text-gray-300"
              }`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500">
            ({product.reviews})
          </span>
        </div>
      )}

      {/* Price */}
      <p className="text-base font-semibold text-gray-900">
        MRP ₹{product.price.toLocaleString("en-IN")}
      </p>
    </div>
  );
}
