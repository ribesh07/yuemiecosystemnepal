"use client";

import { useState } from "react";

export default function AddressPage() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: "Nepal",
    state: "",
    city: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
    isDefault: true,
  });

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function validate() {
    const err = {};
    if (!form.fullName) err.fullName = "Full name is required";
    if (!form.phone) err.phone = "Phone number is required";
    if (!form.addressLine1) err.addressLine1 = "Address is required";
    if (!form.city) err.city = "City is required";
    if (!form.state) err.state = "State is required";
    setErrors(err);
    return Object.keys(err).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    console.log("Address Payload:", form);

    // await fetch("/api/address", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(form),
    // });

    setLoading(false);
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-2">
        Shipping Address
      </h1>
      <p className="text-gray-500 mb-8">
        This address will be used to deliver your order.
      </p>

      <form onSubmit={handleSubmit} className="grid gap-6">

        {/* Full Name */}
        <Field
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
        />

        {/* Phone + Email */}
        <div className="grid md:grid-cols-2 gap-6">
          <Field
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            error={errors.phone}
          />
          <Field
            label="Email (optional)"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        {/* Country + State */}
        <div className="grid md:grid-cols-2 gap-6">
          <Field
            label="Country"
            name="country"
            value={form.country}
            onChange={handleChange}
          />
          <Field
            label="State / Province"
            name="state"
            value={form.state}
            onChange={handleChange}
            error={errors.state}
          />
        </div>

        {/* City + Postal */}
        <div className="grid md:grid-cols-2 gap-6">
          <Field
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            error={errors.city}
          />
          <Field
            label="Postal Code"
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <Field
          label="Street Address"
          name="addressLine1"
          value={form.addressLine1}
          onChange={handleChange}
          error={errors.addressLine1}
        />

        <Field
          label="Apartment / Landmark (optional)"
          name="addressLine2"
          value={form.addressLine2}
          onChange={handleChange}
        />

        {/* Default */}
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            name="isDefault"
            checked={form.isDefault}
            onChange={handleChange}
          />
          Save as default address
        </label>

        {/* Submit */}
        <button
          disabled={loading}
          className="mt-4 bg-black text-white py-4 rounded-xl text-lg disabled:opacity-60"
        >
          {loading ? "Saving address..." : "Continue to Payment"}
        </button>
      </form>
    </div>
  );
}

/* ----------------------------- */
/* Reusable Input Component      */
/* ----------------------------- */

function Field({ label, name, value, onChange, error }) {
  return (
    <div>
      <label className="block text-sm mb-1 font-medium">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 
          ${error ? "border-red-500 focus:ring-red-300" : "border-gray-300 focus:ring-black"}`}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
