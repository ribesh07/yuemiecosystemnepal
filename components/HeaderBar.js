"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  
  Menu,
  ShoppingBag,
  Settings,

  Phone,
  HelpCircle,
  ChevronDown,
  Search, User, ShoppingCart, ChevronLeft, ChevronRight,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
// import useCartStore from "@/stores/useCartStore";
import toast from "react-hot-toast";
import Link from "next/link";
// import { userDetails } from "@/utils/apiHelper";
import { apiRequest } from "@/utils/ApisafeCalls";
// import useConfirmModalStore from "@/stores/confirmModalStore";
// import SearchBar from "@/components/SearchBar";
// const HeaderBar = () => {
//   const router = useRouter();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isSuppliesDropdownOpen, setIsSuppliesDropdownOpen] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const menuRef = useRef(null);
//   const suppliesRef = useRef(null);
//   const pathname = usePathname();
//   const [searchTerm, setSearchTerm] = useState("");
//   const [user, setUser] = useState([
//     {
//       id: null,
//       full_name: "",
//       phone: "",
//       email: "",
//       image_full_url: "",
//       created_at: "",
//     },
//   ]);
//   const [isloggedin, setIsloggedin] = useState(false);

// //   useEffect(() => {
// //     const checkAuth = async () => {
// //       const token = localStorage.getItem("token");

// //       if (token) {
// //         setIsloggedin(true);
// //         const details = await userDetails();
// //         if (details) {
// //           setUser(details);
// //         } else {
// //           // It's possible the token is invalid, so log out.
// //           handleLogout();
// //         }
// //       } else {
// //         setIsloggedin(false);
// //         setUser({});
// //       }
// //     };

// //     checkAuth();

// //     const handleClickOutside = (event) => {
// //       if (menuRef.current && !menuRef.current.contains(event.target)) {
// //         setIsMenuOpen(false);
// //       }
// //       if (suppliesRef.current && !suppliesRef.current.contains(event.target)) {
// //         setIsSuppliesDropdownOpen(false);
// //       }
// //     };

// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, [pathname]);

// //   const cartCount = useCartStore((state) => state.getCartCount());
// //   const cartTotal = useCartStore((state) => state.getCartTotal());
// //   useEffect(() => {
// //     setTimeout(() => {
// //       console.log("Waiting for 1 second before fetching cart data");
// //     }, 1000);
// //     if (isloggedin) {
// //       console.log("isloggedin", isloggedin);
// //       const fetchCart = async () => {
// //         const cartResponse = await apiRequest(`/customer/cart/list`, true);
// //         if (cartResponse && cartResponse.cart) {
// //           useCartStore.getState().setCart(cartResponse.cart);
// //         }
// //         // console.log("cartResponse from header", cartResponse);
// //       };
// //       fetchCart();
// //     }
// //   }, [pathname, isloggedin]);

//   const menuItems = [
//     { label: "Dental Supplies", href: "#", hasSubmenu: true },
//     { label: "Equipment", href: "#" },
//     { label: "Technology", href: "#" },
//     { label: "Office Supplies", href: "#" },
//     { label: "Infection Control", href: "#" },
//     { label: "Laboratory", href: "#" },
//     { label: "Patient Care", href: "#" },
//     { label: "Practice Management", href: "#" },
//   ];

//   const suppliesSubmenu = [
//     { label: "Deal Of The Week", href: "#", color: "text-blue-600" },
//     { label: "Top Deals", href: "#", color: "text-blue-600" },
//     { label: "Browse Supplies", href: "#", color: "text-red-600" },
//     { label: "Web Priced Products", href: "#", color: "text-blue-600" },
//     { label: "Top Categories", href: "#", color: "text-blue-600" },
//   ];

//   const [settings, setSettings] = useState({
//     company_logo_header: null,
//   });

//   // Search functionality
//   const handleSearch = () => {
//     if (searchTerm) {
//       setSearchTerm("");
//       router.push(`/product/`);
//       router.refresh();
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsloggedin(false);
//     setUser({});
//     useCartStore.getState().clearCart();
//     router.refresh();
//     router.push("/dashboard");
//   };

//   useEffect(() => {
//     // const fetchSettings = async () => {
//     //   const response = await apiRequest("/settings", false);
//     //   if (response.success) {
//     //     // setSettings(response.settings);
//     //     const { company_logo_header } = response.settings;

//     //     const headerLogo = company_logo_header?.header_logo_full_url || "";
//     //     setSettings({
//     //       company_logo_header: headerLogo,
//     //     });

//     //     console.log("settings", response.settings);
//     //   } else {
//     //     // console.error("Failed to fetch settings:", response.error);
//     //     toast.error(response?.errors[0]?.message || "Failed to fetch settings");
//     //     // setSettings();
//     //   }
//     // };
//     // fetchSettings();
//   }, []);

//   return (
//   <div className="max-w-7xl mx-auto bg-gray-50 sticky top-0 z-50 ">
//     <div className="w-full">
//       {/* Main Header */}
//       <div className="max-w-7xl mx-auto mb-2 bg-gray-50">
//         <div className="flex items-center justify-between py-2 md:py-4">
//           {/* Logo */}
//           {settings.company_logo_header ? (
//             <div className="flex items-center space-x-2 md:space-x-4 ml-1">
//               <div className="flex items-center">
//                 <img
//                   onClick={() => router.push("/dashboard")}
//                   src={settings.company_logo_header }
//                   alt="Yuemi Ecosystem Nepal"
//                   className="h-14 w-18 md:h-20 md:w-30 cursor-pointer"
//                   loading="lazy"
//                   draggable={false}
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center space-x-2 md:space-x-4">
//               <div className="flex items-center">
//                 <img
//                     onClick={() => router.push("/dashboard")}
//                     src="/yuemi_logo_black.png"
//                     alt="Yuemi Ecosystem Nepal"
//                     className="h-4 md:h-6 w-auto cursor-pointer"
//                     loading="lazy"
//                     draggable={false}
//                     />
//               </div>
//             </div>
//           )}

//           {/* Desktop Search */}
//           {/* <div className="hidden md:flex items-center justify-between space-x-4 w-full max-w-2xl"> */}
//             {/* <SearchBar /> */}
//           {/* </div> */}

//           {/* Mobile Row → Logo + Search + Shop/Menu */}
//           <div className="flex items-center space-x-2 md:hidden flex-1 justify-end">
//             {/* Mobile Search */}
//             <div className="flex-1 max-w-[200px] sm:max-w-[200px]">
//               {/* <SearchBar /> */}
//             </div>
//             {/* Mobile Menu Button */}
//             <div className="md:hidden flex items-center space-x-2">
//               {isloggedin && user && (
//                 <>
//                   {/* Shop Button */}
//                   <button
//                     onClick={() => {
//                       if (!isloggedin) {
//                         router.push("/account");
//                       } else {
//                         router.push("/cart");
//                       }
//                     }}
//                     className="flex flex-col items-center p-2 mt-4 text-gray-600 hover:text-red-600 transition-colors cursor-pointer transform hover:scale-105"
//                   >
//                     <div className="bg-red-100 p-2 rounded-lg mb-1 relative">
//                       <ShoppingBag className="w-6 h-6 text-red-600" />
//                       <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                         {cartCount}
//                       </span>
//                     </div>
//                     <span className="text-xs">Shop</span>
//                   </button>
//                 </>
//               )}

//               {/* Mobile Menu Toggle */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="p-2 text-gray-600 hover:text-red-600 mr-1"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-6 h-6" />
//                 ) : (
//                   <Menu className="w-6 h-6" />
//                 )}
//               </button>
//             </div>
//           </div>

            
            

//             {/* Desktop Right Side Actions */}
//             <div className="hidden md:flex items-center space-x-4">
//               {/* Menu Button with Dropdown */}
              

//               {/* Login and Signup Button */}
//               {!isloggedin && (
//                 <div className="bg-[#ff6602] rounded-lg mb-3 mx-2 p-2 relative hover:underline hover:scale-105 transition-all duration-300 cursor-pointer">
//                   <Link
//                     href="/account"
//                     className="flex items-center space-x-2 text-white "
//                   >
//                     <User className="w-4 h-4" />
//                     <span className="text-sm font-medium ">Login</span>
//                   </Link>
//                 </div>
//               )}

//               {isloggedin && user && (
//                 <>
                  

//                   {/* Shop Button */}
//                   <button
//                     onClick={() => {
//                       if (!isloggedin) {
//                         router.push("/account");
//                       } else {
//                         router.push("/cart");
//                       }
//                     }}
//                     className="flex flex-col items-center p-2 text-gray-600 hover:text-red-600 transition-colors cursor-pointer transform hover:scale-105"
//                   >
//                     <div className="bg-red-100 p-2 rounded-lg mb-1 relative">
//                       <ShoppingBag className="w-6 h-6 text-red-600" />
//                       <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                         {cartCount}
//                       </span>
//                     </div>
//                     <span className="text-xs">Shop</span>
//                   </button>
//                 </>
//               )}

//               {/* My Account Button */}
//               {isloggedin && (
//                 <button
//                   onClick={() => router.push("/myaccount")}
//                   className="flex flex-col items-center text-gray-600 hover:text-red-600 transform hover:scale-105 transition-colors cursor-pointer mr-1"
//                 >
//                   <div className="bg-blue-100 p-2 rounded-lg mb-1 ">
//                     <Settings className="w-6 h-6 text-[#ff6602]" />
//                   </div>
//                   <span className="text-xs">My Account</span>
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Mobile Search Bar - Always visible on mobile when not on product page */}
//           {/* <div className="flex md:hidden items-center w-full px-4">
//             <SearchBar className="w-full" />
//           </div> */}
          
         
//           {/* Desktop Login Section */}
//           <div className="sm:block w-full bg-gray-50 border-t border-b border-gray-200 rounded-lg px-2 sm:px-6 py-3">
//             <div className="max-w-7xl mx-auto flex justify-center">
//               <div className="flex w-full max-w-xl justify-between items-center text-gray-600 sm:text-gray-600 text-bold text-[12px] sm:text-[16px] gap-x-2 sm:gap-x-4 p-0.5">
//                 <div className="flex items-center justify-between py-2 md:py-4">
//           {/* Logo */}
//           {settings.company_logo_header ? (
//             <div className="flex items-center space-x-2 md:space-x-4 ml-1">
//               <div className="flex items-center">
//                 <img
//                   onClick={() => router.push("/dashboard")}
//                   src={settings.company_logo_header }
//                   alt="Yuemi Ecosystem Nepal"
//                   className="h-14 w-18 md:h-20 md:w-30 cursor-pointer"
//                   loading="lazy"
//                   draggable={false}
//                 />
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-center space-x-2 md:space-x-4">
//               <div className="flex items-center">
//                 <img
//                     onClick={() => router.push("/dashboard")}
//                     src="/yuemi_logo_black.png"
//                     alt="Yuemi Ecosystem Nepal"
//                     className="h-4 md:h-6 w-auto cursor-pointer"
//                     loading="lazy"
//                     draggable={false}
//                     />
//               </div>
//             </div>
//           )}

//           {/* Desktop Search */}
//           {/* <div className="hidden md:flex items-center justify-between space-x-4 w-full max-w-2xl"> */}
//             {/* <SearchBar /> */}
//           {/* </div> */}

//           {/* Mobile Row → Logo + Search + Shop/Menu */}
//           <div className="flex items-center space-x-2 md:hidden flex-1 justify-end">
//             {/* Mobile Search */}
//             {/* <div className="flex-1 max-w-[200px] sm:max-w-[200px]"> */}
//               {/* <SearchBar /> */}
//             {/* </div> */}
//             {/* Mobile Menu Button */}
//             <div className="md:hidden flex items-center space-x-2">
//               {isloggedin && user && (
//                 <>
//                   {/* Shop Button */}
//                   <button
//                     onClick={() => {
//                       if (!isloggedin) {
//                         router.push("/account");
//                       } else {
//                         router.push("/cart");
//                       }
//                     }}
//                     className="flex flex-col items-center p-2 mt-4 text-gray-600 hover:text-red-600 transition-colors cursor-pointer transform hover:scale-105"
//                   >
//                     <div className="bg-red-100 p-2 rounded-lg mb-1 relative">
//                       <ShoppingBag className="w-6 h-6 text-red-600" />
//                       <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                         {cartCount}
//                       </span>
//                     </div>
//                     <span className="text-xs">Shop</span>
//                   </button>
//                 </>
//               )}

//               {/* Mobile Menu Toggle */}
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="p-2 text-gray-600 hover:text-red-600 mr-1"
//               >
//                 {isMobileMenuOpen ? (
//                   <X className="w-6 h-6" />
//                 ) : (
//                   <Menu className="w-6 h-6" />
//                 )}
//               </button>
//             </div>
//           </div>
//           </div>

//                 <Link
//                   href="/dashboard"
//                   className="hover:underline font-bold hover:text-[#ff6602] hover:scale-105 transition-all duration-200 cursor-pointer"
//                 >
//                   Home
//                 </Link>
//                 <Link
//                   href="/product"
//                   className="hover:underline font-semibold hover:text-[#ff6602] hover:scale-105 transition-all duration-200 cursor-pointer"
//                 >
//                   Browse Products
//                 </Link>
//                 <Link
//                   href="/hot-sales"
//                   className="hover:underline font-semibold hover:text-[#ff6602] hover:scale-105 transition-all duration-200 cursor-pointer"
//                 >
//                   Flash Sales
//                 </Link>
//                 <Link
//                   href="/combo-offers"
//                   className="hover:underline font-semibold hover:text-[#ff6602] hover:scale-105 transition-all duration-200 cursor-pointer"
//                 >
//                   Combo Offers
//                 </Link>
                
//               </div>

              
//             </div>
//           </div>
//         </div>

//         {/* Mobile Menu Overlay */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
//             <div className="fixed top-0 right-0 h-full w-80 bg-gray-50 shadow-lg z-50 overflow-y-auto">
//               <div className="p-4">
//                 {/* Mobile Menu Header */}

//                 <div className="flex items-center justify-between mb-2 border-b">
//                   {/* <h2 className="text-lg font-semibold">Menu</h2> */}
//                   <div className="flex flex-col items-center space-x-4 cursor-pointer group">
//                     <button
//                       onClick={() => router.push("/account/profile")}
//                       className="bg-transparent text-white mb-1 mt-1 text-[12px] border-2 border-blue-400 rounded-full hover:scale-105 transition-all transform flex items-center justify-center cursor-pointer"
//                     >
//                       {user.image_full_url ? (
//                         <img
//                           src={user.image_full_url}
//                           alt="Profile"
//                           className="w-8 h-8 rounded-full object-cover"
//                         />
//                       ) : (
//                         <User className="w-8 h-8" />
//                       )}
//                     </button>

//                     <span className="text-xs text-gray-600 mr-3 mb-2 group-hover:text-red-600 transition-colors duration-200">
//                       Profile
//                     </span>
//                   </div>
//                   <button
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className="p-2 hover:bg-gray-50 rounded"
//                   >
//                     <X className="w-5 h-5" />
//                   </button>
//                 </div>

//                 {/* Mobile Login/Logout/My Account Section */}
//                 {!isloggedin ? (
//                   <div className="mb-6 pb-4 border-b">
//                     <button
//                       className="w-full bg-[#bf0000] text-white text-sm py-3 rounded hover:bg-red-600  transition-colors flex items-center justify-center mb-3"
//                       onClick={() => {
//                         router.push("/account");
//                         setIsMobileMenuOpen(false);
//                       }}
//                     >
//                       <User className="w-4 h-4 mr-2" />
//                       LOGIN
//                     </button>
//                     <button
//                       className="block w-full text-center text-[#ff6602] hover:underline text-sm bg-transparent"
//                       onClick={() => {
//                         router.push("/account/signup");
//                         setIsMobileMenuOpen(false);
//                       }}
//                     >
//                       Create an Online Account
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="mb-6 pb-4 border-b space-y-3">
//                     <button
//                       className="w-full bg-[#FF930F] text-white text-sm py-3 rounded hover:bg-[#ff6602] transition-colors flex items-center justify-center"
//                       onClick={() => {
//                         router.push("/myaccount");
//                         setIsMobileMenuOpen(false);
//                       }}
//                     >
//                       <Settings className="w-4 h-4 mr-2" />
//                       My Account
//                     </button>
//                     <button
//                       className="w-full bg-[#bf0000] text-white text-sm py-3 rounded hover:bg-red-600 transition-colors flex items-center justify-center"
//                       onClick={() => {
//                         useConfirmModalStore.getState().open({
//                           title: "Logout",
//                           message: "Are you sure you want to logout?",
//                           onConfirm: handleLogout,
//                           onCancel: () => {},
//                         });
//                         setIsMobileMenuOpen(false);
//                       }}
//                     >
//                       <User className="w-4 h-4 mr-2" />
//                       Logout
//                     </button>
//                   </div>
//                 )}

                
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

export default function Header() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const announcements = [
    "Welcome to our Exclusive Online Store!",
    "Free Shipping on Orders Over 500!",
    "New Products Added Weekly!"
  ];

  // auto slide announcements
 useEffect(() => {
    if (!announcements.length) return;

    const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % announcements.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval); // cleanup
    }, [announcements.length]);


  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % announcements.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  return (
    <header className="w-full">
      {/* Announcement Bar */}
      <div className="bg-orange-500 text-white relative">
        <div className="flex items-center justify-between px-4 py-2">
          <button 
            onClick={prevSlide}
            className="p-1 hover:bg-orange-600 rounded transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className="text-center flex-1">
            <p className="text-[14px] md:text-base -mt-1 font-light ">
              {announcements[currentSlide]}
            </p>
          </div>
          
          <button 
            onClick={nextSlide}
            className="p-1 hover:bg-orange-600 rounded transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
                <img
                    onClick={() => router.push("/dashboard")}
                    src="/yuemi_logo_black.png"
                    alt="Yuemi Ecosystem Nepal"
                    className="h-4 md:h-6 w-auto cursor-pointer"
                    loading="lazy"
                    draggable={false}
                    />
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 text-[14px]">
              <a href="#home" className="text-orange-500 font-bold hover:text-orange-600 transition-colors">
                HOME
              </a>
              <a href="#about" className="text-gray-700 font-bold hover:text-orange-500 transition-colors">
                ABOUT US
              </a>
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 font-bold hover:text-orange-500 transition-colors">
                  <span>PRODUCT</span>
                  <ChevronDown size={16} />
                </button>
                <div className="absolute top-full text-[14px] left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <a href="#product1" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 hover:underline">
                    AMPLIFIER
                  </a>
                  <a href="#product2" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 hover:underline">
                    LED LIGHTS
                  </a>
                  <a href="#product3" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 hover:underline">
                   CAR SAFETY
                  </a>
                  <a href="#product4" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 hover:underline">
                   ACCESSORIES
                  </a>
                  <a href="#product5" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 hover:underline">
                   CAR INFOTAINMENT SYSTEM
                  </a>
                  <a href="#product6" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 hover:underline">
                   DAMPING & ACOUSTICS
                  </a>
                  <a href="#product7" className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 hover:underline">
                   CAR CARE & PROTECTION
                  </a>
                </div>
              </div>
              <a href="#contact" className="text-gray-700 font-bold hover:text-orange-500 transition-colors">
                CONTACT US
              </a>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <Search size={22} className="text-gray-700" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="User account"
              >
                <User size={22} className="text-gray-700" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={22} className="text-gray-700" />
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

// export default HeaderBar;
