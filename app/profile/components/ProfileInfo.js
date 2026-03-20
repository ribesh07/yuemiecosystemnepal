"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getSessionToken, isAuthenticatedClient } from "@/utils/clientAuth";

function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6 relative">
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

export default function ProfileInfo() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fullName: "", profilePhotoPath: "" });
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const avatarSrc = useMemo(() => {
    if (user?.profilePhotoPath) return user.profilePhotoPath;
    return "/employee.jpeg";
  }, [user?.profilePhotoPath]);

  const previewAvatarSrc = useMemo(() => {
    if (form.profilePhotoPath) return form.profilePhotoPath;
    if (user?.profilePhotoPath) return user.profilePhotoPath;
    return "/employee.jpeg";
  }, [form.profilePhotoPath, user?.profilePhotoPath]);

  const authHeaders = (json = true) => {
    const token = getSessionToken();
    return {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadProfile = async () => {
    try {
      const authed = await isAuthenticatedClient();
      if (!authed) {
        toast.error("Please login first");
        router.replace("/account?next=/profile");
        return;
      }

      const res = await fetch("/api/users/me", {
        headers: authHeaders(false),
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "Failed to load profile");
      }

      const data = payload?.data;
      setUser(data);
      setForm({
        fullName: data?.fullName || "",
        profilePhotoPath: data?.profilePhotoPath || "",
      });
    } catch (error) {
      toast.error(error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    const maxSizeMb = 5;
    if (file.size > maxSizeMb * 1024 * 1024) {
      toast.error(`Image must be smaller than ${maxSizeMb}MB`);
      return;
    }

    setSelectedImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        profilePhotoPath: String(reader.result || ""),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    try {
      setSaving(true);
      const body = new FormData();
      body.append("fullName", form.fullName.trim());
      if (selectedImageFile) {
        body.append("profilePhoto", selectedImageFile);
      }

      const res = await fetch("/api/users/me", {
        method: "PUT",
        headers: authHeaders(false),
        body,
      });
      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "Failed to update profile");
      }
      setUser(payload?.data);
      setForm({
        fullName: payload?.data?.fullName || form.fullName,
        profilePhotoPath: payload?.data?.profilePhotoPath || "",
      });
      setSelectedImageFile(null);
      toast.success(payload?.message || "Profile updated");
      setEditProfile(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = () => {
    setForm({
      fullName: user?.fullName || "",
      profilePhotoPath: user?.profilePhotoPath || "",
    });
    setSelectedImageFile(null);
    setEditProfile(true);
  };

  const closeEditModal = () => {
    setForm({
      fullName: user?.fullName || "",
      profilePhotoPath: user?.profilePhotoPath || "",
    });
    setSelectedImageFile(null);
    setEditProfile(false);
  };

  if (loading) {
    return <div className="bg-white rounded-xl shadow p-6 text-center">Loading profile...</div>;
  }

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <Image
        src={avatarSrc}
        alt="Avatar"
        width={120}
        height={120}
        className="mx-auto rounded-full object-cover"
        unoptimized={avatarSrc.startsWith("data:")}
      />

      <h2 className="mt-4 text-xl font-semibold">{user.fullName}</h2>
      <p className="text-gray-500 text-sm">{user.email}</p>
      <p className="text-gray-500 text-sm">{user.phone || "-"}</p>

      <button
        onClick={openEditModal}
        className="mt-3 text-sm text-blue-600 hover:underline"
      >
        Edit Profile
      </button>

      <Modal
        title="Edit Profile"
        isOpen={editProfile}
        onClose={closeEditModal}
      >
        <form className="space-y-4" onSubmit={handleSaveProfile}>
          <div className="flex justify-center">
            <Image
              src={previewAvatarSrc}
              alt="Avatar Preview"
              width={96}
              height={96}
              className="rounded-full object-cover border"
              unoptimized={previewAvatarSrc.startsWith("data:")}
            />
          </div>

          <input
            className="w-full border rounded px-3 py-2"
            value={form.fullName}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, fullName: e.target.value }))
            }
            placeholder="Full Name"
          />

          <input
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={user.email}
            disabled
          />

          <input
            className="w-full border rounded px-3 py-2 bg-gray-100"
            value={user.phone || ""}
            disabled
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
