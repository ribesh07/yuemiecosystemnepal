'use client';

import { useState } from 'react';

const accessories = [
  {
    id: 1,
    
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-3 text-center">
          Premium Car Accessories
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Click on any product to view details
        </p>

        {/* First Row - 2 Horizontal (Largest) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {accessories.slice(0, 2).map((item) => (
            <div
              key={item.id}
              onClick={() => handleImageClick(item)}
              className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative group"
            >
              <div className="relative h-72 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute top-6 left-6">
                  
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-2xl font-bold mb-1 drop-shadow-lg">
                    {item.title}
                  </h3>
                  <p className="text-white/90 text-sm drop-shadow-md">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row - 1 Vertical + 3 Horizontal in 2x2 grid (Medium) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - 1 Vertical (spans 2 rows) */}
          <div
            onClick={() => handleImageClick(accessories[2])}
            className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative group md:row-span-2"
          >
            <div className="relative h-full min-h-[350px] md:min-h-[564px] overflow-hidden">
              <img
                src={accessories[2].image}
                alt={accessories[2].title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              <div className="absolute top-6 left-6">
               
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-white text-2xl font-bold mb-1 drop-shadow-lg">
                  {accessories[2].title}
                </h3>
                <p className="text-white/90 text-sm drop-shadow-md">
                  {accessories[2].description}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - 2x2 Grid */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessories.slice(3).map((item) => (
              <div
                key={item.id}
                onClick={() => handleImageClick(item)}
                className="bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl relative group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h3 className="text-white text-xl font-bold mb-1 drop-shadow-lg">
                      {item.title}
                    </h3>
                    <p className="text-white/90 text-xs drop-shadow-md">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-96">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-8">
              
              <h2 className="text-3xl font-bold text-gray-800 mt-4 mb-3">
                {selectedItem.title}
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                {selectedItem.description}
              </p>
              <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 shadow-lg">
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}