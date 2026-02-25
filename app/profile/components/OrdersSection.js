"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getSessionToken, isAuthenticatedClient } from "@/utils/clientAuth";

function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-auto">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

function isWithinReturnWindow(order) {
  const status = String(order?.orderStatus || "").toLowerCase();
  if (status !== "delivered") return false;
  const baseDate = order?.updatedAt || order?.createdAt;
  if (!baseDate) return false;
  const diffMs = Date.now() - new Date(baseDate).getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays <= 3;
}

export default function OrdersSection() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelOrder, setCancelOrder] = useState(null);
  const [returnOrder, setReturnOrder] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);

  const [returnReason, setReturnReason] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewProductCode, setReviewProductCode] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      const authed = await isAuthenticatedClient();
      if (!authed) {
        toast.error("Please login first");
        router.replace("/account?next=/profile");
        return;
      }

      try {
        const token = getSessionToken();
        const response = await fetch("/api/orders", {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.message || "Failed to load orders");
        }

        if (mounted) {
          setOrders(payload?.data || []);
        }
      } catch (error) {
        toast.error(error.message || "Failed to load orders");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadOrders();

    return () => {
      mounted = false;
    };
  }, [router]);

  const tableOrders = useMemo(() => {
    return orders.map((order) => {
      const firstItem = order.items?.[0];
      const itemName = firstItem?.product?.name || firstItem?.productCode || "N/A";
      return {
        ...order,
        displayName: itemName,
      };
    });
  }, [orders]);

  const updateOrderStatusLocally = (orderId, nextStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        String(order.id) === String(orderId)
          ? { ...order, orderStatus: nextStatus }
          : order
      )
    );

    setSelectedOrder((prev) => {
      if (!prev || String(prev.id) !== String(orderId)) return prev;
      return { ...prev, orderStatus: nextStatus };
    });
  };

  const handleCancelOrder = async () => {
    if (!cancelOrder) return;
    try {
      setActionLoading(true);
      const token = getSessionToken();
      const response = await fetch(`/api/orders/${cancelOrder.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action: "cancel" }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to cancel order");
      }

      updateOrderStatusLocally(cancelOrder.id, "cancelled");
      toast.success("Order cancelled successfully");
      setCancelOrder(null);
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const openReviewModal = (order) => {
    setReviewOrder(order);
    setReviewText("");
    setReviewRating(5);
    setReviewProductCode(order?.items?.[0]?.productCode || "");
  };

  const handleSubmitReview = async () => {
    if (!reviewOrder) return;

    if (!reviewProductCode || !reviewText.trim()) {
      toast.error("Please select product and write review");
      return;
    }

    try {
      setActionLoading(true);
      const token = getSessionToken();
      const response = await fetch(`/api/orders/${reviewOrder.id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          productCode: reviewProductCode,
          rating: reviewRating,
          review: reviewText,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to submit review");
      }

      toast.success("Review submitted successfully");
      setReviewOrder(null);
      setReviewText("");
      setReviewRating(5);
      setReviewProductCode("");
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmitReturn = async () => {
    if (!returnOrder) return;
    if (!returnReason.trim()) {
      toast.error("Please provide return reason");
      return;
    }

    try {
      setActionLoading(true);
      const token = getSessionToken();
      const response = await fetch(`/api/orders/${returnOrder.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action: "return", reason: returnReason }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to submit return request");
      }

      updateOrderStatusLocally(returnOrder.id, "returns");
      toast.success("Return request submitted");
      setReturnOrder(null);
      setReturnReason("");
    } catch (error) {
      toast.error(error.message || "Failed to submit return request");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>

      {loading ? (
        <p className="text-sm text-gray-500">Loading orders...</p>
      ) : tableOrders.length === 0 ? (
        <p className="text-sm text-gray-500">No orders yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th>Product</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tableOrders.map((o) => {
              const status = String(o.orderStatus || "").toLowerCase();
              const canCancel = status === "processing" || status === "shipped";
              const canReview = status === "delivered";
              const canReturn = isWithinReturnWindow(o);

              return (
                <tr key={o.id} className="border-b">
                  <td
                    onClick={() => setSelectedOrder(o)}
                    className="text-blue-600 cursor-pointer py-2"
                  >
                    {o.displayName}
                  </td>
                  <td>{formatDate(o.createdAt)}</td>
                  <td className="capitalize">{o.orderStatus}</td>
                  <td>Rs. {Number(o.totalAmount || 0).toLocaleString()}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      {canCancel && (
                        <button
                          onClick={() => setCancelOrder(o)}
                          className="px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs"
                        >
                          Cancel
                        </button>
                      )}

                      {canReview && (
                        <>
                          <button
                            onClick={() => openReviewModal(o)}
                            className="px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs"
                          >
                            Add Review
                          </button>
                          {canReturn && (
                            <button
                              onClick={() => setReturnOrder(o)}
                              className="px-3 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs"
                            >
                              Return
                            </button>
                          )}
                        </>
                      )}

                      {!canCancel && !canReview && (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <Modal
        title={selectedOrder ? `Order #${selectedOrder.orderNumber}` : "Order Details"}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      >
        {selectedOrder && (
          <div className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span className="capitalize">{selectedOrder.orderStatus}</span>
            </p>
            <p>
              <span className="font-medium">Payment:</span>{" "}
              <span className="capitalize">{selectedOrder.paymentStatus}</span>
            </p>
            <p>
              <span className="font-medium">Date:</span> {formatDate(selectedOrder.createdAt)}
            </p>
            <p>
              <span className="font-medium">Subtotal:</span> Rs. {Number(selectedOrder.subtotal || 0).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Shipping:</span> Rs. {Number(selectedOrder.shippingCost || 0).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Total:</span> Rs. {Number(selectedOrder.totalAmount || 0).toLocaleString()}
            </p>

            <div className="pt-3 border-t">
              <p className="font-medium mb-2">Items</p>
              <ul className="space-y-2">
                {(selectedOrder.items || []).map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.product?.name || item.productCode} x {Number(item.quantity || 0)}
                    </span>
                    <span>Rs. {Number(item.subtotal || 0).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 bg-gray-200 hover:bg-red-400 px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      <Modal
        title={cancelOrder ? `Cancel Order #${cancelOrder.orderNumber}` : "Cancel Order"}
        isOpen={!!cancelOrder}
        onClose={() => setCancelOrder(null)}
      >
        <div className="space-y-4 text-sm">
          <p>Are you sure you want to cancel this order?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setCancelOrder(null)}
              className="px-4 py-2 rounded border"
              disabled={actionLoading}
            >
              No
            </button>
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 rounded bg-red-600 text-white"
              disabled={actionLoading}
            >
              {actionLoading ? "Cancelling..." : "Yes, Cancel"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        title={reviewOrder ? `Add Review - Order #${reviewOrder.orderNumber}` : "Add Review"}
        isOpen={!!reviewOrder}
        onClose={() => setReviewOrder(null)}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 font-medium">Product</label>
            <select
              value={reviewProductCode}
              onChange={(e) => setReviewProductCode(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              {(reviewOrder?.items || []).map((item) => (
                <option key={item.id} value={item.productCode}>
                  {item.product?.name || item.productCode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Rating</label>
            <select
              value={reviewRating}
              onChange={(e) => setReviewRating(Number(e.target.value))}
              className="w-full border rounded px-3 py-2"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} Star</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              className="w-full border rounded px-3 py-2"
              placeholder="Write your review"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setReviewOrder(null)}
              className="px-4 py-2 rounded border"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReview}
              className="px-4 py-2 rounded bg-blue-600 text-white"
              disabled={actionLoading}
            >
              {actionLoading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        title={returnOrder ? `Return Request - Order #${returnOrder.orderNumber}` : "Return Request"}
        isOpen={!!returnOrder}
        onClose={() => setReturnOrder(null)}
      >
        <div className="space-y-4 text-sm">
          <div>
            <label className="block mb-1 font-medium">Why do you want to return this order?</label>
            <textarea
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              rows={4}
              className="w-full border rounded px-3 py-2"
              placeholder="Write return reason"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={() => setReturnOrder(null)}
              className="px-4 py-2 rounded border"
              disabled={actionLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReturn}
              className="px-4 py-2 rounded bg-amber-600 text-white"
              disabled={actionLoading}
            >
              {actionLoading ? "Submitting..." : "Submit Return"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
