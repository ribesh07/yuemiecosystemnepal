"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
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

export default function SecuritySection() {
  const [changePassword, setChangePassword] = useState(false);

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) return;

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        sessionStorage.removeItem("token");
        window.dispatchEvent(new CustomEvent("auth-change"));
        toast.success("Logged out successfully!");
      }
    } catch (err) {
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Security</h3>

      <div className="flex gap-4">
        <button
          onClick={() => setChangePassword(true)}
          className="bg-black text-white px-4 py-2 rounded text-sm"
        >
          Change Password
        </button>

        <button
          onClick={handleLogout}
          className="border px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>

      <Modal
        title="Change Password"
        isOpen={changePassword}
        onClose={() => setChangePassword(false)}
      >
        <form className="space-y-4">
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Current Password"
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="New Password"
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Confirm Password"
          />
          <button className="w-full bg-orange-500 text-white py-2 rounded">
            Update Password
          </button>
        </form>
      </Modal>
    </div>
  );
}