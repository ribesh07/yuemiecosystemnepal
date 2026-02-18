"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/ApisafeCalls";

export default function ProductList({ filters }) {
  const router = useRouter(); // ✅ add this

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await apiRequest("/products", false);
        const apiProducts = result?.products || [];

        const mappedProducts = apiProducts.map((p) => ({
          id: p.id,
          title: p.name || "Unnamed Product",
          category: p.categoryName || "Uncategorized",
          price: Number(p.sellPrice) || 0,
          image:
            p.mainImage ||
            p.images?.[0]?.mainImage ||
            "/images/default-product.jpg",
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    let data = [...products];
    return data;
  }, [products]);

  if (loading) {
    return <p className="text-center py-8">Loading...</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filtered.map((product) => (
        <div
          key={product.id}
          onClick={() => router.push(`/products/${product.id}`)} // ✅ Navigate
          className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
        >
          <div className="relative w-full h-48 bg-gray-100">
            <Image
              src={`http://localhost:3000${product.image}`}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-3 text-center">
            <h3 className="font-medium text-sm mb-1">
              {product.title}
            </h3>
            <p className="text-orange-600 font-semibold text-sm">
              Rs {product.price.toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
