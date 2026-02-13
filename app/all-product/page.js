"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/ApisafeCalls";

export default function AllProductPage() {
  const router = useRouter();
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
          image: p.mainImage || p.images?.[0]?.mainImage || "/images/default-product.jpg",
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

  if (loading) return <p className="text-center py-8">Loading products...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">All Products</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/all-product/${product.id}`)} // ✅ must match folder
            className="border rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
          >
            <div className="relative w-full h-48 bg-gray-100">
              <Image
                src={`http://localhost:3000${product.image}`}
                alt={product.title}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-3 text-center">
              <h3 className="font-medium text-sm mb-1">{product.title}</h3>
              <p className="text-orange-600 font-semibold text-sm">
                Rs {product.price.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
