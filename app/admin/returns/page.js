"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useConfirmModalStore from "@/store/confirmModalStore";
import useWarningModalStore from "@/store/warningModalStore";
import useInfoModalStore from "@/store/infoModalStore";

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
  return new Date(value).toLocaleString();
}

export default function ReturnsPage() {
  const router = useRouter();
  const openConfirm = useConfirmModalStore((state) => state.open);
  const openWarning = useWarningModalStore((state) => state.open);
  const openInfo = useInfoModalStore((state) => state.open);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const loadReturns = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/login-admin");
      return;
    }

    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (statusFilter !== "all") query.set("status", statusFilter);
      const response = await fetch(`/api/admin/returns?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.message || "Failed to fetch returns");
      setItems(payload?.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch returns");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [router, statusFilter]);

  useEffect(() => {
    loadReturns();
  }, [loadReturns]);

  const updateReturnStatus = async (item, nextStatus) => {
    const token = getAdminToken();
    if (!token) {
      openWarning({
        title: "Session Expired",
        message: "Please login again to update return status.",
        onOkay: () => router.replace("/login-admin"),
      });
      return;
    }

    openConfirm({
      title: "Update Return Status",
      message: `Are you sure you want to change status to "${nextStatus}"?`,
      onConfirm: async () => {
        try {
          setUpdatingId(item.id);
          const response = await fetch(`/api/admin/returns/${item.id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ status: nextStatus }),
          });
          const payload = await response.json();
          if (!response.ok) {
            throw new Error(payload?.message || "Failed to update return status");
          }

          setItems((prev) =>
            prev.map((row) =>
              String(row.id) === String(item.id) ? { ...row, status: nextStatus } : row
            )
          );
          openInfo({
            title: "Status Updated",
            message: `Return status updated to "${nextStatus}".`,
          });
        } catch (error) {
          toast.error(error.message || "Failed to update return status");
        } finally {
          setUpdatingId(null);
        }
      },
    });
  };

  const stats = useMemo(() => {
    const base = { all: items.length, new: 0, shipped: 0, cancelled: 0 };
    items.forEach((item) => {
      const key = String(item.status || "new").toLowerCase();
      if (base[key] !== undefined) base[key] += 1;
    });
    return base;
  }, [items]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Returns</h1>
      <p className="text-sm text-gray-500 mb-4">
        Customer return requests with product-level details
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {Object.entries(stats).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key)}
            className={`rounded-lg border px-3 py-2 text-left ${
              statusFilter === key
                ? "border-orange-500 bg-orange-50 text-orange-700"
                : "border-gray-200 bg-white text-gray-700"
            }`}
          >
            <div className="text-xs uppercase font-semibold">{key}</div>
            <div className="text-lg font-bold">{val}</div>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading return requests...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No return requests found.</div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[1000px] text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left">
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Return Message</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Update</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  (() => {
                    const isLocked =
                      String(item.status || "").toLowerCase() === "shipped" ||
                      String(item.status || "").toLowerCase() === "cancelled";
                    return (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.user?.fullName || "-"}</div>
                      <div className="text-xs text-gray-500">{item.user?.email || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">#{item.order?.orderNumber || "-"}</div>
                      <div className="text-xs text-gray-500 capitalize">
                        order status: {item.order?.orderStatus || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{item.product?.name || item.productCode}</div>
                      <div className="text-xs text-gray-500">{item.productCode}</div>
                    </td>
                    <td className="px-4 py-3">{Number(item.quantity || 0)}</td>
                    <td className="px-4 py-3 max-w-[360px]">
                      <div className="line-clamp-3">{item.reason}</div>
                    </td>
                    <td className="px-4 py-3 capitalize">{item.status || "new"}</td>
                    <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={item.status || "new"}
                        onChange={(e) => updateReturnStatus(item, e.target.value)}
                        disabled={updatingId === item.id || isLocked}
                        className="border rounded px-2 py-1 disabled:bg-gray-100 disabled:text-gray-500"
                      >
                        <option value="new">new</option>
                        <option value="shipped">shipped</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                  </tr>
                    );
                  })()
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
