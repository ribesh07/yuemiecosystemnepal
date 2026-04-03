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

const fallbackAnnouncements = [
  { title: "Welcome to our Exclusive Online Store!", colorCode: "#f97316" },
  { title: "Free Shipping on Orders Over 500!", colorCode: "#f97316" },
  { title: "New Products Added Weekly!", colorCode: "#f97316" },
];

export default function Header() {
  const pathname = usePathname();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [announcements, setAnnouncements] = useState(fallbackAnnouncements);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await fetch("/api/popup-ads");
        const data = await res.json();
        
        const ads = data?.data?.popupAds || [];
       
        const now = new Date();
        const activeAds = ads
          .filter((ad) => ad.isActive)
          .filter((ad) => {
            if (ad.startAt && new Date(ad.startAt) > now) return false;
            if (ad.endAt && new Date(ad.endAt) < now) return false;
            return true;
          })
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((ad) => ({
            title: ad.title || "Announcement",
            colorCode: ad.colorCode || "#f97316",
          }));

        setAnnouncements(activeAds.length ? activeAds : fallbackAnnouncements);
      } catch (err) {
        console.error("Failed to fetch announcements", err);
        setAnnouncements(fallbackAnnouncements);
      }
    };

    fetchAnnouncements();
  }, []);

  // Auto slide announcements
  useEffect(() => {
    if (!announcements.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (pathname === "/login-admin") return null;

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      <div
        className="text-white relative"
        style={{ backgroundColor: announcements[currentSlide]?.colorCode || "#f97316" }}
      >
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
            {announcements[currentSlide]?.title || "Our Exclusive Online Store!"}
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
          <Link href="/" className="flex items-end gap-3 mb-4">
  <img
    src="/yuemi_logo_black.png"
    alt="Yuemi Ecosystem Nepal"
    className="h-5 md:h-6"
  />

  <span className="text-[10px] md:text-xs text-orange-500 tracking-widest -ml-2 mt-3">
    NEPAL
  </span>
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
              {/* <button className="p-2">
                <Search size={22} />
              </button> */}

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

          {/* Mobile Nav Links */}
          {isMobileMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-100">
              <div className="flex flex-col pt-3 text-sm font-semibold text-gray-800">
                <Link
                  href="/home"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-2 hover:text-orange-600"
                >
                  HOME
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-2 hover:text-orange-600"
                >
                  ABOUT US
                </Link>
                <Link
                  href="/all-product"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-2 hover:text-orange-600"
                >
                  BROWSE PRODUCT
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-2 hover:text-orange-600"
                >
                  CONTACT US
                </Link>
                <Link
                  href="/warranty"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-2 py-2 hover:text-orange-600"
                >
                  WARRANTY
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
