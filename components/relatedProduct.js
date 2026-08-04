"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { resolveImageUrl } from "@/utils/resolveImageUrl";

function getGalleryImages(product) {
  const imagePaths = product?.images?.[0]?.imagePath;
  if (!Array.isArray(imagePaths)) return [];
  return imagePaths.filter(Boolean);
}

export default function RelatedProduct({ categoryId, currentProductId }) {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRelated = async () => {
      if (!categoryId) {
        setItems([]);
        return;
      }

      try {
        setLoading(true);
        const res = await fetch(
          `/api/products/filter?categoryId=${encodeURIComponent(
            String(categoryId)
          )}&limit=20`,
          {
            cache: "no-store",
          }
        );
        const payload = await res.json();
        if (!res.ok) {
          setItems([]);
          return;
        }

        const rawProducts = payload?.data?.products || [];
        const filtered = rawProducts.filter(
          (p) => String(p.id) !== String(currentProductId)
        );
        setItems(filtered.slice(0, 4));
      } catch (error) {
        console.error("RELATED_PRODUCTS_ERROR", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadRelated();
  }, [categoryId, currentProductId]);

  const products = useMemo(() => items || [], [items]);
  if (!categoryId || (!loading && products.length === 0)) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <h2 className="text-2xl font-semibold text-gray-900 mb-8">
        You may also like
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="text-center">
              <div className="bg-gray-100 rounded-lg h-64 animate-pulse mb-4" />
              <div className="h-4 bg-gray-100 rounded animate-pulse mb-2" />
              <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => router.push(`/all-product/${product.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function ProductCard({ product, onClick }) {
  const [hovered, setHovered] = useState(false);
  const gallery = getGalleryImages(product);
  const first = product?.mainImage || gallery[0] || "";
  const second = gallery.find((img) => img !== first) || first;
  const hasSecondImage = Boolean(second && second !== first);
  const displayImage = hovered && hasSecondImage ? second : first;

  return (
    <div
      onClick={onClick}
      className="cursor-pointer text-center group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="bg-gray-50 rounded-lg overflow-hidden mb-4 h-64 flex items-center justify-center">
        <img
          src={resolveImageUrl(displayImage, "/yumei_logo.png")}
          alt={product?.name || "Product"}
          className="h-full object-contain transition-all duration-300 group-hover:scale-105"
        />
      </div>

      <h3 className="text-sm font-medium text-gray-900 leading-snug mb-2 line-clamp-2">
        {product?.name || "-"}
      </h3>

      <p className="text-base font-semibold text-gray-900">
        MRP Rs. {Number(product?.sellPrice || 0).toLocaleString("en-IN")}
      </p>
    </div>
  );
}
