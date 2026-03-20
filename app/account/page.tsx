"use client";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

function LoginPageContent() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  const resolveNextPath = (nextPath: string | null) => {
    if (!nextPath || !nextPath.startsWith("/")) return "/home";
    if (nextPath.startsWith("/admin")) return "/home";
    if (nextPath.startsWith("/login-admin")) return "/home";
    return nextPath;
  };

  // Input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Login handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!formData.email || !formData.password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Save token in sessionStorage
        sessionStorage.setItem("token", data.token);
        // Ensure customer login never keeps admin session alive
        localStorage.removeItem("admin_auth");
        localStorage.removeItem("admin_token");
        sessionStorage.removeItem("admin_token");
        window.dispatchEvent(new CustomEvent("auth-change"));
        toast.success("Login successful!");
        const nextPath = searchParams.get("next");
        router.replace(resolveNextPath(nextPath));
      } else {
        if (data.code === "EMAIL_NOT_VERIFIED") {
          toast.error(data.message || "Please verify your email.");
          router.push(`/account/verify?email=${encodeURIComponent(formData.email)}`);
          return;
        }
        toast.error(data.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-orange-600 text-center mb-4">
          LOGIN
        </h1>
        <form className="space-y-4" onSubmit={handleSignIn}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => router.push("/account/forgot-password")}
              className="text-orange-600 hover:text-orange-800 font-medium"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="mt-6 border-t pt-4 text-center">
          <p className="text-gray-600 mb-2">New here?</p>
          <button
            onClick={() => router.push("/account/signup")}
            className="w-full bg-gray-50 text-orange-600 border-2 border-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginPageContent />
    </Suspense>
  );
}
