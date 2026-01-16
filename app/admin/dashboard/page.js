"use client";
import React, { useMemo, useState } from "react";
import {
  Package,
  FolderTree,
  Users,
  ShoppingCart,
  MessageSquare,
  Bell,
  Star,
  UserCircle,
  TrendingUp,
  TrendingDown,
  Search
} from "lucide-react";

/* ------------------ Small Reusable Components ------------------ */

const StatCard = ({ icon: Icon, label, value, trend, percent }) => {
  const isUp = trend === "up";

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <h3 className="text-sm text-gray-500">{label}</h3>
        <Icon className="w-6 h-6 text-orange-500" />
      </div>

      <div className="mt-4 flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        <div className={`flex items-center text-sm ${isUp ? "text-green-600" : "text-red-500"}`}>
          {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1">{percent}%</span>
        </div>
      </div>

      {/* progress bar */}
      <div className="mt-4 h-2 bg-gray-100 rounded-full">
        <div
          className={`h-full rounded-full ${isUp ? "bg-green-500" : "bg-red-400"}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  );
};

/* ------------------ Main Dashboard ------------------ */

const DashboardPage = () => {
  const [search, setSearch] = useState("");

  const statsCards = [
    { icon: Package, label: "Products", value: 1339, trend: "up", percent: 12 },
    { icon: FolderTree, label: "Categories", value: 26, trend: "up", percent: 4 },
    { icon: Users, label: "Customers", value: 90, trend: "down", percent: 2 },
    { icon: ShoppingCart, label: "Orders", value: 507, trend: "up", percent: 18 },
    { icon: MessageSquare, label: "Inquiries", value: 29, trend: "down", percent: 6 },
    { icon: Bell, label: "Subscribers", value: 1178, trend: "up", percent: 22 },
    { icon: UserCircle, label: "System Users", value: 90, trend: "up", percent: 9 },
    { icon: Star, label: "Reviews", value: 35, trend: "up", percent: 15 }
  ];

  const orders = [
    { id: "#803920251120003", user: "gyane", items: 1, amount: 48, status: "processing", date: "2025-11-20 08:12 PM" },
    { id: "#617420251120002", user: "gyane", items: 1, amount: 115, status: "processing", date: "2025-11-20 08:09 PM" },
    { id: "#626420251118021", user: "Raaz Rock", items: 1, amount: 48, status: "shipped", date: "2025-11-18 01:22 PM" },
    { id: "#204320251118020", user: "Raaz Rock", items: 1, amount: 48, status: "cancelled", date: "2025-11-18 01:13 PM" }
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter(
      o =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.user.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const statusColor = {
    processing: "bg-blue-100 text-blue-700",
    shipped: "bg-green-100 text-green-700",
    delivered: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700"
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6 space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      {/* Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>
        </div>

        <div className="divide-y">
          {filteredOrders.map(order => (
            <div key={order.id} className="p-6 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{order.id}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${statusColor[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  👤 {order.user} · 📦 {order.items} items
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold">${order.amount}</p>
                <p className="text-xs text-gray-500">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
