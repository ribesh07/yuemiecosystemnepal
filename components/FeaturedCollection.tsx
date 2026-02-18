'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { apiRequest } from '@/utils/ApisafeCalls';

interface Product {
  id: string;
  productCode: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  brandId: number;
  brandName: string;
  actualPrice: string;
  sellPrice: string;
  availableQuantity: string;
  mainImage: string;
  flashSaleProduct: boolean;
  todayDeals: boolean;
  specialProduct: boolean;
  images: Array<{
    id: string;
    mainImage: string;
  }>;
  brand: {
    id: number;
    name: string;
  };
}

interface Category {
  id: string;
  category: string;
  image: string;
}

export default function FeaturedCollections() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [categoryProducts, setCategoryProducts] = useState<{ [key: string]: Product[] }>({});
  const [loading, setLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await apiRequest('/categories', false);
        const apiCategories = result?.data?.categories || [];
        
        // Take only first 2 categories for the tabs
        const limitedCategories = apiCategories.slice(0, 2).map((cat: any) => ({
          id: cat.id,
          category: cat.category,
          image: cat.image,
        }));

        setCategories(limitedCategories);
        
        // Set first category as active
        if (limitedCategories.length > 0) {
          setActiveTab(limitedCategories[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when active tab changes
  useEffect(() => {
    if (!activeTab) return;

    const fetchProducts = async () => {
      // Check if we already have products for this category
      if (categoryProducts[activeTab]) {
        return;
      }

      try {
        setLoading(true);
        const result = await apiRequest(`/products/filter?categoryId=${activeTab}`, false);
        const apiProducts = result?.data?.products || [];

        // Take only first 4 products and sort by newest
        const limitedProducts = apiProducts
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 4);

        setCategoryProducts((prev) => ({
          ...prev,
          [activeTab]: limitedProducts,
        }));
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setCategoryProducts((prev) => ({
          ...prev,
          [activeTab]: [],
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]);

  const currentProducts = categoryProducts[activeTab] || [];

  const handleProductClick = (productId: string) => {
    router.push(`/all-product/${productId}`);
  };

  if (categories.length === 0) {
    return null; // Don't render if no categories
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Featured Collections
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of premium products
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 ${
                activeTab === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-orange-300 hover:shadow-md'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && !currentProducts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100">
                <div className="h-72 bg-gray-200 animate-pulse"></div>
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : currentProducts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products available
            </h3>
            <p className="text-gray-600">
              Check back later for new arrivals in this category
            </p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => {
              const discount = Number(product.actualPrice) > Number(product.sellPrice)
                ? Math.round(((Number(product.actualPrice) - Number(product.sellPrice)) / Number(product.actualPrice)) * 100)
                : 0;
              
              const isOutOfStock = Number(product.availableQuantity) === 0;
              const isLowStock = Number(product.availableQuantity) > 0 && Number(product.availableQuantity) <= 10;

              return (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-orange-200"
                >
                  {/* Image Container */}
                  <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <div className="relative h-72">
                      <Image
                        src={`http://localhost:3000${product.mainImage}`}
                        alt={product.name}
                        fill
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    {/* Badges Container - Top Right */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      {isOutOfStock && (
                        <span className="px-3 py-1.5 bg-gray-800 text-white rounded-full text-xs font-bold shadow-lg">
                          Sold Out
                        </span>
                      )}
                      {!isOutOfStock && discount > 0 && (
                        <span className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                          {discount}% OFF
                        </span>
                      )}
                      {product.flashSaleProduct && (
                        <span className="px-3 py-1.5 bg-yellow-500 text-white rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                          Flash
                        </span>
                      )}
                      {product.todayDeals && (
                        <span className="px-3 py-1.5 bg-purple-500 text-white rounded-full text-xs font-bold shadow-lg">
                          Today's Deal
                        </span>
                      )}
                      {product.specialProduct && (
                        <span className="px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs font-bold shadow-lg">
                          Special
                        </span>
                      )}
                    </div>

                    {/* Brand Badge - Top Left */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-white rounded-full px-3 py-1.5 flex items-center gap-2 shadow-lg backdrop-blur-sm bg-opacity-95">
                        <div className="w-5 h-5 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                        <span className="text-xs font-bold text-gray-800">{product.brand.name}</span>
                      </div>
                    </div>

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Quick View
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    {/* Category Badge */}
                    <p className="text-xs font-semibold text-orange-600 mb-2 uppercase tracking-wide">
                      {product.categoryName}
                    </p>

                    {/* Product Name */}
                    <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 min-h-[40px] group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>

                    {/* Stock Status */}
                    {isLowStock && !isOutOfStock && (
                      <div className="flex items-center gap-1 mb-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-orange-600 font-semibold">
                          Only {product.availableQuantity} left
                        </span>
                      </div>
                    )}

                    {/* Pricing */}
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">MRP</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xl font-bold text-gray-900">
                          Rs. {Number(product.sellPrice).toLocaleString('en-IN')}
                        </p>
                        {discount > 0 && (
                          <p className="text-sm text-gray-500 line-through">
                            Rs. {Number(product.actualPrice).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                      {discount > 0 && (
                        <p className="text-xs text-green-600 font-semibold">
                          Save Rs. {(Number(product.actualPrice) - Number(product.sellPrice)).toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Button */}
        {currentProducts.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => {
                const category = categories.find(c => c.id === activeTab);
                if (category) {
                  router.push(`/categories/${activeTab}`);
                }
              }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              View All Products
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}