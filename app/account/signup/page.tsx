"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useInfoModalStore from "@/store/infoModalStore";
import useWarningModalStore from "@/store/warningModalStore";

export default function AuthPage() {
  const nameRegex = /^[A-Za-z\s]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCreateAccount = async () => {
    // 1️⃣ Validation
    if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.phone
    ) {
      return useWarningModalStore.getState().open({
        title: "Incomplete Form !",
        message: "Please fill in all required fields.",
      });
    }

    if (!nameRegex.test(formData.firstname)) {
      return useWarningModalStore.getState().open({
        title: "Invalid First Name !",
        message: "First name should contain alphabets only.",
      });
    }

    if (!nameRegex.test(formData.lastname)) {
      return useWarningModalStore.getState().open({
        title: "Invalid Last Name !",
        message: "Last name should contain alphabets only.",
      });
    }

    if (!emailRegex.test(formData.email)) {
      return useWarningModalStore.getState().open({
        title: "Invalid E-mail !",
        message: "Please enter a valid email address.",
      });
    }

    if (formData.password.length < 6) {
      return useWarningModalStore.getState().open({
        title: "Weak Password !",
        message: "Password should be at least 6 characters long.",
      });
    }

    if (formData.password !== formData.confirmPassword) {
      return useWarningModalStore.getState().open({
        title: "Password Mismatch !",
        message: "Password and Confirm Password do not match.",
      });
    }

    if (formData.phone.length !== 10) {
      return useWarningModalStore.getState().open({
        title: "Invalid Mobile Number !",
        message: "Mobile number should be exactly 10 digits.",
      });
    }

    // 2️⃣ API call
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstname} ${formData.lastname}`,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        useInfoModalStore.getState().open({
          title: "Success",
          message: data.message || "Account created successfully.",
          onOkay: () => {
            if (data.requiresVerification) {
              router.push(
                `/account/verify?email=${encodeURIComponent(formData.email)}`
              );
              return;
            }
            router.push("/account");
          },
        });
      } else {
        useWarningModalStore.getState().open({
          title: "Error",
          message: data.message || "Registration failed",
        });
      }
    } catch (error) {
      useWarningModalStore.getState().open({
        title: "Error",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-600 mb-2">CREATE ACCOUNT</h1>
        </div>
        <div className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
            <input
              name="firstname"
              value={formData.firstname}
              onChange={handleInputChange}
              placeholder="Enter First Name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
            <input
              name="lastname"
              value={formData.lastname}
              onChange={handleInputChange}
              placeholder="Enter Last Name"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter Email"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter Mobile Number"
              maxLength={10}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500"
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleCreateAccount}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 mt-4"
          >
            CREATE ACCOUNT
          </button>

          {/* Already have account */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/account")}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
