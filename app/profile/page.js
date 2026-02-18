"use client";
import  ProfileInfo  from "./components/ProfileInfo";
//import AddressSection from "./components/AddressSection"

import  OrdersSection  from "./components/OrdersSection"
import  SecuritySection  from "./components/SecuritySection";

export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <ProfileInfo />

      <div className="lg:col-span-3 space-y-6">
        {/* <AddressSection /> */}
        <OrdersSection />
        <SecuritySection />
      </div>

    </div>
  );
}
