"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatPrice = (value) => {
  return `Rs. ${toNumber(value).toLocaleString()}`;
};

const getAvgRating = (reviews = []) => {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, review) => sum + toNumber(review?.rating), 0);
  return Number((total / reviews.length).toFixed(1));
};

const Bestseller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [desktopStartIndex, setDesktopStartIndex] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products", { cache: "no-store" });
        const data = await res.json();

        const allProducts = Array.isArray(data?.products) ? data.products : [];

        const latestSpecial = allProducts
          .filter(
            (p) =>
              p?.specialProduct === true &&
              Number(p?.status) === 1
          )
          .sort(
            (a, b) =>
              new Date(b?.createdAt || 0).getTime() -
              new Date(a?.createdAt || 0).getTime()
          )
          .slice(0, 10)
          .map((p) => ({
            id: p.id,
            badge: p.brandName || "YueMi Ecosystem",
            tag: Number(p?.availableQuantity || 0) <= 0 ? "Sold out" : "",
            name: p.name || "Unnamed Product",
            image: p.mainImage || "/yumei_logo.png",
            mrp: formatPrice(p.sellPrice),
            rating: getAvgRating(p.reviews),
            reviews: Array.isArray(p.reviews) ? p.reviews.length : 0,
            isSoldOut: Number(p?.availableQuantity || 0) <= 0,
          }));

        if (mounted) setProducts(latestSpecial);
      } catch {
        if (mounted) setProducts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  const renderStars = (rating, reviews, id) => {
    if (rating <= 0) return null;

    return (
      <div className="flex items-center gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFull = star <= Math.floor(rating);
          const isHalf = !isFull && star - 0.5 === rating;
          const gradientId = `half-${id}-${star}`;

          return (
            <svg
              key={star}
              className={`w-4 h-4 ${isFull ? "text-yellow-400 fill-current" : "text-gray-300"}`}
              viewBox="0 0 20 20"
            >
              {isHalf && (
                <defs>
                  <linearGradient id={gradientId}>
                    <stop offset="50%" stopColor="currentColor" />
                    <stop offset="50%" stopColor="#D1D5DB" stopOpacity="1" />
                  </linearGradient>
                </defs>
              )}
              <path
                fill={isHalf ? `url(#${gradientId})` : "currentColor"}
                d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
              />
            </svg>
          );
        })}
        {reviews > 0 && <span className="text-sm text-gray-600 ml-1">({reviews})</span>}
      </div>
    );
  };

  const hasProducts = useMemo(() => products.length > 0, [products]);
  const desktopVisibleCount = 4;
  const desktopVisibleProducts = useMemo(() => {
    if (!products.length) return [];
    if (products.length <= desktopVisibleCount) return products;
    return Array.from({ length: desktopVisibleCount }, (_, idx) => {
      const i = (desktopStartIndex + idx) % products.length;
      return products[i];
    });
  }, [products, desktopStartIndex]);

  const goDesktopPrev = () => {
    if (products.length <= desktopVisibleCount) return;
    setDesktopStartIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const goDesktopNext = () => {
    if (products.length <= desktopVisibleCount) return;
    setDesktopStartIndex((prev) => (prev + 1) % products.length);
  };

  return (
    <section className="py-10 md:py-12 px-3 sm:px-4 max-w-7xl mx-auto">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12">Special Products</h2>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="bg-white rounded-lg border p-4 animate-pulse h-[360px]" />
          ))}
        </div>
      ) : !hasProducts ? (
        <div className="text-center text-gray-500">No special products found.</div>
      ) : (
        <>
          <div className="hidden lg:flex justify-end gap-2 mb-4">
            <button
              type="button"
              onClick={goDesktopPrev}
              disabled={products.length <= desktopVisibleCount}
              className="h-10 w-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous special products"
            >
              <span aria-hidden>‹</span>
            </button>
            <button
              type="button"
              onClick={goDesktopNext}
              disabled={products.length <= desktopVisibleCount}
              className="h-10 w-10 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next special products"
            >
              <span aria-hidden>›</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="relative bg-gray-100 p-2 sm:p-3">
                  <div className="aspect-square relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[34px]">
                    {product.name}
                  </h3>
                  <p className="text-sm sm:text-base font-bold text-gray-900">{product.mrp}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:grid lg:grid-cols-4 gap-4 md:gap-6">
          {desktopVisibleProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="relative bg-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full text-sm">
                    <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      Y
                    </span>
                    {product.badge}
                  </span>
                  {product.tag && (
                    <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
                      {product.tag}
                    </span>
                  )}
                </div>

                <div className="aspect-square relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />

                  {!product.isSoldOut && (
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                      <Link
                        href={`/all-product/${product.id}`}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300"
                      >
                        VIEW PRODUCT
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>

                {renderStars(product.rating, product.reviews, product.id)}

                <p className="text-lg font-bold text-gray-900 mt-3">MRP {product.mrp}</p>
              </div>
            </div>
          ))}
          </div>
        </>
      )}

      <div className="flex justify-center mt-10">
        <Link
          href="/all-product"
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded border-2 border-orange-600 transition-all duration-300 hover:shadow-lg"
        >
          View All
        </Link>
      </div>
    </section>
  );
};

export default Bestseller;
