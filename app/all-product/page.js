"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProductList from "@/components/ProductList";

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sort: "latest",
    promo: "",
    minPrice: "",
    maxPrice: "",
  });

  return (
    <div className="w-full flex justify-center mt-4 mb-4">
      {/* 7xl Container */}
      <div className="w-full max-w-7xl px-4">
        <div className="flex gap-6">
          <Sidebar filters={filters} setFilters={setFilters} />

          <div className="flex-1">
            <ProductList filters={filters} />
          </div>
        </div>
      </div>
    </div>
  );
}
