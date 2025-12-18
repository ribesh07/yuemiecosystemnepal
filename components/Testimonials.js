"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const testimonials = [
    {
      id: 1,
      text: "I've been using these YuéMi lights for a few months now and I'm so impressed. They're durable, easy to install, and provide great visibility. It's easy to use, Highly recommend!",
      name: "Nur ",
      location: "Kathmandu",
      image: "/employee.jpeg"
    },
    {
      id: 2,
      text: "I was impressed with the build quality and ease of installation of this camera. The picture quality is crystal clear, even in low light conditions. I've used it to record my driving trips.",
      name: "Anjali Rauniyar",
      location: "Lalitpur",
      image: "/ladies _emp.jpeg"
    },
    {
      id: 3,
      text: "I recently bought the YuéMi Amplifier, and I am really happy with it! The sound is powerful and clear, perfect for listening to music or watching movies. Even though it's small, it gives great sound quality.",
      name: "Gyanendra Shah",
      location: "Bhaktapur",
      image: "/manager.jpeg"
    }
  ];

  // Auto slide functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Calculate which testimonials to show based on screen size
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section className="py-16 px-4" style={{ backgroundColor: '#F5EFE0' }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Testimonials
        </h2>

        {/* Desktop View - Show 3 cards */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-6 relative">
          {getVisibleTestimonials().map((testimonial, index) => (
            <div
              key={`${testimonial.id}-${index}`}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <svg
                      className="w-8 h-8 text-gray-300"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>
                    <button className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">
                    {testimonial.text}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile/Tablet View - Show 1 card with navigation */}
        <div className="lg:hidden relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-2"
                >
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <div className="flex justify-between items-start mb-4">
                          <svg
                            className="w-8 h-8 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                          </svg>
                          <button className="w-8 h-8 border-2 border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed mb-6">
                          {testimonial.text}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 mt-auto">
                        <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {testimonial.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-gray-800 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;