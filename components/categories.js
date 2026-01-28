'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const accessories = [
  {
    id: 1,
    category: 'Car Safety',
    title: 'Dash Camera System',
    description: 'Dual-lens dashboard camera with front and rear recording',
    image: '/categories/Car-Safety_1.webp',
  },
  {
    id: 2,
    category: 'Car Infotainment System',
    title: 'YueMi Ecosystem Display',
    description: 'Advanced touchscreen infotainment system',
    image:
      'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/Car-Infotainment-System.jpg?v=1728630007',
  },
  {
    id: 3,
    category: 'LED Lights',
    title: 'High-Performance LED Headlights',
    description: 'Ultra-bright LED conversion kit',
    image:
      'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/LED-Lights.jpg?v=1727180318',
  },
  {
    id: 4,
    category: 'Damping & Acoustics',
    title: 'Sound Deadening Materials',
    description: 'Premium acoustic dampening pads',
    image:
      'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/Damping-_-Acoustics_1.jpg?v=1728630006',
  },
  {
    id: 5,
    category: 'Amplifier',
    title: 'YueMi Class D Amplifier',
    description: '4x100W professional car audio amplifier',
    image:
      'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/Amplifier.jpg?v=1727180318',
  },
  {
    id: 6,
    category: 'Accessories',
    title: 'Car Accessories Kit',
    description: 'Essential car maintenance and styling accessories',
    image:
      'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/Accessories.jpg?v=1727180318',
  },
  {
    id: 7,
    category: 'Car Care & Protection',
    title: 'Premium Car Model',
    description: 'High-performance sports car with protection package',
    image:
      'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/Car-Care-_-Protection_1.jpg?v=1729506863',
  },
];

export default function CarAccessoriesGallery() {
  const router = useRouter();

  const handleImageClick = (item) => {
    router.push(`/productlist?category=${encodeURIComponent(item.category)}`);
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Premium Car Accessories
        </h1>
        <p className="text-gray-600 text-lg text-center mb-16">
          Click on any category to explore products
        </p>

        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {accessories.slice(0, 2).map((item) => (
            <div
              key={item.id}
              onClick={() => handleImageClick(item)}
              className="relative rounded-3xl shadow-xl overflow-hidden cursor-pointer transition hover:scale-[1.02]"
            >
              <div className="aspect-video">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vertical */}
          <div
            onClick={() => handleImageClick(accessories[2])}
            className="relative rounded-3xl overflow-hidden cursor-pointer md:row-span-2 transition hover:scale-[1.01]"
          >
            <img
              src={accessories[2].image}
              alt={accessories[2].title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Right Grid */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessories.slice(3).map((item) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item)}
                className="relative rounded-3xl shadow-xl overflow-hidden cursor-pointer transition hover:scale-[1.02]"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
