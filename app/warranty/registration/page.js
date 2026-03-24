"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

function WarrantyRegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serialFromQuery = (searchParams.get("serial") || "").trim();

  const [serialNumber, setSerialNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const maxPurchaseDate = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );

  const isAlreadyRegistered = details?.status === "active" || details?.status === "expired";
  const warrantyPeriodText = useMemo(() => {
    const days = Number(details?.warrantyDays || 365);
    if (!Number.isFinite(days) || days <= 0) return "-";
    const years = Math.floor(days / 365);
    return years >= 1 ? `${years} Year${years > 1 ? "s" : ""}` : `${days} Days`;
  }, [details?.warrantyDays]);

  const loadDetailsBySerial = async (serial) => {
    const cleanSerial = String(serial || "").trim();
    if (!cleanSerial) return;

    setIsChecking(true);
    try {
      const res = await fetch("/api/warranties/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serialNumber: cleanSerial }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setDetails({
            status: "serial_not_found",
            productName: "-",
            categoryName: "-",
            warrantyDays: 365,
          });
          return;
        }
        throw new Error(data?.message || "Failed to fetch product details");
      }

      if (data?.data?.status === "not_registered") {
        setDetails({
          status: "not_registered",
          productName: data?.data?.productName || "-",
          categoryName: data?.data?.categoryName || "-",
          warrantyDays: Number(data?.data?.warrantyDays || 365),
        });
        return;
      }

      setDetails({
        status: data?.data?.status || "active",
        productName: data?.data?.productName || "-",
        categoryName: data?.data?.categoryName || "-",
        warrantyDays: Number(data?.data?.warrantyDays || 365),
        purchaseDate: data?.data?.purchaseDate || null,
        expiryDate: data?.data?.expiryDate || null,
      });
    } catch (error) {
      setDetails(null);
      toast.error(error?.message || "Failed to fetch serial details");
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (!serialFromQuery) return;
    setSerialNumber(serialFromQuery);
    loadDetailsBySerial(serialFromQuery);
  }, [serialFromQuery]);

  const handleCheckSerial = async () => {
    if (!serialNumber.trim()) {
      toast.error("Serial number is required");
      return;
    }
    await loadDetailsBySerial(serialNumber.trim());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serialNumber.trim()) {
      toast.error("Serial number is required");
      return;
    }
    if (!customerName.trim()) {
      toast.error("Customer name is required");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!phone.trim()) {
      toast.error("Contact number is required");
      return;
    }
    if (isAlreadyRegistered) {
      toast.error("This serial number is already registered");
      return;
    }
    if (purchaseDate && purchaseDate > maxPurchaseDate) {
      toast.error("Purchase date cannot be in the future");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/warranties/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serialNumber: serialNumber.trim(),
          purchaseDate: purchaseDate || undefined,
          customerName: customerName.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          purchaseSource: "store",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      toast.success(data?.message || "Warranty registered successfully!");
      await loadDetailsBySerial(serialNumber.trim());
    } catch (error) {
      toast.error(error?.message || "Warranty registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Warranty Registration</h1>
            <p className="text-orange-100 mt-2">
              Verify serial and register store purchase warranty
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serial Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Enter product serial number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
              </div>
              <button
                type="button"
                onClick={handleCheckSerial}
                disabled={isChecking || !serialNumber.trim()}
                className="h-[46px] px-5 rounded-lg border border-orange-500 text-orange-600 hover:bg-orange-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? "Checking..." : "Check Serial"}
              </button>
            </div>

            <div className="rounded-xl border border-gray-200 p-5 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Product Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Product Name</p>
                  <p className="font-medium text-gray-800">{details?.productName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="font-medium text-gray-800">{details?.categoryName || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Warranty Period</p>
                  <p className="font-medium text-gray-800">{warrantyPeriodText}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Current Status</p>
                  <p className="font-medium text-gray-800 capitalize">{details?.status || "-"}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purchase Date (optional)
              </label>
              <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                max={maxPurchaseDate}
                className="w-full md:w-72 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
              />
            </div>

            <div className="rounded-xl border border-gray-200 p-5 bg-white">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter customer name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
                {/* <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    rows={3}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div> */}
              </div>
            </div>

            {isAlreadyRegistered && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                This serial number already has a registered warranty.
              </div>
            )}
            {details?.status === "serial_not_found" && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                Serial number not found in product units. Please check and try again.
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => router.push("/warranty")}
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isChecking ||
                  !serialNumber.trim() ||
                  !customerName.trim() ||
                  !email.trim() ||
                  !phone.trim() ||
                  !details ||
                  isAlreadyRegistered ||
                  details?.status === "serial_not_found"
                }
                className="px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-700 hover:to-orange-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Registering..." : "Register Warranty"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function WarrantyRegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="h-10 w-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <WarrantyRegisterContent />
    </Suspense>
  );
}
