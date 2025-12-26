import React from 'react';
import Image from 'next/image';

const Support = () => {
  const supportFeatures = [
    {
      id: 1,
      icon: '/International_Quality_and_Trust.webp',
      title: "Offers Quality & Trust",
      description: "Internationally Offering Quality & Trust"
    },
    {
      id: 2,
      icon: '/Free_Shipping.webp',
      title: "Free Shipping",
      description: "Get Free Shipping PAN India"
    },
    {
      id: 3,
      icon: '/Services.png',
      title: "Service",
      description: "Right Where You Need Us"
    },
    {
      id: 4,
      icon: '/Warranty.png',
      title: "Warranty",
      description: "Ensure Your Devices For An Extra Year"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
          Support
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {supportFeatures.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 transform transition-transform duration-300 hover:scale-110 w-16 h-16 relative">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded border-2 border-orange-600 transition-all duration-300 hover:shadow-lg">
            follow Us
          </button>
        </div>
        <div className="mt-4 mb-4 h-1 bg-orange-500 w-full"></div>

      </div>
    </section>
  );
};

export default Support;