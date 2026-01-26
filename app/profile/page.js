"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // TODO: Replace with real API calls
    setUser({
      name: "Gyanendra Sah",
      email: "gyanendra@email.com",
      phone: "+977-98XXXXXXXX",
      avatar:
        "data:image/jpeg;base64,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",
      wishlistCount: 6,
    });

    setOrders([
      {
        id: "#ORD001",
        date: "2025-01-10",
        status: "Delivered",
        total: "Rs. 4,500",
      },
      {
        id: "#ORD002",
        date: "2025-01-18",
        status: "Processing",
        total: "Rs. 2,200",
      },
    ]);
  }, []);

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* LEFT SIDEBAR */}
      <div className="bg-white rounded-xl shadow p-6 text-center">
       
        <Image
          src={user.avatar}
          alt="User Avatar"
          width={120}
          height={120}
          className="mx-auto rounded-full"
        />
         
        <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
        <p className="text-gray-500 text-sm">{user.email}</p>
        <p className="text-gray-500 text-sm">{user.phone}</p>
      

        <div className="mt-4 flex justify-around text-sm">
          <div>
            <p className="font-bold">{orders.length}</p>
            <p className="text-gray-500">Orders</p>
          </div>
          <div>
            <p className="font-bold">{user.wishlistCount}</p>
            <p className="text-gray-500">Wishlist</p>
          </div>
        </div>

        <button className="mt-6 w-full bg-orange-500 text-white py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="lg:col-span-3 space-y-6">
        {/* ADDRESS SECTION */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address Card */}
            <div className="relative border rounded-lg p-4 cursor-pointer hover:border-black transition">
              {/* Edit Button */}
              <a
                href="/profile/address/edit/1"
                className="absolute top-3 right-3 text-xs text-blue-600 hover:underline"
              >
                Edit
              </a>

              <h4 className="font-semibold text-sm">Home</h4>

              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                Kathmandu, Nepal <br />
                Bagmati Province <br />
                ZIP: 44600
              </p>

              <span className="mt-3 inline-block text-xs text-green-600 font-medium">
                Default Address
              </span>
            </div>

            {/* Address Card */}
            <div className="relative border rounded-lg p-4 cursor-pointer hover:border-black transition">
              {/* Edit Button */}
              <a
                href="/profile/address/edit/2"
                className="absolute top-3 right-3 text-xs text-blue-600 hover:underline"
              >
                Edit
              </a>

              <h4 className="font-semibold text-sm">Office</h4>

              <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                Kathmandu, Nepal <br />
                Bagmati Province <br />
                ZIP: 44600
              </p>
            </div>
          </div>
        </div>

        {/* ORDER HISTORY */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="pb-2">Order ID</th>
                <th className="pb-2">Date</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-2">{order.id}</td>
                  <td>{order.date}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs 
                      ${order.status === "Delivered" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td>{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECURITY */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold">Security</h3>
          <p className="text-gray-600 text-sm mt-1">
            Update your password and manage sessions
          </p>
          <div className="mt-4 flex gap-4">
            <Link
              href="/profile/change-password"
              className="bg-gray-900 text-white px-4 py-2 rounded text-sm"
            >
              Change Password
            </Link>
            <button className="border px-4 py-2 rounded text-sm">
              Logout from all devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
