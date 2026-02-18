"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
  const [user, setUser] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [address, setAddress] = useState(null);
  const [editAddress, setEditAddress] = useState(false);

  useEffect(() => {
    setUser({
      name: "Gyanendra Sah",
      email: "gyanendra@email.com",
      phone: "+977-98XXXXXXXX",
      avatar: "/employee.jpeg",
    });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow p-6 text-center">
      <Image
        src={user.avatar}
        alt="Avatar"
        width={120}
        height={120}
        className="mx-auto rounded-full"
      />

      <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
      <p className="text-gray-500 text-sm">{user.email}</p>
      <p className="text-gray-500 text-sm">{user.phone}</p>

      <button
        onClick={() => setEditProfile(true)}
        className="mt-3 text-sm text-blue-600 hover:underline"
      >
        Edit Profile
      </button>

      {/* Edit Profile Modal */}
      <Modal
        title="Edit Profile"
        isOpen={editProfile}
        onClose={() => setEditProfile(false)}
      >
        <form className="space-y-4">
          <input
            className="w-full border rounded px-3 py-2"
            defaultValue={user.name}
            placeholder="Full Name"
          />

          <input
            className="w-full border rounded px-3 py-2 bg-gray-100"
            defaultValue={user.email}
            disabled
          />

          <input
            className="w-full border rounded px-3 py-2 bg-gray-100"
            defaultValue={user.phone}
            disabled
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
          />

          <button className="w-full bg-orange-500 text-white py-2 rounded">
            Save Profile
          </button>
        </form>
      </Modal>

      {/* Address Modal */}
    </div>
  );
}
