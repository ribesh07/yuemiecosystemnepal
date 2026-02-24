"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminHeaderBar from "@/components/admin-HeaderBar";
import SideHeaderBar from "@/components/admin-sidebar";
import Toast from "@/components/Toast";
import { Toaster } from "react-hot-toast"; // ✅ ADD THIS

function getAdminToken() {
  if (typeof window === "undefined") return null;
  const raw =
    localStorage.getItem("admin_auth") ||
    localStorage.getItem("admin_token") ||
    sessionStorage.getItem("admin_token");

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed?.token || parsed?.accessToken || parsed?.jwt || null;
  } catch {
    return raw;
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const verifyAdmin = async () => {
      const token = getAdminToken();
      if (!token) {
        router.replace(`/login-admin?next=${encodeURIComponent(pathname || "/admin")}`);
        return;
      }

      try {
        const res = await fetch("/api/auth/admin/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          localStorage.removeItem("admin_auth");
          localStorage.removeItem("admin_token");
          sessionStorage.removeItem("admin_token");
          router.replace(`/login-admin?next=${encodeURIComponent(pathname || "/admin")}`);
          return;
        }
      } catch {
        router.replace(`/login-admin?next=${encodeURIComponent(pathname || "/admin")}`);
        return;
      } finally {
        if (mounted) setChecking(false);
      }
    };

    verifyAdmin();
    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-600 text-sm">
        Verifying admin session...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AdminHeaderBar />

      <div className="flex flex-1 overflow-hidden">
        <SideHeaderBar />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Toaster position="top-right" /> {/* ✅ Now defined */}
          <Toast />
          {children}
        </main>
      </div>
    </div>
  );
}
