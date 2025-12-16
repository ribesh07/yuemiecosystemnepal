'use client';

import { useState } from 'react';

const accessories = [
  {
    id: 1,
    category: 'Car Safety',
    title: 'Dash Camera System',
    description: 'Dual-lens dashboard camera with front and rear recording',
    image: '/categories/Car-Safety_1.webp',
    orientation: 'horizontal'
  },
  {
    id: 2,
    category: 'Car Infotainment System',
    title: 'YueMi Ecosystem Display',
    description: 'Advanced touchscreen infotainment system',
    image: 'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/Car-Infotainment-System.jpg?v=1728630007',
    orientation: 'horizontal'
  },
  {
    id: 3,
    category: 'LED Lights',
    title: 'High-Performance LED Headlights',
    description: 'Ultra-bright LED conversion kit',
    image: 'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/LED-Lights.jpg?v=1727180318',
    orientation: 'vertical'
  },
  {
    id: 4,
    category: 'Damping & Acoustics',
    title: 'Sound Deadening Materials',
    description: 'Premium acoustic dampening pads',
    image: 'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/Damping-_-Acoustics_1.jpg?v=1728630006',
    orientation: 'horizontal'
  },
  {
    id: 5,
    category: 'Amplifier',
    title: 'YueMi Class D Amplifier',
    description: '4x100W professional car audio amplifier',
    image: 'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/Amplifier.jpg?v=1727180318',
    orientation: 'horizontal'
  },
  {
    id: 6,
    category: 'Accessories',
    title: 'Car Accessories Kit',
    description: 'Essential car maintenance and styling accessories',
    image: 'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/Accessories.jpg?v=1727180318',
    orientation: 'horizontal'
  },
  {
    id: 7,
    category: 'Car Care & Protection',
    title: 'Premium Car Model',
    description: 'High-performance sports car with protection package',
    image: 'https://cdn.shopify.com/s/files/1/0593/0719/6512/files/Car-Care-_-Protection_1.jpg?v=1729506863',
    orientation: 'horizontal'
  }
];

export default function CarAccessoriesGallery() {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleImageClick = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
          Premium Car Accessories
        </h1>
        <p className="text-gray-600 text-lg text-center mb-16">
          Click on any product to view details
        </p>

        {/* First Row - 2 Horizontal (Largest) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {accessories.slice(0, 2).map((item) => (
            <div
              key={item.id}
              onClick={() => handleImageClick(item)}
              className="relative rounded-3xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group"
            >
              <div className="relative h-80 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute top-5 left-5">
                
              </div>
              {/* <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                  {item.title}
                </h3>
                <p className="text-white/95 text-sm drop-shadow-md">
                  {item.description}
                </p>
              </div> */}
            </div>
          ))}
        </div>

        {/* Second Row - 1 Vertical + 4 Horizontal in 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - 1 Vertical (spans 2 rows) */}
          <div
            onClick={() => handleImageClick(accessories[2])}
            className="relative rounded-3xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group md:row-span-2"
          >
            <div className="relative h-[600px] md:h-[564px] bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
              <img
                src={accessories[2].image}
                alt={accessories[2].title}
                className="w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="absolute top-5 left-5">
              
            </div>
            {/* <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              <h3 className="text-white text-2xl font-bold mb-2 drop-shadow-lg">
                {accessories[2].title}
              </h3>
              <p className="text-white/95 text-sm drop-shadow-md">
                {accessories[2].description}
              </p>
            </div> */}
          </div>

          {/* Right Column - 2x2 Grid */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessories.slice(3).map((item) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item)}
                className="relative rounded-3xl shadow-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group"
              >
                <div className="relative h-64 bg-gradient-to-br from-amber-100 to-orange-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute top-4 left-4">
                  
                </div>
                {/* <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                  <h3 className="text-white text-lg font-bold mb-1 drop-shadow-lg">
                    {item.title}
                  </h3>
                  <p className="text-white/95 text-xs drop-shadow-md">
                    {item.description}
                  </p>
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[500px] bg-gradient-to-br from-amber-50 to-orange-50">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-contain p-8"
              />
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full p-3 shadow-xl hover:bg-white hover:scale-110 transition-all duration-300"
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-10">
              
              {/* <h2 className="text-4xl font-bold text-gray-900 mt-5 mb-4">
                {selectedItem.title}
              </h2>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {selectedItem.description}
              </p> */}
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 transform hover:scale-105 transition-all duration-300 shadow-xl">
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}