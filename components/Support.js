import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
      description: "Get Free Shipping On Orders Over 20K"
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
    <section className="py-10 md:py-16 px-3 sm:px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 md:mb-16 text-gray-900">
          Support
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-10 md:mb-16">
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
              <h3 className="text-base md:text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
                  href="https://www.facebook.com/share/1EHtfCYK72/"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded border-2 border-orange-600 transition-all duration-300 hover:shadow-lg"
                >
                  Follow Us
                </Link>
        </div>
        <div className="mt-4 mb-4 h-1 bg-orange-500 w-full"></div>

      </div>
    </section>
  );
};

export default Support;
