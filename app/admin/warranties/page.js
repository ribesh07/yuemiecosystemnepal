"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

export default function WarrantyAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    serial: "",
    orderId: "",
    email: "",
    status: "all",
  });

  const load = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/login-admin");
      return;
    }

    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.serial) params.set("serial", filters.serial.trim());
      if (filters.orderId) params.set("orderId", filters.orderId.trim());
      if (filters.email) params.set("email", filters.email.trim());
      if (filters.status) params.set("status", filters.status);

      const res = await fetch(`/api/admin/warranties?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload?.message || "Failed to load warranties");
      setItems(payload?.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load warranties");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters, router]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Warranties</h1>
        <p className="text-sm text-gray-500">Search by serial, order id, or email</p>
      </div>

      <div className="bg-white rounded-xl border p-4 grid gap-3 md:grid-cols-4">
        <input
          value={filters.serial}
          onChange={(e) => setFilters((prev) => ({ ...prev, serial: e.target.value }))}
          placeholder="Serial number"
          className="border rounded px-3 py-2"
        />
        <input
          value={filters.orderId}
          onChange={(e) => setFilters((prev) => ({ ...prev, orderId: e.target.value }))}
          placeholder="Order ID"
          className="border rounded px-3 py-2"
        />
        <input
          value={filters.email}
          onChange={(e) => setFilters((prev) => ({ ...prev, email: e.target.value }))}
          placeholder="Customer email"
          className="border rounded px-3 py-2"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          className="border rounded px-3 py-2"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
        </select>
        <button
          onClick={load}
          className="md:col-span-4 border rounded px-4 py-2 hover:bg-gray-50"
        >
          Apply Filters
        </button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading warranties...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No warranties found.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3">Serial</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Purchase</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3">Source</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3 font-mono">{item.serialNumber || "-"}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.productName || item.productCode}</div>
                      <div className="text-xs text-gray-500">{item.productCode}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.customerName || "-"}</div>
                      <div className="text-xs text-gray-500">{item.customerEmail || "-"}</div>
                      <div className="text-xs text-gray-500">{item.customerPhone || "-"}</div>
                      <div className="text-xs text-gray-500 mt-1 max-w-xs">
                        {item.customerAddress || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {item.orderNumber ? `#${item.orderNumber}` : "-"}
                    </td>
                    <td className="px-4 py-3 capitalize">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          item.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(item.purchaseDate)}</td>
                    <td className="px-4 py-3">{formatDate(item.expiryDate)}</td>
                    <td className="px-4 py-3 capitalize">{item.purchaseSource}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
