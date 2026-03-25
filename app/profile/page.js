"use client";
import  ProfileInfo  from "./components/ProfileInfo";
import AddressSection from "./components/AddressSection"

import  OrdersSection  from "./components/OrdersSection"
import  SecuritySection  from "./components/SecuritySection";
import WarrantyHistory from "./components/WarrantyHistory";

export default function ProfilePage() {
  return (
    <div className="bg-gradient-to-b from-orange-50/40 via-white to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-8 grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        <ProfileInfo />

        <div className="lg:col-span-3 space-y-4 sm:space-y-6">
          <AddressSection />
          <OrdersSection />
          <WarrantyHistory />
          <SecuritySection />
        </div>
      </div>
    </div>
  );
}
