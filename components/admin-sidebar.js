"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Package,
  FolderTree,
  Flag,
  Tag,
  ShoppingCart,
  Users,
  Star,
  MessageSquare,
  FileText,
  UserCog,
  BarChart3,
  Truck,
  MapPin,
  XCircle,
  Shield,
} from "lucide-react";

const SideHeaderBar = () => {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (item) => {
    setExpandedItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // MENU WITH ROUTES
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },

    {
      icon: Package,
      label: "Products",
      path: "#",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/product-list" },
        { name: "Add New", path: "/admin/add-product" },
      ],
    },
    {
      icon: FolderTree,
      label: "Categories",
      path: "#",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/categories-list" },
        { name: "Add New", path: "/admin/add-categories" },
      ],
    },

    {
      icon: Flag,
      label: "Banners",
      path: "#",
      expandable: true,
      children: [
        { name: "View All", path: "/admin/banner-list" },
        { name: "Add New", path: "/admin/add-banner" },
      ],
    },

    {
      icon: Tag,
      label: "Popup-Ads",
      path: "/admin/popup-ads",
      
    },


    {
      icon: ShoppingCart,
      label: "Manage Orders",
      path: "#",
      expandable: true,
      children: [
        { name: "Processing Orders", path: "/admin/orders" },
        { name: "Shipped Orders", path: "/admin/orders?status=pending" },
        { name: "Delivered Orders", path: "/admin/orders?status=completed" },
        { name: "Cancelled Orders", path: "/admin/orders?status=cancelled" },
        { name: "Returned Orders", path: "/admin/orders?status=returned" },
      ],
    },

    

    { icon: Users, label: "Customers", path: "/admin/customers" },
    { icon: MapPin,
      label: "Manage Address",
      path: "#",
      expandable: true,
      children: [
        { name: "Set Address & Shipping", path: "/admin/shipping" },
        { name: "Manage Address & Shipping", path: "/admin/shipping/manage" },
        
      ],
     },

    { icon: Star, label: "Reviews & Ratings", path: "/admin/reviews" },
    
    { icon: FileText, label: "Grievances", path: "/admin/grievances" },
    

    

    { icon: BarChart3, label: "Warranty Report", path: "/admin/report" },
    { icon: Truck, label: "Shipping Carriers", path: "/admin/shipping" },
    
    { icon: XCircle, label: "Return & Cancel Reasons", path: "/admin/returns" },

    {
      icon: Shield,
      label: "Compliance & Legitimacy",
      path: "#",
      expandable: true,
      children: [
        { name: "About Us", path: "/admin/compliance/policies" },
        { name: "Company Information", path: "/admin//comp-info" },
      
        { name: "Shipping Information", path: "/admin/compliance/shipping" },
        { name: "Contact Us", path: "/admin/contact" },

      ],
    },
    {
      icon: MessageSquare,
      label: "Testimonials",
      path: "admin/testimonials",
      
    },

  ];
     const pathname = usePathname();
  
    if (pathname === "/admin/login") return null;

  return (
    <div className="w-64 bg-white h-full border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {menuItems.map((item, index) => (
          <div key={index}>
            {/* Main Button */}
            <div
              className="flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 cursor-pointer group transition-colors"
              onClick={() => item.expandable && toggleExpand(item.label)}
            >
              <Link
                href={item.path}
                className="flex items-center gap-3 w-full"
              >
                <item.icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                <span className="text-sm text-gray-700 group-hover:text-blue-600">
                  {item.label}
                </span>
              </Link>

              {item.expandable && (
                <div className="text-gray-400 ml-2">
                  {expandedItems[item.label] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              )}
            </div>

            {/* Expandable Children */}
            {item.expandable &&
              expandedItems[item.label] &&
              item.children && (
                <div className="bg-gray-50 py-1">
                  {item.children.map((child, i) => (
                    <Link
                      key={i}
                      href={child.path}
                      className="block pl-12 pr-4 py-2 text-sm text-gray-600 hover:text-blue-600 cursor-pointer"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
          </div>
        ))}
      </div>

      
      
    </div>
  );
};

export default SideHeaderBar;
