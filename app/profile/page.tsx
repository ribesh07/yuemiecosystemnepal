"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* -------------------- MODAL COMPONENT -------------------- */
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

/* -------------------- MAIN PAGE -------------------- */
export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  //const [editAddress, setEditAddress] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  //const [changePassword, setChangePassword] = useState(false);
  const [editChangePassword, setEditChangePassword] = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [editReview, setEditReview] = useState(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);



const [addresses, setAddresses] = useState<Address[]>([]);
const [editAddress, setEditAddress] = useState<Address | null>(null);
const [provinces, setProvinces] = useState<any[]>([]);
const [cities, setCities] = useState<any[]>([]);
const [zones, setZones] = useState<any[]>([]);


useEffect(() => {
  fetchAddresses();
  fetchProvinces();
}, []);

const fetchAddresses = async () => {
  const res = await fetch("/api/customer/addresses");
  const data = await res.json();
  setAddresses(data);
};

const fetchProvinces = async () => {
  const res = await fetch("/api/admin/provinces");
  const data = await res.json();
  setProvinces(data);
};

{addresses.map((addr) => (
  <div
    key={addr.id}
    className="border rounded-lg p-4 relative"
  >
    <button
      onClick={() => setEditAddress(addr)}
      className="absolute top-2 right-2 text-xs text-blue-600"
    >
      Edit
    </button>

    <h4 className="font-semibold text-sm">{addr.fullName}</h4>

    <p className="text-sm text-gray-600 mt-2">
      {addr.zone?.zoneName}, {addr.city?.city} <br />
      {addr.province?.name} Province <br />
      {addr.address}
    </p>

    {addr.defaultShipping && (
      <span className="text-xs text-green-600 mt-2 inline-block">
        Default Address
      </span>
    )}
  </div>
))}



  
  const updateProgress = () => {
    return 65;
  };


  useEffect(() => {
    setUser({
      name: "Gyanendra Sah",
      email: "gyanendra@email.com",
      phone: "+977-98XXXXXXXX",
      avatar:
        "data:image/jpeg;base64,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",
      wishlistCount: 6,
    });

    setOrders([
      { id: "Camera", date: "2025-01-10", status: "Delivered", total: "Rs. 4,500", Action: "Review" },
      { id: "Mic", date: "2025-01-18", status: "Processing", total: "Rs. 2,200", Action: "Cancel" },
      { id: "Tripod", date: "2025-02-05", status: "Shipped", total: "Rs. 1,800", Action: "Review" },
    ]);
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* SIDEBAR */}
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

          <div className="mt-4 flex justify-around text-sm">
            {/* <div>
              <p className="font-bold">{orders.length}</p>
              <p className="text-gray-500">Orders</p>
            </div> */}
            {/* <div>
              <p className="font-bold">{user.wishlistCount}</p>
              <p className="text-gray-500">Wishlist</p>
            </div> */}
          </div>

          <button className="mt-6 w-full bg-orange-500 text-white py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-6">

          {/* ADDRESSES */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Saved Addresses</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {[
                { type: "Home", city: "Kathmandu", state: "Bagmati", zip: "44600", default: true },
                { type: "Office", city: "Kathmandu", state: "Bagmati", zip: "44600" },
              ].map((addr, i) => (
                <div
                  key={i}
                  className="relative border rounded-lg p-4 hover:border-black transition"
                >
                  <button
                    onClick={() => setEditAddress(addr)}
                    className="absolute top-3 right-3 text-xs text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <h4 className="font-semibold text-sm">{addr.type}</h4>

                  <p className="mt-2 text-gray-600 text-sm">
                    {addr.city}, Nepal <br />
                    {addr.state} Province <br />
                    ZIP: {addr.zip}
                  </p>

                  {addr.default && (
                    <span className="mt-3 inline-block text-xs text-green-600 font-medium">
                      Default Address
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ORDERS */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th>Product</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id} className="border-b last:border-0">
                    <button 
                      onClick={() => setEditOrder(o)}
                      className="text-blue-600 hover:underline py-2"
                    > { o.id } </button>  
                    {/* <td className="py-2">{o.id}</td> */}
                    <td>{o.date}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          o.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td>{o.total}</td>
                  
                    <td>
                      <button
                        onClick={() => setEditReview(o)}
                        className="text-blue-600 hover:underline"
                      >
                        {o.Action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SECURITY */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold">Security</h3>
            <div className="mt-4 flex gap-4">
              <button
                onClick={() => setEditChangePassword(true)}
                className="border px-4 py-2  bg-black text-white rounded text-sm"
              >
                Change Password
              </button>
              <button className="border px-4 py-2 rounded text-sm">
                Logout all devices
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      <Modal
  title={`Edit ${editAddress?.type || "Shipping"} Address`}
  isOpen={!!editAddress}
  onClose={() => setEditAddress(null)}
>
  <form className="space-y-4">

    {/* Full Name */}
    <input
      className="w-full border rounded px-3 py-2"
      defaultValue={editAddress?.fullName}
      placeholder="Full Name (Receiver)"
    />

    {/* Phone */}
    <input
      className="w-full border rounded px-3 py-2"
      defaultValue={editAddress?.phone}
      placeholder="Mobile Number"
    />

    {/* Province */}
    <select
  value={editAddress?.provinceId || ""}
  onChange={async (e) => {
    const provinceId = e.target.value;

    setEditAddress({ ...editAddress!, provinceId, cityId: "", zoneId: "" });

    const res = await fetch(
      `/api/admin/cities?provinceId=${provinceId}`
    );
    const data = await res.json();
    setCities(data);
    setZones([]);
  }}
  className="w-full border rounded px-3 py-2"
>
  <option value="">Select Province</option>
  {provinces.map((p) => (
    <option key={p.id} value={p.id}>
      {p.name}
    </option>
  ))}
</select>


    {/* District */}
    <select
  value={editAddress?.cityId || ""}
  onChange={async (e) => {
    const cityId = e.target.value;

    setEditAddress({ ...editAddress!, cityId, zoneId: "" });

    const res = await fetch(`/api/admin/zones?cityId=${cityId}`);
    const data = await res.json();
    setZones(data);
  }}
  className="w-full border rounded px-3 py-2"
>
  <option value="">Select City</option>
  {cities.map((c) => (
    <option key={c.id} value={c.id}>
      {c.city}
    </option>
  ))}
</select>


    {/* Municipality */}
    <select
  value={editAddress?.zoneId || ""}
  onChange={(e) =>
    setEditAddress({ ...editAddress!, zoneId: e.target.value })
  }
  className="w-full border rounded px-3 py-2"
>
  <option value="">Select Area / Zone</option>
  {zones.map((z) => (
    <option key={z.id} value={z.id}>
      {z.zoneName}
    </option>
  ))}
</select>

    {/* Area / Tole */}
    <input
      className="w-full border rounded px-3 py-2"
      defaultValue={editAddress?.area}
      placeholder="Area / Tole / Landmark"
    />

    {/* Optional ZIP (rarely used but sometimes needed) */}
    <input
      className="w-full border rounded px-3 py-2"
      defaultValue={editAddress?.postalCode}
      placeholder="Postal Code (Optional)"
    />

   <button
  type="button"
  onClick={async () => {
    await fetch(`/api/customer/addresses/${editAddress?.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editAddress),
    });

    setEditAddress(null);
    fetchAddresses();
  }}
  className="w-full bg-orange-500 text-white py-2 rounded"
>
  Save Delivery Address
</button>

  </form>
</Modal>


      {/* PROFILE MODAL */}
      <Modal
  title="Edit Profile"
  isOpen={editProfile}
  onClose={() => setEditProfile(false)}
>
  <form className="space-y-4">

    {/* Profile Image Upload */}
    <div className="flex items-center gap-4">
      <img
        src={user.profileImage || "/avatar-placeholder.png"}
        alt="Profile"
        className="w-20 h-20 rounded-full object-cover border"
      />

      <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded border hover:bg-gray-200 text-sm">
        Change Photo
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // You can preview or upload to server here
              console.log("Selected file:", file);
            }
          }}
        />
      </label>
    </div>

    {/* Full Name */}
    <input
      className="w-full border rounded px-3 py-2"
      defaultValue={user.name}
      placeholder="Full Name"
    />

    {/* Email (Disabled) */}
    <input
      className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
      defaultValue={user.email}
      disabled
      title="Email cannot be changed"
    />

    {/* Phone */}
    <input
      className="w-full border rounded px-3 py-2"
      defaultValue={user.phone}
      placeholder="Mobile Number"
    />

    <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-red-600">
      Save Profile
    </button>
  </form>
</Modal>


      <Modal
        title="Change Password"
        isOpen={editChangePassword}
        onClose={() => setEditChangePassword(false)}
      >
        <form className="space-y-4">
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Current Password"
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="New Password"
          />
          <input
            type="password"
            className="w-full border rounded px-3 py-2"
            placeholder="Confirm New Password"
          />
          <button className="w-full bg-orange-500 text-white py-2 rounded hover:bg-red-600">Update Password</button>
        </form>
      </Modal>
      {/* ORDER MODAL */}
       <Modal
  title={`Order Details - #${editOrder?.id}`}
  isOpen={!!editOrder}
  onClose={() => setEditOrder(null)}
>
  <div className="space-y-6">

    {/* Order Meta */}
    <div className="grid grid-cols-2 gap-4 text-sm">
      <p><strong>Order ID:</strong> #{editOrder?.id}</p>
      <p><strong>Order Date:</strong> {editOrder?.date}</p>
      <p>
        <strong>Status:</strong>{" "}
        <span className={`px-2 py-1 rounded text-white text-xs
          ${editOrder?.status === "Delivered" && "bg-green-500"}
          ${editOrder?.status === "Pending" && "bg-yellow-500"}
          ${editOrder?.status === "Cancelled" && "bg-red-500"}
          ${editOrder?.status === "Shipped" && "bg-blue-500"}
        `}>
          {editOrder?.status}
        </span>
      </p>
      <p><strong>Payment:</strong> {editOrder?.paymentMethod || "Cash on Delivery"}</p>
    </div>

    {/* Product Section */}
    <div className="border-t pt-4 space-y-4">

      <h3 className="font-semibold text-lg">Products</h3>

      {editOrder?.products?.map((product, index) => (
        <div
          key={index}
          className="flex gap-4 border rounded-lg p-3 items-center"
        >
          {/* Product Image */}
          <img
            src={product.image || "/product-placeholder.png"}
            alt={product.name}
            className="w-20 h-20 object-cover rounded border"
          />

          {/* Product Info */}
          <div className="flex-1 space-y-1 text-sm">
            <p className="font-medium">{product.name}</p>
            <p className="text-gray-500">Product ID: {product.id}</p>
            <p className="text-gray-500">
              Category: {product.category || "General"}
            </p>
            <p className="text-gray-500">
              Quantity: {product.quantity || 1}
            </p>
          </div>

          {/* Price */}
          <div className="text-right text-sm">
            <p className="font-semibold">
              Rs. {product.price?.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs">per item</p>
          </div>
        </div>
      ))}
    </div>

    {/* Order Summary */}
    <div className="border-t pt-4 space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>Rs. {editOrder?.subtotal?.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span>Delivery Charge</span>
        <span>Rs. {editOrder?.deliveryCharge || 0}</span>
      </div>
      <div className="flex justify-between font-semibold text-base">
        <span>Total</span>
        <span>Rs. {editOrder?.total?.toLocaleString()}</span>
      </div>
    </div>

  </div>
</Modal>

      {/* REVIEW MODAL */}
      <Modal
        title={`Review Product - ${editReview?.id}`}
        isOpen={!!editReview}
        onClose={() => setEditReview(null)}
      >
        <div className="fixed inset-0 bg-transparent bg-opacity-90 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 rounded-lg max-w-md w-full max-h-[90vh] hide-scrollbar overflow-y-auto">
            {/* Progress Bar */}
            <div className="h-1 bg-blue-100 absolute top-0 left-0 right-0">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-800 transition-all duration-300"
                style={{ width: `${updateProgress()}%` }}
              />
            </div>

            {/* Form Content */}
            <div className="p-8">
              <h2 className="text-xl font-semibold text-blue-600 text-center mb-6">
                How was your experience?
              </h2>

              {/* Rating Section */}
              <div className="mb-8">
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setCurrentRating(star)}
                      onMouseEnter={() => setCurrentRating(star)}
                      className={`text-4xl transition-all duration-300 hover:scale-110 ${
                        star <= currentRating
                          ? "text-yellow-400 drop-shadow-md"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="text-center text-gray-600 text-sm min-h-5">
                  {currentRating > 0
                    ? ratingTexts[currentRating]
                    : "Tap to rate"}
                </div>
              </div>

              {/* Review Text Section */}
              <div className="mb-6">
                <label className="block text-blue-600 font-medium mb-3 text-base">
                  Share your experience with us
                </label>
                <textarea
                  name="reviewText"
                  id="reviewText"
                  rows="4"
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Tell us about your visit, treatment quality, staff behavior, and overall experience..."
                  className="w-full min-h-32 p-4 border-2 border-blue-100 rounded-xl text-sm leading-relaxed resize-y focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600 focus:ring-opacity-10 transition-all duration-300"
                />
              </div>

              {/* Photo Upload Section */}
              <div className="mb-8">
                <label className="relative block">
                  <div className="flex items-center justify-center p-4 border-2 border-dashed border-blue-600 rounded-xl cursor-pointer hover:bg-blue-50 transition-all duration-300 bg-blue-50 bg-opacity-30">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white text-sm">📷</span>
                      </div>
                      <span className="text-blue-600 font-medium text-sm">
                        Add Photos
                      </span>
                    </div>
                  </div>
                  {/* <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  /> */}
                </label>

                {/* Photo Previews */}
                {selectedPhotos.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {selectedPhotos.map((photo, index) => (
                      <div key={index} className="relative w-12 h-12">
                        <img
                          src={photo}
                          alt={`Preview ${index + 1}`}
                          className="w-12 h-12 rounded-lg object-cover border-2 border-blue-100"
                        />
                        {/* Remove button */}
                        <button
                        
                          type="button"
                          onClick={() =>
                            setSelectedPhotos((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow-lg hover:bg-red-700 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                {/* <button
                aria-label="Cancel"
                  onClick={closeModal}
                  className="w-full py-4 bg-[#bc3500] to-red--700 text-white font-semibold rounded-xl text-base uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Cancel
                </button> */}

                {/* <button
                aria-label="Submit Review"
                  onClick={submitReview}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-[#0072bc] to-blue-800 text-white font-semibold rounded-xl text-base uppercase tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button> */}
              </div>
            </div>
          </div>
        </div>

      </Modal>
    </>
  );
}
