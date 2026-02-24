"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef(null);

  // Your image slides
  const images = [
    "/banner.png",
    "/banner1.jpg",
    
  ];

  const totalSlides = images.length + 1; // +1 for video slide

  // Auto slide every 5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === totalSlides - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  // Loop only first 4 sec of video
  const handleVideoTimeUpdate = (e) => {
    if (e.target.currentTime >= 4) {
      e.target.currentTime = 0;
    }
  };

  return (
    <div className="relative h-[700px] overflow-hidden">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* 🔥 Video Slide (First Slide) */}
        <div className="min-w-full h-full">
          <video
            ref={videoRef}
            src="/yuemi.mp4"
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleVideoTimeUpdate}
            className="w-full h-full object-cover"
          />
        </div>

         <div className="min-w-full h-full">
          <video
            ref={videoRef}
            src="/yuemi.mp4"
            autoPlay
            muted
            playsInline
            onTimeUpdate={handleVideoTimeUpdate}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 🖼 Image Slides */}
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

      {/* Navigation Arrows */}
      {/* <button
        onClick={() =>
          setCurrentSlide(
            currentSlide === 0 ? totalSlides - 1 : currentSlide - 1
          )
        }
        className="absolute left-4 top-1/2 -translate-y-1/2  text-white px-3 py-2 rounded-full"
      >
        ‹
      </button>

      <button
        onClick={() =>
          setCurrentSlide(
            currentSlide === totalSlides - 1 ? 0 : currentSlide + 1
          )
        }
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
      >
        ›
      </button> */}

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              currentSlide === index
                ? "bg-white"
                : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}