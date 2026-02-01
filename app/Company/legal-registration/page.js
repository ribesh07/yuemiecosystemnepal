'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function LegalRegistrationPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    companyType: '',
    registrationNumber: '',
    panVatNumber: '',
    registeredAddress: '',
    operatingAddress: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    agreed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.agreed) {
      toast.error('You must agree to the declaration before submitting.');
      return;
    }

    console.log('Legal Registration Data:', formData);
    toast.success('Legal registration submitted successfully.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-2">
          Legal & Business Registration
        </h1>
        <p className="text-gray-600 mb-6">
          This information is required for legal compliance, taxation, and
          payment gateway verification.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Company Info */}
          <div>
            <label className="block font-medium">Company Legal Name *</label>
            <input
              type="text"
              name="companyName"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Company Type *</label>
            <select
              name="companyType"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="">Select</option>
              <option>Private Limited</option>
              <option>Public Limited</option>
              <option>Partnership</option>
              <option>Sole Proprietorship</option>
              <option>LLP</option>
            </select>
          </div>

          <div>
            <label className="block font-medium">Business Registration Number *</label>
            <input
              type="text"
              name="registrationNumber"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">PAN / VAT Number *</label>
            <input
              type="text"
              name="panVatNumber"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium">Registered Address *</label>
            <textarea
              name="registeredAddress"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Operating Address</label>
            <textarea
              name="operatingAddress"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="country"
              placeholder="Country"
              required
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              required
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              required
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              required
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block font-medium">Authorized Contact Person *</label>
            <input
              type="text"
              name="contactPerson"
              required
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              placeholder="Official Email"
              required
              onChange={handleChange}
              className="border p-2 rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium">Company Website</label>
            <input
              type="url"
              name="website"
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Declaration */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="agreed"
              onChange={handleChange}
              className="mt-1"
            />
            <p className="text-sm text-gray-600">
              I declare that the information provided above is true and accurate
              to the best of my knowledge.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
          >
            Submit Legal Registration
          </button>
        </form>
      </div>
    </div>
  );
}
