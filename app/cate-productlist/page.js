"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/utils/ApisafeCalls";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPage />
    </Suspense>
  );
}

function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("az");
  const [priceRange, setPriceRange] = useState("all");

  // =========================
  // FETCH PRODUCTS FROM API
  // =========================
  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await apiRequest(`/products/filter?categoryId=${categoryId}`, false);
        const apiProducts = result?.data?.products || [];

        // Map API data to the shape your UI expects
        const mappedProducts = apiProducts.map((p) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          sellPrice: Number(p.sellPrice),
          actualPrice: Number(p.actualPrice),
          stockQuantity: Number(p.stockQuantity),
          availableQuantity: Number(p.availableQuantity),
          available: Number(p.availableQuantity) > 0,
          mainImage: p.mainImage || (p.images[0]?.mainImage || "/images/default-product.jpg"),
          brandName: p.brand?.name || "",
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
  }, [categoryId]);

  // =========================
  // CLIENT-SIDE FILTERING
  // =========================
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Availability filter
    if (availability !== "all") {
      data = data.filter((p) => p.available === (availability === "in"));
    }

    // Price filter
    if (priceRange === "low") data = data.filter((p) => p.sellPrice <= 5000);
    else if (priceRange === "mid") data = data.filter((p) => p.sellPrice > 5000 && p.sellPrice <= 20000);
    else if (priceRange === "high") data = data.filter((p) => p.sellPrice > 20000);

    // Sorting
    if (sortBy === "az") data.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "za") data.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === "priceLow") data.sort((a, b) => a.sellPrice - b.sellPrice);
    else if (sortBy === "priceHigh") data.sort((a, b) => b.sellPrice - a.sellPrice);

    return data;
  }, [products, availability, sortBy, priceRange]);

  const handleProductClick = (product) => {
    router.push(`/product-details?id=${product.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading products...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Banner */}
      <section className="relative h-[480px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage:
              "url('https://yuemiecosystem.com/cdn/shop/files/Yuemi_Car_Safety_Banner.jpg?v=1732187436')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <select
                className="border px-4 py-2.5 rounded-lg"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="all">All Products</option>
                <option value="in">In Stock</option>
                <option value="out">Sold Out</option>
              </select>

              <select
                className="border px-4 py-2.5 rounded-lg"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="low">Below ₹5,000</option>
                <option value="mid">₹5,000 – ₹20,000</option>
                <option value="high">Above ₹20,000</option>
              </select>
            </div>

            <select
              className="border px-4 py-2.5 rounded-lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="az">Alphabetically, A–Z</option>
              <option value="za">Alphabetically, Z–A</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              products
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-500">
            No products found in this category.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group bg-white rounded-xl overflow-hidden shadow-sm border hover:shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <div className="relative bg-gray-50 h-80 overflow-hidden">
                <img
                  src={product.mainImage}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 group-hover:scale-110 transition"
                />

                {!product.available && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white px-4 py-2 rounded-full font-semibold text-sm">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-semibold mb-2 group-hover:text-orange-600">
                  {product.name}
                </h3>
                <span className="text-2xl font-bold">
                  ₹{Number(product.sellPrice).toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
