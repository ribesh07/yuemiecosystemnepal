"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

const PRODUCTS = [
  {
    id: 1,
    name: "D6Ai 4K Dash Camera",
    price: 27999,
    available: true,
    image:
      "https://yuemiecosystem.com/cdn/shop/files/WhatsAppImage2026-01-12at11.13.32.jpg?v=1768370208",
  },
  {
    id: 2,
    name: "Q5 Triple Camera Setup",
    price: 27999,
    available: true,
    image:
      "https://yuemiecosystem.com/cdn/shop/files/WhatsAppImage2025-11-27at12.11.16.jpg?v=1768374675",
  },
  {
    id: 3,
    name: "Yuemi C3 Rear View Camera",
    price: 2499,
    available: true,
    image:
      "https://yuemiecosystem.com/cdn/shop/files/Yuemi_c3_1st.jpg?v=1732186338",
  },
  {
    id: 4,
    name: "Yuemi C1 Rear AHD Camera",
    price: 2499,
    available: false,
    image:
      "https://yuemiecosystem.com/cdn/shop/files/Rear_AHD_Camera.jpg?v=1728623892",
  },
  {
    id: 5,
    name: "Q5 Triple Camera Setup",
    price: 27999,
    available: true,
    image:
      "https://yuemiecosystem.com/cdn/shop/files/WhatsAppImage2025-11-27at12.11.16.jpg?v=1768374675",
  },
  {
    id: 6,
    name: "Yuemi C3 Rear View Camera",
    price: 2499,
    available: true,
    image:
      "https://yuemiecosystem.com/cdn/shop/files/Yuemi_c3_1st.jpg?v=1732186338",
  },
  {
    id: 7,
    name: "Yuemi C1 Rear AHD Camera",
    price: 2499,
    available: false,
    image:
      "https://yuemiecosystem.com/cdn/shop/files/Rear_AHD_Camera.jpg?v=1728623892",
  },
];

export default function ProductsPage() {
  const router = useRouter();

  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("az");
  const [priceRange, setPriceRange] = useState("all");

  const filteredProducts = useMemo(() => {
    let data = [...PRODUCTS];

    if (availability !== "all") {
      data = data.filter((p) => p.available === (availability === "in"));
    }

    if (priceRange === "low") {
      data = data.filter((p) => p.price <= 5000);
    } else if (priceRange === "mid") {
      data = data.filter((p) => p.price > 5000 && p.price <= 20000);
    } else if (priceRange === "high") {
      data = data.filter((p) => p.price > 20000);
    }

    if (sortBy === "az") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "za") {
      data.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "priceLow") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      data.sort((a, b) => b.price - a.price);
    }

    return data;
  }, [availability, sortBy, priceRange]);

  const handleProductClick = (product) => {
    router.push(`/product-details?id=${product.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Products Grid */}
      {/* Hero Banner with Overlay */}
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
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-10 transition-shadow duration-300 hover:shadow-md">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            {/* Left Filters */}
            <div className="flex flex-wrap gap-4">
              <div className="relative group">
                <select
                  className="appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-lg text-gray-700 font-medium cursor-pointer transition-all duration-200 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                >
                  <option value="all">All Products</option>
                  <option value="in">In Stock</option>
                  <option value="out">Sold Out</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative group">
                <select
                  className="appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-lg text-gray-700 font-medium cursor-pointer transition-all duration-200 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <option value="all">All Prices</option>
                  <option value="low">Below ₹5,000</option>
                  <option value="mid">₹5,000 – ₹20,000</option>
                  <option value="high">Above ₹20,000</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="relative group">
              <select
                className="appearance-none bg-white border border-gray-300 px-4 py-2.5 pr-10 rounded-lg text-gray-700 font-medium cursor-pointer transition-all duration-200 hover:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="az">Alphabetically, A–Z</option>
                <option value="za">Alphabetically, Z–A</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Image */}
              <div className="relative bg-gray-50 h-80 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-110"
                />
                {!product.available && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white px-4 py-2 rounded-full font-semibold text-sm">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600">
                  {product.name}
                </h3>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
