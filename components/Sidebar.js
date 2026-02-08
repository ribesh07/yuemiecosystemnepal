"use client";

import { useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Tag,
  DollarSign,
  TrendingUp,
  Grid3x3,
  X,
  Filter,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Percent,
  Check,
} from "lucide-react";

export default function Sidebar({ filters, setFilters }) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    sort: true,
    promo: true,
    price: true,
  });

  const categories = [
    { name: "Y Series Tint Film", count: 24, icon: "🎨" },
    { name: "U Series Tint Film", count: 18, icon: "🌟" },
    { name: "E Series Tint Film", count: 32, icon: "⚡" },
    { name: "M Series Tint Film", count: 15, icon: "💎" },
    { name: "I Series Tint Film", count: 21, icon: "✨" },
    { name: "PPF", count: 12, icon: "🛡️" },
  ];

  const sortOptions = [
    { value: "latest", label: "Latest Products", icon: TrendingUp },
    { value: "priceLow", label: "Price: Low to High", icon: DollarSign },
    { value: "priceHigh", label: "Price: High to Low", icon: DollarSign },
    { value: "popular", label: "Most Popular", icon: Sparkles },
  ];

  const promoOptions = [
    { value: "wholesale", label: "Wholesale", badge: "Hot", color: "red" },
    { value: "addon", label: "Add-on Deals", badge: "New", color: "blue" },
    { value: "discount", label: "Special Discount", badge: "-30%", color: "green" },
  ];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      sort: "latest",
      promo: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.promo ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <aside className="w-full md:w-80 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-yellow-500 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Filters</h2>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white/30 transition-all"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
        
        {/* Active Filters Count */}
        {hasActiveFilters && (
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-white">
            <span className="font-medium">
              {[
                filters.search && "Search",
                filters.category && "Category",
                filters.promo && "Promo",
                (filters.minPrice || filters.maxPrice) && "Price",
              ]
                .filter(Boolean)
                .join(", ")}{" "}
              active
            </span>
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar ">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-gray-700 placeholder-gray-400"
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ ...filters, search: "" })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Category Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("category")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Grid3x3 className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-gray-900">Category</h3>
            </div>
            {expandedSections.category ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.category && (
            <div className="p-4 pt-0 space-y-2">
              <button
                onClick={() => setFilters({ ...filters, category: "" })}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  filters.category === ""
                    ? "bg-indigo-50 border-2 border-indigo-500 text-indigo-700"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="font-medium">All Categories</span>
                {filters.category === "" && (
                  <Check className="w-5 h-5 text-indigo-600" />
                )}
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() =>
                    setFilters({ ...filters, category: cat.name })
                  }
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    filters.category === cat.name
                      ? "bg-indigo-50 border-2 border-indigo-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span
                      className={`font-medium ${
                        filters.category === cat.name
                          ? "text-indigo-700"
                          : "text-gray-700"
                      }`}
                    >
                      {cat.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                      {cat.count}
                    </span>
                    {filters.category === cat.name && (
                      <Check className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("sort")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900">Sort By</h3>
            </div>
            {expandedSections.sort ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.sort && (
            <div className="p-4 pt-0 space-y-2">
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() =>
                      setFilters({ ...filters, sort: option.value })
                    }
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      filters.sort === option.value
                        ? "bg-purple-50 border-2 border-purple-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`w-4 h-4 ${
                          filters.sort === option.value
                            ? "text-purple-600"
                            : "text-gray-500"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          filters.sort === option.value
                            ? "text-purple-700"
                            : "text-gray-700"
                        }`}
                      >
                        {option.label}
                      </span>
                    </div>
                    {filters.sort === option.value && (
                      <Check className="w-5 h-5 text-purple-600" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Promotion Section */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("promo")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Percent className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900">Promotions</h3>
            </div>
            {expandedSections.promo ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.promo && (
            <div className="p-4 pt-0 space-y-2">
              <button
                onClick={() => setFilters({ ...filters, promo: "" })}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  filters.promo === ""
                    ? "bg-green-50 border-2 border-green-500 text-green-700"
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="font-medium">All Products</span>
                {filters.promo === "" && (
                  <Check className="w-5 h-5 text-green-600" />
                )}
              </button>

              {promoOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setFilters({ ...filters, promo: option.value })
                  }
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    filters.promo === option.value
                      ? "bg-green-50 border-2 border-green-500"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Tag
                      className={`w-4 h-4 ${
                        filters.promo === option.value
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        filters.promo === option.value
                          ? "text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${
                        option.color === "red"
                          ? "bg-red-100 text-red-600"
                          : option.color === "blue"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {option.badge}
                    </span>
                    {filters.promo === option.value && (
                      <Check className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div> */}

        {/* Price Range Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <button
            onClick={() => toggleSection("price")}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900">Price Range</h3>
            </div>
            {expandedSections.price ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {expandedSections.price && (
            <div className="p-4 pt-0 space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Min Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, minPrice: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-end pb-2.5">
                  <div className="h-[1px] w-3 bg-gray-300"></div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Max Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                      Rs
                    </span>
                    <input
                      type="number"
                      placeholder="∞"
                      className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPrice: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Quick Price Options */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {[
                  { label: "Under Rs 100", max: "100" },
                  { label: "Rs 100-500", min: "100", max: "500" },
                  { label: "Rs 500-1000", min: "500", max: "1000" },
                  { label: "Over Rs 1000", min: "1000" },
                ].map((range) => (
                  <button
                    key={range.label}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        minPrice: range.min || "",
                        maxPrice: range.max || "",
                      })
                    }
                    className="px-3 py-2 bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg text-xs font-medium text-gray-700 hover:text-orange-700 transition-all"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clear Button - Sticky at Bottom */}
      {hasActiveFilters && (
        <div className="p-4 bg-white border-t border-gray-200 shadow-lg">
          <button
            onClick={clearFilters}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <X className="w-5 h-5" />
            Clear All Filters
          </button>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
}