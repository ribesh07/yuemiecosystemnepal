"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { apiRequest } from "@/utils/ApisafeCalls"; // your API helper

export default function ProductList({ filters }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // Fetch products from API
  // =========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await apiRequest("/products", false); // GET /api/products
        const apiProducts = result?.products || [];

        const mappedProducts = apiProducts.map((p) => ({
          id: p.id,
          title: p.name || "Unnamed Product",
          category: p.categoryName || "Uncategorized",
          price: Number(p.sellPrice) || 0,
          promo: p.flashSaleProduct
            ? "flashSale"
            : p.todayDeals
            ? "todayDeals"
            : p.specialProduct
            ? "special"
            : "none",
          image:
            p.mainImage ||
            (p.images?.[0]?.mainImage ? p.images[0].mainImage : "/images/default-product.jpg"),
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

  // =========================
  // Filter & Sort
  // =========================
  const filtered = useMemo(() => {
    let data = [...products];

    // Filter
    data = data.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(filters.search?.toLowerCase() || "");
      const matchCategory = !filters.category || p.category === filters.category;
      const matchPromo = !filters.promo || p.promo === filters.promo;
      const matchMin = !filters.minPrice || p.price >= Number(filters.minPrice);
      const matchMax = !filters.maxPrice || p.price <= Number(filters.maxPrice);
      return matchSearch && matchCategory && matchPromo && matchMin && matchMax;
    });

    // Sort
    if (filters.sort === "priceLow") data.sort((a, b) => a.price - b.price);
    if (filters.sort === "priceHigh") data.sort((a, b) => b.price - a.price);

    return data;
  }, [products, filters]);

  if (loading) {
    return <p className="text-center py-8 text-gray-500">Loading products...</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filtered.length === 0 && (
        <p className="col-span-full text-center text-gray-500">No products found.</p>
      )}

      {filtered.map((product) => (
        <div
          key={product.id}
          className="border rounded-lg overflow-hidden hover:shadow-lg transition"
        >
          <div className="relative w-full h-48 bg-gray-100">
            <Image src={product.image} alt={product.title} fill className="object-cover" />
          </div>

          <div className="p-3 text-center">
            <h3 className="font-medium text-sm mb-1">{product.title}</h3>
            <p className="text-orange-600 font-semibold text-sm">
              Rs {product.price.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500">{product.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
