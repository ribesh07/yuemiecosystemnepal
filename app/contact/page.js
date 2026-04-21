"use client";
import React, { useState } from "react";
import Image from "next/image";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    inquiryType: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.message || "Failed to submit inquiry");
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        inquiryType: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      setSubmitError(error?.message || "Failed to send inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="relative w-full h-64 md:h-[450px]">
                <Image
                  src="/banner.png"
                  alt="Banner"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
      <div className="max-w-5xl mx-auto">
        
        {/* Contact Header */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact</h1>

          <p className="text-gray-700 mb-6">
            For any questions regarding these Terms, please contact us at:
          </p>

          <div className="space-y-2 text-gray-700">
            <p className="font-medium">Autozone Traders</p>
            <p>
              <span className="font-semibold">Address:</span> University RD, Kuleshwor-14, kathmandu, Nepal
            </p>
            <p>
              <span className="font-semibold">Phone Number:</span> 9802341806 
            </p>
            <p>
              <span className="font-semibold">Email Address:</span>{" "}
              <a
                href="mailto:support@yuemiecosystem.com"
                className="text-blue-600 hover:underline"
              >
                yueminepal@gmail.com
              </a>
            </p>
          </div>
        </section>

        {/* Inquiry Form */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Inquiry Form
          </h2>

          {submitStatus === "success" && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Thank you! Your message has been sent successfully.
            </div>
          )}
          {submitStatus === "error" && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {submitError || "Failed to send inquiry. Please try again."}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <select
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="" disabled>
                  Select Inquiry Type
                </option>
                <option value="Personal">Personal</option>
                <option value="Retail">Retail</option>
                <option value="Institutional">Institutional</option>
              </select>
            </div>

            <div>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded transition-colors disabled:bg-orange-300 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </div>
        </section>

        {/* Get Directions */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Get Directions
          </h2>

          <div className="relative w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=27.6918056,85.2987335&output=embed
"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Autozone Private Limited Location"
            />
            <div className="absolute top-4 left-4 bg-white px-3 py-1 rounded shadow text-sm text-blue-600 hover:underline cursor-pointer">
              View larger map
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>
              <strong>Autozone Traders</strong>
            </p>
            <p>University RD, Kuleshwor-14, Kathmandu</p>
            <p>Nepal</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
