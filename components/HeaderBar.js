"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  User,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { isAuthenticatedClient } from "@/utils/clientAuth";
import { getCartCount } from "@/utils/cartClient";

export default function Header() {
  const pathname = usePathname();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const announcements = [
    "Welcome to our Exclusive Online Store!",
    "Free Shipping on Orders Over 500!",
    "New Products Added Weekly!",
  ];

  useEffect(() => {
    let mounted = true;

    const checkLogin = async () => {
      const authed = await isAuthenticatedClient();
      if (mounted) {
        setIsLoggedIn(authed);
        setCartCount(authed ? getCartCount() : 0);
      }
    };

    checkLogin();

    window.addEventListener("auth-change", checkLogin);
    window.addEventListener("cart-updated", checkLogin);
    window.addEventListener("storage", checkLogin);
    window.addEventListener("focus", checkLogin);
    document.addEventListener("visibilitychange", checkLogin);

    return () => {
      mounted = false;
      window.removeEventListener("auth-change", checkLogin);
      window.removeEventListener("cart-updated", checkLogin);
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("focus", checkLogin);
      document.removeEventListener("visibilitychange", checkLogin);
    };
  }, [pathname]);

  // Auto slide announcements
  useEffect(() => {
    if (!announcements.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  if (pathname === "/login-admin") return null;

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      <div className="bg-orange-500 text-white relative">
        <div className="flex items-center justify-between px-4 py-2">
          <button
            onClick={() =>
              setCurrentSlide(
                (prev) => (prev - 1 + announcements.length) % announcements.length
              )
            }
          >
            <ChevronLeft size={20} />
          </button>

          <p className="text-center flex-1 text-sm md:text-base">
            {announcements[currentSlide]}
          </p>

          <button
            onClick={() =>
              setCurrentSlide((prev) => (prev + 1) % announcements.length)
            }
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo */}
            <Link href="/" className="relative">
              <img
                src="/yuemi_logo_black.png"
                alt="Yuemi Ecosystem Nepal"
                className="h-5 md:h-6"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8 text-sm font-bold">
              <Link href="/home">HOME</Link>
              <Link href="/about">ABOUT US</Link>
              <Link href="/all-product">BROWSE PRODUCT</Link>
              <Link href="/contact">CONTACT US</Link>
              <Link href="/warranty">WARRANTY</Link>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2">
                <Search size={22} />
              </button>

              {!isLoggedIn ? (
                <Link
                  href="/account"
                  className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded hover:bg-orange-600 transition"
                >
                  LOGIN
                </Link>
              ) : (
                <>
                  <Link href="/profile">
                    <User size={22} />
                  </Link>

                  <button
                    onClick={() =>
                      window.dispatchEvent(new CustomEvent("open-cart"))
                    }
                    className="relative"
                  >
                    <ShoppingCart size={22} />
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
