import React from 'react';
import Image from 'next/image';

const Bestseller = () => {
  const products = [
    {
      id: 1,
      badge: 'YueMi Ecosystem',
      tag: 'Sold out',
      name: 'YuéMi E1 2GB+64GB Multimedia Player with CarPlay AndroidAuto DDR 2GB(DDR4)',
      image: '/categories/pro4.jpg',
      mrp: '₹15,999.00',
      rating: 0,
      isSoldOut: true
    },
    {
      id: 2,
      badge: 'YueMi Ecosystem',
      name: 'YuéMi M1 Pro Car Infotainment System 4+64GB(DSP)',
      image: '/categories/pro3.jpg',
      mrp: '₹24,999.00',
      rating: 4.5,
      reviews: 2
    },
    {
      id: 3,
      badge: 'YueMi Ecosystem',
      name: 'YuéMi M11 4GB+64GB Digital Knob Car Infotainment System',
      image: '/categories/pro2.jpg',
      mrp: '₹49,999.00',
      rating: 0,
      reviews: 0
    },
    {
      id: 4,
      badge: 'YueMi Ecosystem',
      name: 'YuéMi M2 2GB+32 GB Multimedia Player with 360° Birdview Support & DSP (DDR 4 RAM)',
      image: '/categories/pro1.jpg',
      mrp: '₹29,999.00',
      rating: 4.5,
      reviews: 2
    }
  ];

  const renderStars = (rating, reviews) => {
    if (rating === 0) return null;
    
    return (
      <div className="flex items-center gap-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? 'text-yellow-400 fill-current'
                : star - 0.5 === rating
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            {star - 0.5 === rating && (
              <defs>
                <linearGradient id={`half-${star}`}>
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="#D1D5DB" stopOpacity="1" />
                </linearGradient>
              </defs>
            )}
          </svg>
        ))}
        {reviews > 0 && (
          <span className="text-sm text-gray-600 ml-1">({reviews})</span>
        )}
      </div>
    );
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">Bestseller</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="relative bg-gray-100 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full text-sm">
                  <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    Y
                  </span>
                  {product.badge}
                </span>
                {product.tag && (
                  <span className="bg-gray-800 text-white px-3 py-1 rounded text-sm">
                    {product.tag}
                  </span>
                )}
              </div>
              
              <div className="aspect-square relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                />
                
                {/* Add to Cart Button on Hover */}
                {!product.isSoldOut && (
                  <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      ADD TO CART
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
                {product.name}
              </h3>
              
              {renderStars(product.rating, product.reviews)}
              
              <p className="text-lg font-bold text-gray-900 mt-3">
                MRP {product.mrp}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-10">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded border-2 border-orange-600 transition-all duration-300 hover:shadow-lg">
            View All
          </button>
        </div>
    </section>
  );
};

export default Bestseller;