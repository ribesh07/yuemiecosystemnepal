"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = "/api/testimonials";

export default function TestimonialsAdmin() {
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    destination: "",
    address: "",
    profile_image: "",
    message: "",
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();

      const parsed = data.map((item) => ({
        id: item.id,
        name: item.name,
        destination: item.destination,
        address: item.address,
        profile_image: item.profile_image,
        message: item.message,
        isActive: !!item.isActive,
      }));

      setTestimonials(parsed);
    } catch (err) {
      console.error("Failed to fetch testimonials:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.message) {
      toast.error("Name and message are required");
      return;
    }

    const payload = {
      ...formData,
      is_active: formData.isActive ? 1 : 0,
    };

    try {
      if (editingItem) {
        await fetch(API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      fetchTestimonials();
      resetForm();
    } catch (err) {
      console.error("Save failed:", err);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      destination: item.destination,
      address: item.address,
      profile_image: item.profile_image,
      message: item.message,
      isActive: item.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this testimonial?")) return;

    try {
      await fetch(`${API_URL}?id=${id}`, { method: "DELETE" });
      fetchTestimonials();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      destination: "",
      address: "",
      profile_image: "",
      message: "",
      isActive: true,
    });
    setEditingItem(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Testimonials Manager
          </h2>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-5 py-3 bg-blue-600 text-white rounded-xl shadow flex items-center gap-2 hover:bg-blue-700"
          >
            <Plus size={18} /> Add Testimonial
          </button>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-linear-to-r from-slate-700 to-slate-800 px-8 py-4">
            <h2 className="text-xl font-semibold text-white">
              Testimonials
            </h2>
          </div>

          <div className="p-6">
            {testimonials.length === 0 ? (
              <div className="text-center py-12">
                <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 text-lg">
                  No testimonials added yet.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {testimonials.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-6 p-5 border rounded-xl bg-linear-to-r from-slate-50 to-white hover:shadow-md"
                  >
                    <img
                      src={item.profile_image || "/placeholder.png"}
                      className="w-16 h-16 rounded-full object-cover border"
                      alt=""
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold truncate">
                          {item.name}
                        </h3>

                        <span
                          className={`px-3 py-1 text-xs rounded-full font-semibold ${
                            item.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>

                      <p className="text-sm text-slate-600">
                        {item.destination} · {item.address}
                      </p>

                      <p className="mt-2 text-slate-700 line-clamp-2">
                        “{item.message}”
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            <form onSubmit={handleSubmit} className="p-8 space-y-5">

              <input
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border px-4 py-3 rounded-lg"
                required
              />

              <input
                name="destination"
                placeholder="Destination / Role"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full border px-4 py-3 rounded-lg"
              />

              <input
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border px-4 py-3 rounded-lg"
              />

              <input
                name="profile_image"
                placeholder="Profile Image URL"
                value={formData.profile_image}
                onChange={handleInputChange}
                className="w-full border px-4 py-3 rounded-lg"
              />

              <textarea
                name="message"
                placeholder="Testimonial message..."
                value={formData.message}
                onChange={handleInputChange}
                className="w-full border px-4 py-3 rounded-lg min-h-[120px]"
                required
              />

              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5"
                />
                <span>Set as active</span>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border py-3 rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
                >
                  {editingItem ? "Update Testimonial" : "Create Testimonial"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
