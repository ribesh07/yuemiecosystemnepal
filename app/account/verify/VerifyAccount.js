"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
// import { baseUrl } from "@/utils/config";

export default function VerifyAccountPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [verificationCode, setVerificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
  };

  const handleVerify = () => {
    if (!verificationCode.trim()) {
      toast.error("Please enter the verification code");
      return;
    }
    if (!email?.trim()) {
      toast.error("Email is missing. Please signup again.");
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    fetch(`/api/auth/verify-account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
        user_verification_code: verificationCode,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Verification failed");
        }
        toast.success(data?.message || "Account verified successfully");
        router.push("/account");
      })
      .catch((error) => {
        toast.error(error?.message || "Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleResendCode = () => {
    if (!email?.trim()) {
      toast.error("Email is missing. Please signup again.");
      return;
    }
    if (isLoading) return;

    setIsLoading(true);
    fetch(`/api/auth/resend-code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data?.message || "Resend failed");
        }
        toast.success(data?.message || "Verification code resent");
      })
      .catch((error) => {
        toast.error(error?.message || "Something went wrong. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleLoginNow = () => {
    // console.log("Redirecting to login page");
    router.push("/account");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">
            VERIFY YOUR ACCOUNT
          </h1>
        </div>

        {/* Verification Form */}
        <div className="border border-gray-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Account verification
          </h2>

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                E-MAIL *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                readOnly
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-blue-50 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Verification Code Field */}
            <div>
              <label
                htmlFor="verification-code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                VERIFICATION CODE *
              </label>
              <input
                type="text"
                id="verification-code"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                placeholder="Enter Verification Code"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-colors bg-gray-50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handleVerify}
                disabled={isLoading}
                className="bg-orange-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "VERIFYING..." : "VERIFY"}
              </button>

              <button
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-orange-600 hover:text-orange-800 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Resend Code?
              </button>
            </div>
          </div>
        </div>

        {/* Already Verified Section */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 ">
            ACCOUNT ALREADY VERIFIED?
          </h3>

          <button
            onClick={handleLoginNow}
            className="w-full bg-gray-50 text-orange-600 border-2 border-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
          >
            LOGIN NOW
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Didn't receive the verification code? Check your spam folder or
            click "Resend Code" above.
          </p>
        </div>
      </div>
    </div>
  );
}
