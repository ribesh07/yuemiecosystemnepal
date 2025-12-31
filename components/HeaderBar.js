"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
    const pathname = usePathname();

  const announcements = [
    "Welcome to our Exclusive Online Store!",
    "Free Shipping on Orders Over 500!",
    "New Products Added Weekly!",
  ];

  const products = [
    { name: "AMPLIFIER", href: "#amplifier" },
    { name: "LED LIGHTS", href: "#led-lights" },
    { name: "CAR SAFETY", href: "#car-safety" },
    { name: "ACCESSORIES", href: "#accessories" },
    { name: "CAR INFOTAINMENT SYSTEM", href: "#car-infotainment" },
    { name: "DAMPING & ACOUSTICS", href: "#damping-acoustics" },
    { name: "CAR CARE & PROTECTION", href: "#car-care" },
  ];

  // auto slide announcements
  useEffect(() => {
    if (!announcements.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval); // cleanup
  }, [announcements.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % announcements.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + announcements.length) % announcements.length
    );
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProductMenuOpen(false); // Close product menu when main menu toggles
  };

  const openProductMenu = () => {
    setIsProductMenuOpen(true);
  };

  const closeProductMenu = () => {
    setIsProductMenuOpen(false);
  };

  const handleProductClick = () => {
    setIsMobileMenuOpen(false);
    setIsProductMenuOpen(false);
  };

    
  if (pathname === "/login-admin") return null;

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      <div className="bg-orange-500 text-white relative">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={prevSlide}
            className="p-1 hover:bg-orange-600 rounded transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="text-center flex-1">
            <p className="text-[14px] md:text-base -mt-1 font-light">
              {announcements[currentSlide]}
            </p>
          </div>

          <button
            onClick={nextSlide}
            className="p-1 hover:bg-orange-600 rounded transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-gray-100 rounded transition-colors z-[60]"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X size={24} className="text-gray-700" />
              ) : (
                <Menu size={24} className="text-gray-700" />
              )}
            </button>

            <Link href="/" className="relative inline-block">
              {/* Logo */}
              <img
                src="/yuemi_logo_black.png"
                alt="Yuemi Ecosystem Nepal"
                className="h-4 md:h-6 w-auto cursor-pointer"
                loading="lazy"
                draggable={false}
              />

              {/* NEPAL sticker */}
              <span
                className="
                    absolute 
                    -bottom-1 
                    -right-2 
                    text-[8px] 
                    md:text-[10px] 
                    font-bold 
                    tracking-wide
                    text-orange-500
                "
              >
                NEPAL
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-[14px]">
              <a
                href="/"
                className="text-orange-500 font-bold hover:underline cursor-pointer hover:text-orange-600 transition-colors"
              >
                HOME
              </a>
              <a
                href="/about"
                className="text-gray-700 font-bold hover:text-orange-500 hover:underline cursor-pointer transition-colors"
              >
                ABOUT US
              </a>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 font-bold hover:text-orange-500 hover:underline cursor-pointer transition-colors">
                  <span>PRODUCT</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full text-[14px] left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg  z-50 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {products.map((product, index) => (
                    <a
                      key={index}
                      href={product.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 hover:underline  "
                    >
                      {product.name}
                    </a>
                  ))}
                </div>
              </div>
              <a
                href="/contact"
                className="text-gray-700 font-bold hover:text-orange-500 hover:underline cursor-pointer transition-colors"
              >
                CONTACT US
              </a>

              <a
                href="/warranty"
                className="text-gray-700 font-bold hover:text-orange-500 hover:underline cursor-pointer transition-colors"
              >
                WARRANTY
              </a>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search size={22} className="text-gray-700" />
              </button>
              <button
                className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="User account"
              >
                <User size={22} className="text-gray-700" />
              </button>
              <button
                onClick={() => window.dispatchEvent(new Event("openCart"))}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} className="text-gray-700" />
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}

      <div
        className={`fixed inset-0 bg-transparent bg-opacity-0 z-40 transition-opacity duration-300 md:hidden 
        `}
        onClick={toggleMobileMenu}
      />

      {/* Main Mobile Menu - Full Screen */}
      <div
        className={`fixed inset-0 top-30 bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Menu Items */}
        <div className="flex flex-col p-6 space-y-1">
          <a
            href="#home"
            className="text-2xl font-normal text-gray-900 py-4 hover:text-orange-500 transition-colors"
            onClick={toggleMobileMenu}
          >
            HOME
          </a>
          <a
            href="#about"
            className="text-2xl font-normal text-gray-900 py-4 hover:text-orange-500 transition-colors"
            onClick={toggleMobileMenu}
          >
            ABOUT US
          </a>
          <button
            onClick={openProductMenu}
            className="py-4 flex items-center justify-between text-left group"
          >
            <span className="text-2xl font-normal text-gray-900 group-hover:text-orange-500 transition-colors">
              PRODUCT
            </span>
            <ChevronRight
              size={24}
              className="text-gray-900 group-hover:text-orange-500 transition-colors"
            />
          </button>
          <a
            href="/warranty"
            className="text-2xl font-normal text-gray-900 py-4 hover:text-orange-500 transition-colors"
            onClick={toggleMobileMenu}
          >
            WARRANTY
          </a>
          <a
            href="#contact"
            className="text-2xl font-normal text-gray-900 py-4 hover:text-orange-500 transition-colors"
            onClick={toggleMobileMenu}
          >
            CONTACT US
          </a>
        </div>

        {/* Mobile Menu Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <a
            href="#login"
            className="flex items-center space-x-3 text-gray-700 hover:text-orange-500 transition-colors mb-6"
            onClick={toggleMobileMenu}
          >
            <User size={20} />
            <span className="text-base">Log in</span>
          </a>

          <div className="flex items-center space-x-6">
            <a
              href="#twitter"
              className="text-gray-700 hover:text-orange-500 transition-colors"
              aria-label="Twitter"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#facebook"
              className="text-gray-700 hover:text-orange-500 transition-colors"
              aria-label="Facebook"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="#instagram"
              className="text-gray-700 hover:text-orange-500 transition-colors"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Product Submenu - Slides from Right */}
      <div
        className={`fixed inset-0 top-30 bg-white z-[60] transform transition-transform duration-300 ease-in-out md:hidden ${
          isProductMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Product Menu Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={closeProductMenu}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Back to menu"
            >
              <ArrowLeft size={24} className="text-gray-900" />
            </button>
            <span className="text-xl font-semibold text-gray-900">PRODUCT</span>
          </div>
        </div>

        {/* Product List */}
        <div className="flex flex-col p-6 space-y-2">
          {products.map((product, index) => (
            <a
              key={index}
              href={product.href}
              className="text-xl font-normal text-gray-900 py-4 hover:text-orange-500 transition-colors border-b border-gray-100"
              onClick={handleProductClick}
            >
              {product.name}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
