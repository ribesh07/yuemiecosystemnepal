"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/ApisafeCalls";

interface Product {
  id: string;
  name: string;
  description: string;
  sellPrice: number;
  actualPrice: number;
  stockQuantity: number;
  availableQuantity: number;
  available: boolean;
  mainImage: string;
  brandName: string;
}

export default function CategoryProductsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const router = useRouter();
  const { categoryId } = use(params);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  // Filter states
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // =========================
  // FETCH PRODUCTS
  // =========================
  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const result = await apiRequest(
          `/products/filter?categoryId=${categoryId}`,
          false,
        );

        const apiProducts = result?.data?.products || [];

        const mappedProducts: Product[] = apiProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          sellPrice: Number(p.sellPrice),
          actualPrice: Number(p.actualPrice),
          stockQuantity: Number(p.stockQuantity),
          availableQuantity: Number(p.availableQuantity),
          available: Number(p.availableQuantity) > 0,
          mainImage:
            p.mainImage ||
            p.images?.[0]?.mainImage ||
            "/images/default-product.jpg",
          brandName: p.brand?.name || "",
        }));

        setProducts(mappedProducts);
        
        // Try to get category name from first product or use categoryId
        if (apiProducts.length > 0 && apiProducts[0].category?.category) {
          setCategoryName(apiProducts[0].category.category);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  // =========================
  // FILTERING & SORTING
  // =========================
  const filteredProducts = useMemo(() => {
    let data = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brandName.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Availability filter
    if (availability !== "all") {
      data = data.filter((p) => p.available === (availability === "in"));
    }

    // Price range filter
    if (priceRange === "low") data = data.filter((p) => p.sellPrice <= 5000);
    else if (priceRange === "mid")
      data = data.filter((p) => p.sellPrice > 5000 && p.sellPrice <= 20000);
    else if (priceRange === "high")
      data = data.filter((p) => p.sellPrice > 20000);

    // Sorting
    if (sortBy === "az") data.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "za") data.sort((a, b) => b.name.localeCompare(a.name));
    else if (sortBy === "priceLow")
      data.sort((a, b) => a.sellPrice - b.sellPrice);
    else if (sortBy === "priceHigh")
      data.sort((a, b) => b.sellPrice - a.sellPrice);

    return data;
  }, [products, availability, sortBy, priceRange, searchQuery]);

  // Clear all filters
  const clearFilters = () => {
    setAvailability("all");
    setSortBy("featured");
    setPriceRange("all");
    setSearchQuery("");
  };

  const activeFilterCount = [
    availability !== "all",
    priceRange !== "all",
    searchQuery.trim() !== "",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Banner Skeleton */}
        <div className="h-64 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filter bar skeleton */}
          <div className="mb-8 space-y-4">
            <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="flex gap-4">
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>

          {/* Products grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="h-56 bg-gray-200 rounded-xl mb-4 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative h-64 bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-10"></div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/90 text-sm mb-4">
            <button onClick={() => router.push("/")} className="hover:text-white transition">
              Home
            </button>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <button onClick={() => router.push("/categories")} className="hover:text-white transition">
              Categories
            </button>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-white font-medium">{categoryName || "Products"}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
            {categoryName || "Our Products"}
          </h1>
          <p className="text-white/90 text-lg">
            Discover {products.length} amazing products in this category
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name, brand, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </button>

            {/* Desktop Filters */}
            <div className={`${showFilters ? 'flex' : 'hidden lg:flex'} flex-wrap gap-4 flex-1`}>
              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="az">Name: A to Z</option>
                <option value="za">Name: Z to A</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>

              {/* Price Range */}
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₹5,000</option>
                <option value="mid">₹5,000 - ₹20,000</option>
                <option value="high">Above ₹20,000</option>
              </select>

              {/* Availability */}
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none cursor-pointer"
              >
                <option value="all">All Products</option>
                <option value="in">In Stock Only</option>
                <option value="out">Out of Stock</option>
              </select>
            </div>

            {/* Results Count & Clear */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search query
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const discount = product.actualPrice > product.sellPrice
                ? Math.round(((product.actualPrice - product.sellPrice) / product.actualPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/all-product/${product.id}`)}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square bg-gray-50 overflow-hidden">
                    <img
                      src={`http://localhost:3000${product.mainImage}`}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {discount > 0 && (
                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg">
                          {discount}% OFF
                        </span>
                      )}
                      {!product.available && (
                        <span className="px-2 py-1 bg-gray-800 text-white text-xs font-semibold rounded-lg">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Quick View on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Quick View
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {product.brandName && (
                      <p className="text-xs font-medium text-orange-600 mb-1 uppercase tracking-wide">
                        {product.brandName}
                      </p>
                    )}
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.sellPrice.toLocaleString()}
                      </span>
                      {discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.actualPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Stock Info */}
                    {product.available && product.availableQuantity <= 10 && (
                      <p className="text-xs text-orange-600 font-medium">
                        Only {product.availableQuantity} left in stock
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}