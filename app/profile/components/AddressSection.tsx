"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { getSessionToken, isAuthenticatedClient } from "@/utils/clientAuth";

export default function AddressSection() {
  const router = useRouter();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<any>({});

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
    } catch (error: any) {
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

      try {
        const provincesRes = await fetch("/api/admin/provinces");
        const provincesData = await provincesRes.json();

        if (mounted) {
          setProvinces(provincesData || []);
        }
      } catch (err) {
        toast.error("Failed to load provinces");
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
        const filtered = data.filter(
          (c: any) => c.provinceId == formData.provinceId
        );
        setCities(filtered);
      })
      .catch(() => {
        toast.error("Failed to load cities");
      });
  }, [formData.provinceId]);

  const handleChange = (field: string, value: any) => {
    if (field === "phone") {
      value = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev: any) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleSubmit = async () => {
    if (saving) return;

    const newErrors: any = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    if (!formData.provinceId) {
      newErrors.provinceId = "Please select a province";
    }

    if (!formData.cityId) {
      newErrors.cityId = "Please select a city";
    }

    if (!formData.zoneName.trim()) {
      newErrors.zoneName = "Zone / Area is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Full address is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      const firstError = Object.values(newErrors)[0];
      toast.error(firstError as string);

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
        body: JSON.stringify(formData),
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.message || "Failed to save address");
      }

      if (editingId) {
        setAddresses((prev) =>
          prev.map((item) =>
            item.id === editingId ? payload.data : item
          )
        );
      } else {
        setAddresses((prev) => [payload.data, ...prev]);
      }

      toast.success(editingId ? "Address updated" : "Address added");

      setShowForm(false);
      setFormData(emptyForm);
      setEditingId(null);
      setErrors({});
    } catch (error: any) {
      toast.error(error.message || "Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (address: any) => {
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
    setErrors({});
  };

  const handleDelete = async (id: number) => {
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
    } catch (error: any) {
      toast.error(error.message || "Failed to delete address");
    }
  };

  const inputClass = (field: string) =>
    `w-full border rounded px-3 py-2 ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 space-y-5 sm:space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">
          My Addresses
        </h2>

        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(true);
            setErrors({});
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Address
        </button>
      </div>

      <div className="space-y-4">
        {loading && (
          <p className="text-gray-500 text-sm">Loading addresses...</p>
        )}

        {!loading && addresses.length === 0 && (
          <p className="text-gray-500 text-sm">
            No addresses added yet.
          </p>
        )}

        {addresses.map((address) => (
          <div
            key={address.id}
            className="border border-gray-200 rounded-xl p-4 flex justify-between gap-3"
          >
            <div>
              <p className="font-semibold">{address.fullName}</p>
              <p className="text-sm text-gray-600">{address.phone}</p>
              <p className="text-sm text-gray-600">
                {address.address}, {address.zone?.zoneName},{" "}
                {address.city?.city}, {address.province?.name}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(address)}
                className="px-3 py-1 bg-blue-100 text-blue-600 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(address.id)}
                className="px-3 py-1 bg-red-100 text-red-600 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="border-t pt-5 space-y-4">
          <input
            className={inputClass("fullName")}
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={(e) =>
              handleChange("fullName", e.target.value)
            }
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">
              {errors.fullName}
            </p>
          )}

          <input
            className={inputClass("phone")}
            placeholder="Phone *"
            value={formData.phone}
            onChange={(e) =>
              handleChange("phone", e.target.value)
            }
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">
              {errors.phone}
            </p>
          )}

          <select
            className={inputClass("provinceId")}
            value={formData.provinceId}
            onChange={(e) =>
              handleChange("provinceId", e.target.value)
            }
          >
            <option value="">Select Province *</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          {errors.provinceId && (
            <p className="text-red-500 text-sm">
              {errors.provinceId}
            </p>
          )}

          <select
            className={inputClass("cityId")}
            value={formData.cityId}
            onChange={(e) =>
              handleChange("cityId", e.target.value)
            }
          >
            <option value="">Select City *</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.city}
              </option>
            ))}
          </select>
          {errors.cityId && (
            <p className="text-red-500 text-sm">
              {errors.cityId}
            </p>
          )}

          <textarea
            className={inputClass("zoneName")}
            placeholder="Zone / Area *"
            value={formData.zoneName}
            onChange={(e) =>
              handleChange("zoneName", e.target.value)
            }
          />
          {errors.zoneName && (
            <p className="text-red-500 text-sm">
              {errors.zoneName}
            </p>
          )}

          <textarea
            className={inputClass("address")}
            placeholder="Full Address *"
            value={formData.address}
            onChange={(e) =>
              handleChange("address", e.target.value)
            }
          />
          {errors.address && (
            <p className="text-red-500 text-sm">
              {errors.address}
            </p>
          )}

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Landmark (optional)"
            value={formData.landmark}
            onChange={(e) =>
              handleChange("landmark", e.target.value)
            }
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              {saving ? "Saving..." : "Save Address"}
            </button>

            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setErrors({});
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