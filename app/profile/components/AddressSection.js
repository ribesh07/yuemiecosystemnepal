"use client";

import { useState, useEffect } from "react";

export default function AddressSection() {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);

  const emptyForm = {
    fullName: "",
    phone: "",
    provinceId: "",
    cityId: "",
    zoneId: "",
    address: "",
    landmark: "",
    addressType: "home",
    defaultShipping: false,
    defaultBilling: false,
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetch("/api/admin/provinces")
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (!formData.provinceId) return;

    fetch("/api/admin/cities")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (c) => c.provinceId == formData.provinceId,
        );
        setCities(filtered);
      });
  }, [formData.provinceId]);

  useEffect(() => {
    if (!formData.cityId) return;

    fetch("/api/admin/zones")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((z) => z.cityId == formData.cityId);
        setZones(filtered);
      });
  }, [formData.cityId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const handleSubmit = async () => {
    const res = await fetch("/api/customers/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId: 1, ...formData }),
    });

    if (res.ok) {
      const savedAddress = await res.json();
      setAddresses((prev) => [...prev, savedAddress]); // update UI
      setShowForm(false);
      setFormData(emptyForm);
    } else {
      console.error("Failed to save address");
    }
  };

  const handleEdit = (index) => {
    setFormData(addresses[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = addresses.filter((_, i) => i !== index);
    setAddresses(updated);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Addresses</h2>
        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingIndex(null);
            setShowForm(true);
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded text-sm"
        >
          + Add Address
        </button>
      </div>

      {/* Address List */}
      <div className="space-y-4">
        {addresses.length === 0 && (
          <p className="text-gray-500 text-sm">No addresses added yet.</p>
        )}

        {addresses.map((address, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 flex justify-between items-start"
          >
            <div>
              <p className="font-semibold">
                {address.fullName}
                {address.isDefault && (
                  <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600">{address.phone}</p>
              <p className="text-sm text-gray-600">
                {address.localAddress}, {address.city}, {address.province}
              </p>
            </div>

            <div className="flex gap-3 text-sm">
              <button
                onClick={() => handleEdit(index)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(index)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="border-t pt-6 space-y-4">
          <input
            className="w-full border rounded px-3 py-2"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Full Name"
          />

          <input
            className="w-full border rounded px-3 py-2"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Phone"
          />

          <select
            className="w-full border rounded px-3 py-2"
            value={formData.provinceId}
            onChange={(e) => handleChange("provinceId", e.target.value)}
          >
            <option value="">Select Province</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="w-full border rounded px-3 py-2"
            value={formData.cityId}
            onChange={(e) => handleChange("cityId", e.target.value)}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.city}
              </option>
            ))}
          </select>

          <select
            className="w-full border rounded px-3 py-2"
            value={formData.zoneId}
            onChange={(e) => handleChange("zoneId", e.target.value)}
          >
            <option value="">Select Zone</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.zoneName}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => handleChange("isDefault", e.target.checked)}
            />
            Set as default shipping address
          </label>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Save Address
            </button>

            <button
              onClick={() => {
                setShowForm(false);
                setEditingIndex(null);
              }}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
