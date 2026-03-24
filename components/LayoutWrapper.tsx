"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import HeaderBar from "@/components/HeaderBar";
import Footer from "@/components/FooterBar";
import CartSidebar from "@/components/CartSidebar";
import CookieConsentBanner from "@/components/CookieConsentBanner";
import { Toaster } from "react-hot-toast";
import TawkToWidget from "./TawkToWidget";
import Toast from "@/components/Toast";

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <HeaderBar />}
      {!isAdminRoute && <CartSidebar />}

      {children}

      {!isAdminRoute && <CookieConsentBanner />}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <TawkToWidget />  }
      {!isAdminRoute && <Toaster position="top-right" />}
      {!isAdminRoute && <Toast />}
    </>
  );
}
