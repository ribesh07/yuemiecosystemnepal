"use client";

import { useState } from "react";

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setMessage("✅ Product created successfully");
      form.reset();
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Create Product</h2>

      <form onSubmit={handleSubmit}>
        {/* TEXT FIELDS */}
        <input name="name" placeholder="Product name" required />
        <br /><br />

        <input name="slug" placeholder="Slug (optional)" />
        <br /><br />

        <input name="actualPrice" placeholder="Actual price" required />
        <br /><br />

        <input name="sellPrice" placeholder="Sell price" required />
        <br /><br />

        <input name="status" placeholder="Status (1 or 0)" required />
        <br /><br />

        {/* MAIN IMAGE */}
        <label>Main Image</label>
        <br />
        <input type="file" name="mainImage" accept="image/*" />
        <br /><br />

        {/* MULTIPLE GALLERY IMAGES */}
        <label>Gallery Images</label>
        <br />
        <input
          type="file"
          name="productImages"
          accept="image/*"
          multiple
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Create Product"}
        </button>
      </form>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}
