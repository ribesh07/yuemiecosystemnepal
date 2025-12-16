'use client';

import { useState } from 'react';

const products = {
  'Car Infotainment System': [
    {
      id: 1,
      name: 'Yuemi E1 2GB+46GB Multimedia Player with CarPlay AndroidAuto DDR 2GB(DDR4)',
      price: '₹15,999.00',
      image: '/categories/pro1.jpg',
      badge: 'Sold out',
      rating: 0,
      reviews: 0
    },
    {
      id: 2,
      name: 'YueMi M1 Pro Car Infotainment System 4+64GB(DSP)',
      price: '₹24,999.00',
      image: '/categories/pro6.jpg',
      badge: null,
      rating: 4.5,
      reviews: 2
    },
    {
      id: 3,
      name: 'YueMi M11 4GB+64GB Digital Knob Car Infotainment System',
      price: '₹49,999.00',
      image: '/categories/pro4.jpg',
      badge: null,
      rating: 0,
      reviews: 0
    },
    {
      id: 4,
      name: 'YueMi M2 2GB+32 GB Multimedia Player with 360° Birdview Support & DSP (DDR 4 RAM)',
      price: '₹29,999.00',
      image: '/categories/pro3.jpg',
      badge: null,
      rating: 4.5,
      reviews: 2
    }
  ],
  'Car Safety': [
    {
      id: 5,
      name: 'Dash Camera Pro 4K',
      price: '₹8,999.00',
      image: '/categories/pro2.jpg',
      badge: null,
      rating: 5,
      reviews: 5
    },
    {
      id: 6,
      name: 'Smart Parking Sensor System',
      price: '₹5,599.00',
      image: '/categories/pro2.jpg',
      badge: 'New',
      rating: 4,
      reviews: 3
    },
    {
      id: 7,
      name: 'Dash Camera Pro 4K',
      price: '₹5,799.00',
      image: '/categories/pro2.jpg',
      badge: 'New',
      rating: 4,
      reviews: 3
    },
    {
      id: 8,
      name: 'Smart Parking Sensor System pro',
      price: '₹6,499.00',
      image: '/categories/pro2.jpg',
      badge: 'New',
      rating: 4,
      reviews: 3
    }
  ]
};

export default function FeaturedCollections() {
  const [activeTab, setActiveTab] = useState('Car Infotainment System');

  const renderStars = (rating, reviews) => {
    if (reviews === 0) return null;
    
    return (
      <div className="flex items-center gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : star - 0.5 === rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300 fill-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">({reviews})</span>
      </div>
    );
  };

  return (
    <div className=" bg-white py-5 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-10">
          Featured Collections
        </h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-12">
          {Object.keys(products).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-white text-gray-800 border-2 border-gray-200 hover:border-orange-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products[activeTab].map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative bg-gray-50 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-72 object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                      product.badge === 'Sold out'
                        ? 'bg-gray-800 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* YueMi Badge */}
                <div className="absolute top-4 left-4">
                  <div className="bg-white rounded-full px-3 py-1.5 flex items-center gap-2 shadow-md">
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">YueMi Ecosystem</span>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="text-sm font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
                  {product.name}
                </h3>
                
                {renderStars(product.rating, product.reviews)}
                
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-1">MRP</p>
                  <p className="text-xl font-bold text-gray-900">{product.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}