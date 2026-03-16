"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackImages = useMemo(() => ([
    'https://yuemiecosystem.com/cdn/shop/files/Yuemi_Banner_Option_12_cc.jpg?v=1728388485',
    'https://yuemiecosystem.com/cdn/shop/files/Yuemi_Banner_Option.jpg?v=1727784981',
    'https://yuemiecosystem.com/cdn/shop/files/Yuemi_Main_Slider_Banner_LED.jpg?v=1728629725',
  ]), []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };


  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/banners');
        const data = await res.json();
        const banners = data?.data?.banners || data?.banners || [];
        const activeBanners = banners
          .filter((banner) => banner.isActive)
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((banner) => banner.imageUrl)
          .filter(Boolean);

        setImages(activeBanners.length ? activeBanners : fallbackImages);
      } catch (err) {
        console.error('Failed to fetch banners', err);
        setImages(fallbackImages);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [fallbackImages]);

  useEffect(() => {
    if (images.length <= 1) return undefined;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  useEffect(() => {
    if (currentSlide >= images.length) setCurrentSlide(0);
  }, [currentSlide, images.length]);

  return (
    <div className=" mx-auto px-1  overflow-y-auto mt-2 mb-5">
      {/* Main slider container */}
      <div className=" relative h-120 overflow-hidden">
        {/* Images */}
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full h-full">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 shadow-md transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Slide indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-white' 
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                }`}
              />
            ))}
          </div>
        )}
      </div>
      {loading && (
        <div className="text-center text-sm text-gray-500 mt-2">Loading banners...</div>
      )}
    </div>
  );
};

export default ImageSlider;
