"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getSessionToken, isAuthenticatedClient } from "@/utils/clientAuth";

function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
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

export default function OrdersSection() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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
            </tr>
          </thead>
          <tbody>
            {tableOrders.map((o) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        title={
          selectedOrder
            ? `Order #${selectedOrder.orderNumber}`
            : "Order Details"
        }
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
              <span className="font-medium">Date:</span>{" "}
              {formatDate(selectedOrder.createdAt)}
            </p>
            <p>
              <span className="font-medium">Subtotal:</span> Rs.{" "}
              {Number(selectedOrder.subtotal || 0).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Shipping:</span> Rs.{" "}
              {Number(selectedOrder.shippingCost || 0).toLocaleString()}
            </p>
            <p>
              <span className="font-medium">Total:</span> Rs.{" "}
              {Number(selectedOrder.totalAmount || 0).toLocaleString()}
            </p>

            <div className="pt-3 border-t">
              <p className="font-medium mb-2">Items</p>
              <ul className="space-y-2">
                {(selectedOrder.items || []).map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.product?.name || item.productCode} x{" "}
                      {Number(item.quantity || 0)}
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
    </div>
  );
}

