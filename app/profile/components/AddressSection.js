"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getSessionToken, isAuthenticatedClient } from "@/utils/clientAuth";

export default function AddressSection() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const emptyForm = {
    fullName: "",
    phone: "",
    provinceId: "",
    cityId: "",
    zoneName: "",
    address: "",
    landmark: "",
    addressType: "home",
    defaultShipping: false,
    defaultBilling: false,
  };

  const [formData, setFormData] = useState(emptyForm);

  const authHeaders = () => {
    const token = getSessionToken();
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadAddresses = async () => {
    try {
      const response = await fetch("/api/customers/addresses", {
        headers: authHeaders(),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Failed to load addresses");
      }
      setAddresses(data?.data || []);
    } catch (error) {
      toast.error(error.message || "Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const authed = await isAuthenticatedClient();
      if (!authed) {
        toast.error("Please login first");
        router.replace("/account?next=/profile");
        return;
      }

      const provincesRes = await fetch("/api/admin/provinces");
      const provincesData = await provincesRes.json();
      if (mounted) {
        setProvinces(provincesData || []);
      }

      await loadAddresses();
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!formData.provinceId) {
      setCities([]);
      setFormData((prev) => ({ ...prev, cityId: "" }));
      return;
    }

    fetch("/api/admin/cities")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((c) => c.provinceId == formData.provinceId);
        setCities(filtered);
      });
  }, [formData.provinceId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const required = {
      fullName: formData.fullName?.trim(),
      phone: formData.phone?.trim(),
      provinceId: formData.provinceId,
      cityId: formData.cityId,
      zoneName: formData.zoneName?.trim(),
      address: formData.address?.trim(),
    };

    if (
      !required.fullName ||
      !required.phone ||
      !required.provinceId ||
      !required.cityId ||
      !required.zoneName ||
      !required.address
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setSaving(true);
    try {
      const endpoint = editingId
        ? `/api/customers/addresses/${editingId}`
        : "/api/customers/addresses";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: authHeaders(),
        body: JSON.stringify({
          ...formData,
          fullName: required.fullName,
          phone: required.phone,
          zoneName: required.zoneName,
          address: required.address,
        }),
      });

      const payload = await res.json();
      if (!res.ok) {
        throw new Error(payload?.message || "Failed to save address");
      }

      if (editingId) {
        setAddresses((prev) =>
          prev.map((item) => (item.id === editingId ? payload.data : item))
        );
      } else {
        setAddresses((prev) => [payload.data, ...prev]);
      }

      toast.success(editingId ? "Address updated" : "Address added");
      setShowForm(false);
      setFormData(emptyForm);
      setEditingId(null);
    } catch (error) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address) => {
    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      provinceId: address.provinceId?.toString() || "",
      cityId: address.cityId?.toString() || "",
      zoneName: address.zone?.zoneName || "",
      address: address.address || "",
      landmark: address.landmark || "",
      addressType: (address.addressType || "HOME").toLowerCase(),
      defaultShipping: Boolean(address.defaultShipping),
      defaultBilling: Boolean(address.defaultBilling),
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/customers/addresses/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.message || "Failed to delete address");
      }

      setAddresses((prev) => prev.filter((item) => item.id !== id));
      toast.success("Address deleted");
    } catch (error) {
      toast.error(error.message || "Failed to delete address");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-5 sm:space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">My Addresses</h2>
        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(true);
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Add Address
        </button>
      </div>

      {/* Address List */}
      <div className="space-y-4">
        {loading && <p className="text-gray-500 text-sm">Loading addresses...</p>}

        {!loading && addresses.length === 0 && (
          <p className="text-gray-500 text-sm">No addresses added yet.</p>
        )}

        {addresses.map((address) => (
          <div
            key={address.id}
            className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start gap-3"
          >
            <div>
              <p className="font-semibold">
                {address.fullName}
                {address.defaultShipping && (
                  <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                    Default Shipping
                  </span>
                )}
                {address.defaultBilling && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                    Default Billing
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-600">{address.phone}</p>
              <p className="text-sm text-gray-600">
                {address.address}, {address.zone?.zoneName}, {address.city?.city},{" "}
                {address.province?.name}
              </p>
              {address.landmark && (
                <p className="text-sm text-gray-500">Landmark: {address.landmark}</p>
              )}
            </div>

            <div className="flex gap-2 text-sm w-full sm:w-auto">
              <button
                onClick={() => handleEdit(address)}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(address.id)}
                className="flex-1 sm:flex-none px-3 py-1.5 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Address Form */}
      {showForm && (
        <div className="border-t pt-5 sm:pt-6 space-y-4">
          <label className="text-sm font-medium text-red-500">Full Name *</label>
          <input

            className="w-full border rounded px-3 py-2"
            value={formData.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Full Name"
          />
          <label className="text-sm font-medium text-red-500">Phone *</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Phone"
          />
          <label className="text-sm font-medium text-red-500">Province *</label>
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

          <label className="text-sm font-medium text-red-500">City *</label>

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

          <label className="text-sm font-medium text-red-500">Local Zone / Area *</label>

          <textarea
            className="w-full border rounded px-3 py-2 min-h-20"
            value={formData.zoneName}
            onChange={(e) => handleChange("zoneName", e.target.value)}
            placeholder="Enter local zone / area"
          />
          <label className="text-sm font-medium text-red-500 ">Full Address *</label>
          <textarea
            className="w-full border rounded px-3 py-2 min-h-24"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            placeholder="Enter full address"
          />

          <label className="text-sm font-medium">Landmark (optional)</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={formData.landmark}
            onChange={(e) => handleChange("landmark", e.target.value)}
            placeholder="Landmark (optional)"
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.defaultShipping}
              onChange={(e) => handleChange("defaultShipping", e.target.checked)}
            />
            Set as default shipping address
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.defaultBilling}
              onChange={(e) => handleChange("defaultBilling", e.target.checked)}
            />
            Set as default billing address
          </label>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-medium transition"
            >
              {saving ? "Saving..." : "Save Address"}
            </button>

            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
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
