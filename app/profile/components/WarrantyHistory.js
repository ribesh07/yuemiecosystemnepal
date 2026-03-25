"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getSessionToken, isAuthenticatedClient } from "@/utils/clientAuth";

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

export default function WarrantyHistory() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const authed = await isAuthenticatedClient();
        if (!authed) {
          setLoading(false);
          return;
        }
        const token = getSessionToken();
        const res = await fetch("/api/warranties", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const payload = await res.json();
        if (!res.ok) throw new Error(payload?.message || "Failed to load warranties");
        if (mounted) setItems(payload?.data || []);
      } catch (error) {
        toast.error(error.message || "Failed to load warranties");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Warranty History</h3>
        <span className="text-xs text-gray-500">Total: {items.length}</span>
      </div>

      {loading ? (
        <div className="text-sm text-gray-500">Loading warranty history...</div>
      ) : items.length === 0 ? (
        <div className="text-sm text-gray-500">No warranties found yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Serial</th>
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
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.productName || item.productCode}</div>
                    <div className="text-xs text-gray-500">{item.productCode}</div>
                  </td>
                  <td className="px-4 py-3 font-mono">{item.serialNumber || "-"}</td>
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
  );
}
