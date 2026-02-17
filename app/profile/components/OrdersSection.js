"use client";

import { useState, useEffect } from "react";

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

export default function OrdersSection() {
  const [orders, setOrders] = useState([]);
  const [editOrder, setEditOrder] = useState(null);

  useEffect(() => {
    setOrders([
      { id: "Camera", date: "2025-01-10", status: "Delivered", total: "Rs. 4,500" },
      { id: "Mic", date: "2025-01-18", status: "Processing", total: "Rs. 2,200" },
    ]);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>

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
          {orders.map((o) => (
            <tr key={o.id} className="border-b">
              <td
                onClick={() => setEditOrder(o)}
                className="text-blue-600 cursor-pointer"
              >
                {o.id}
              </td>
              <td>{o.date}</td>
              <td>{o.status}</td>
              <td>{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        title={`Order Details - ${editOrder?.id}`}
        isOpen={!!editOrder}
        onClose={() => setEditOrder(null)}
      >
        <p>Status: {editOrder?.status}</p>
        <p>Total: {editOrder?.total}</p>
      </Modal>
    </div>
  );
}
