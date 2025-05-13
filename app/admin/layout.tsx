"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/Image";
import { usePathname } from "next/navigation";
import { IoHomeOutline } from "react-icons/io5";
import { LuEye } from "react-icons/lu";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  User,
  ChevronDown,
} from "lucide-react";
import { RiUserStarLine } from "react-icons/ri";
import logo from "@/public/logo.png";
import { RiGalleryFill } from "react-icons/ri";
import { Tag } from "lucide-react";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { PiChefHat } from "react-icons/pi";
import { Toaster } from "sonner";
import { API_BASE_URL } from "@/utils/api";
export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Menu Management", href: "/admin/menu", icon: FileText },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Testimonials", href: "/admin/testimonials", icon: RiUserStarLine },
    { name: "Gallery Management", href: "/admin/gallery", icon: RiGalleryFill },
    {
      name: "Category",
      href: "/admin/category",
      icon: MdOutlineRestaurantMenu,
    },
    { name: "Chef's Management", href: "/admin/chefs", icon: PiChefHat },
    { name: "Offers Management", href: "/admin/offers", icon: Tag },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`);
      const ress = await res.json();

      if (ress.success) {
        // Clear token and user data
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("email");
        localStorage.removeItem("orders");
        localStorage.removeItem("cart");

        sessionStorage.clear();

        window.history.replaceState(null, "", "/auth/login");
        window.location.href = "/auth/login";

        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const ShowUser = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUser(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ShowUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80"
              onClick={() => setSidebarOpen(false)}
            ></motion.div>

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <Link href="/admin" className="flex items-center gap-2">
                  <div className="text-white">
                    <Image src={logo} alt="logo" className="w-20" />
                  </div>
                </Link>
                <button onClick={() => setSidebarOpen(false)}>
                  <X size={24} />
                </button>
              </div>

              <nav className="p-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-orange-500 text-white"
                        : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                    }`}
                  >
                    {item.icon && <item.icon size={20} />}
                    {item.image && <Image src={item.image} size={20} />}
                    <span>{item.name}</span>
                  </Link>
                ))}
                <Link
                  href={"/"}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-gray-300 hover:bg-[#2a2a2a] hover:text-white`}
                >
                  {/* <IoHomeOutline size={20}/> */}
                  <LuEye size={20} />
                  <span>View website</span>
                </Link>
              </nav>

              <div className="p-4 mt-auto border-t border-gray-800">
                <button className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors w-full">
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:bg-[#1a1a1a]">
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="text-white">
              <Image src={logo} alt="logo" className="w-24" />
            </div>
          </Link>
        </div>

        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                {item.icon && <item.icon size={20} />}
                {item.image && <Image src={item.image} width={20} />}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={() => handleLogout()}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors w-full"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="bg-[#1a1a1a] shadow-md">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center gap-4 ">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-300 hover:text-white"
              >
                <Menu size={24} />
              </button>
            </div>

            <div className="flex items-center gap-4 md:mr-5">
              <div className="relative">
                <Link
                  href={"/admin/settings"}
                  className="flex items-center gap-2 text-gray-300 "
                >
                  <div className="size-10 rounded-full  flex items-center justify-center hover:text-white border border-white/30 hover:opacity-85 hover:scale-105 hover:border-white duration-200">
                    {!loading ? (
                      <img
                        src={user?.image}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                </Link>
              </div>

              <Link
                href="/"
                className="hidden md:block text-sm text-gray-300 hover:text-white"
              >
                View Website
              </Link>
            </div>
          </div>
        </header>
        <Toaster position="top-center" richColors />
        {/* Page content */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
