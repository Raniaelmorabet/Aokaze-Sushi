"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/Image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {LayoutDashboard, ShoppingBag, Users, FileText, Settings, Menu, X, LogOut, Bell, Search, User, ChevronDown,} from "lucide-react"
import { RiUserStarLine } from "react-icons/ri";
import logo from "@/public/logo.png"
import { RiGalleryFill } from "react-icons/ri";
import { Tag } from "lucide-react";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { PiChefHat } from "react-icons/pi";
export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Menu Management", href: "/admin/menu", icon: FileText },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Testimonials", href: "/admin/testimonials", icon: RiUserStarLine },
    { name: "Gallery Management", href: "/admin/gallery", icon: RiGalleryFill },
    { name: "Category", href: "/admin/category", icon: MdOutlineRestaurantMenu },
    { name: "Chef's Management", href: "/admin/chefs", icon: PiChefHat },
    { name: "Offers Management", href: "/admin/offers", icon: Tag },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

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
                    <Image src={logo} alt='logo' className='w-20'/>
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
                    {item.icon && <item.icon size={20}/>}
                    {item.image && <Image src={item.image} size={20}/>}
                    <span>{item.name}</span>
                  </Link>
                ))}
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
              <Image src={logo} alt='logo' className='w-24'/>
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
                {item.icon && <item.icon size={20}/>}
                {item.image && <Image src={item.image} width={20}/> }
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-[#2a2a2a] hover:text-white transition-colors w-full">
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
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-300 hover:text-white">
                <Menu size={24} />
              </button>

              {/* <div className="relative hidden md:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-[#2a2a2a] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div> */}
            </div>

            <div className="flex items-center gap-4">
              <button className="relative text-gray-300 hover:text-white">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="relative">
                <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="hidden md:block">Admin User</span>
                  <ChevronDown size={16} />
                </button>
              </div>

              <Link href="/" className="hidden md:block text-sm text-gray-300 hover:text-white">
                View Website
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
