"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { clearSessionAuth, getSessionToken } from "@/utils/clientAuth";

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
  const router = useRouter();
  const [changePassword, setChangePassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to logout?")) return;

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
      toast.success("Logged out successfully!");
    } catch {
      toast.error("Logout failed. Try again.");
    } finally {
      clearSessionAuth();
      router.replace("/home");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error("New password and confirm password must match");
      return;
    }

    try {
      setSaving(true);
      const token = getSessionToken();
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "Failed to update password");
      }

      toast.success(payload?.message || "Password changed successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setChangePassword(false);
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setSaving(false);
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
        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, currentPassword: e.target.value }))
            }
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, newPassword: e.target.value }))
            }
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
            }
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-60"
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
