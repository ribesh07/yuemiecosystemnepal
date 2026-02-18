"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const YuemiCategoriesDropdown = () => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [categories, setCategories] = useState([]);

  // Fetch categories from your API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories"); // replace with your actual API endpoint if different
        const data = await res.json();
        if (data.success && data.data.categories) {
          // Map API data to the shape you need
          const mappedCategories = data.data.categories.map((cat) => ({
            id: cat.id,
            name: cat.category,
            slug: cat.category.toLowerCase().replace(/\s+/g, "-"),
            image: cat.image || "/images/default-category.jpg", // fallback if image missing
            productCount: cat.productCount || 0, // optional, API doesn’t provide count
            description: cat.description || "Explore this category of products",
            features: ["High quality", "Durable", "Customer favorite"], // default features
          }));
          setCategories(mappedCategories);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  if (!categories.length) {
    return (
      <p className="text-center py-8 text-gray-500">Loading categories...</p>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          Our Categories
        </h2>
        <div className="w-20 h-1 bg-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">
          Premium automotive accessories by Yuemi
        </p>
      </div>

      {/* Dropdown Categories */}
      <div className="space-y-4">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            {/* Category Header */}
            <div
              onClick={() =>
                setExpandedCategory(
                  expandedCategory === category.id ? null : category.id,
                )
              }
              className="cursor-pointer p-6 flex items-center justify-between hover:bg-orange-50 transition-colors duration-200"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-orange-200">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {category.name}
                  </h3>
                  <div className="flex items-center gap-3">
                    {/* <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-orange-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      {category.productCount} products
                    </span> */}
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span className="text-sm text-orange-500 font-medium">
                      View Details
                    </span>
                  </div>
                </div>
              </div>

              <div className="ml-4">
                <svg
                  className={`w-6 h-6 text-orange-500 transition-transform duration-300 ${
                    expandedCategory === category.id ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                expandedCategory === category.id ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gradient-to-b from-orange-50/50 to-white">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-800 mb-2">
                        Key Features:
                      </p>
                      {category.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="relative h-48 rounded-xl overflow-hidden border border-orange-200">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    In Stock & Ready to Ship
                  </div>
                  <Link
                    href={`/cate-productlist?categoryId=${category.id}`} // pass the category ID
                    className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
                  >
                    Explore Category
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center p-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
        <p className="text-gray-700 mb-4">
          Can't find what you're looking for?
        </p>
        <Link
          href="/all-product"
          className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
        >
          Browse All Products
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default YuemiCategoriesDropdown;
