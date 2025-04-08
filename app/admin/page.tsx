"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("week")

  // Mock data
  const stats = [
    {
      name: "Total Revenue",
      value: "$12,426",
      change: "+16.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500/20",
      textColor: "text-green-500",
    },
    {
      name: "Total Orders",
      value: "324",
      change: "+12.3%",
      trend: "up",
      icon: ShoppingBag,
      color: "bg-orange-500/20",
      textColor: "text-orange-500",
    },
    {
      name: "New Customers",
      value: "42",
      change: "-3.2%",
      trend: "down",
      icon: Users,
      color: "bg-blue-500/20",
      textColor: "text-blue-500",
    },
    {
      name: "Conversion Rate",
      value: "3.6%",
      change: "+2.1%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-purple-500/20",
      textColor: "text-purple-500",
    },
  ]

  const recentOrders = [
    {
      id: "ORD-7352",
      customer: "John Doe",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      items: 3,
      total: "$42.50",
      status: "Completed",
      date: "2 hours ago",
    },
    {
      id: "ORD-7351",
      customer: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
      items: 5,
      total: "$68.25",
      status: "Processing",
      date: "3 hours ago",
    },
    {
      id: "ORD-7350",
      customer: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
      items: 2,
      total: "$24.99",
      status: "Completed",
      date: "5 hours ago",
    },
    {
      id: "ORD-7349",
      customer: "Emily Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
      items: 4,
      total: "$56.75",
      status: "Delivered",
      date: "Yesterday",
    },
    {
      id: "ORD-7348",
      customer: "David Kim",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
      items: 1,
      total: "$18.50",
      status: "Completed",
      date: "Yesterday",
    },
  ]

  const topProducts = [
    {
      id: 1,
      name: "Salmon Nigiri",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=100&auto=format&fit=crop",
      orders: 124,
      revenue: "$1,054",
      growth: "+12%",
    },
    {
      id: 2,
      name: "Dragon Roll",
      image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=100&auto=format&fit=crop",
      orders: 98,
      revenue: "$1,269",
      growth: "+8%",
    },
    {
      id: 3,
      name: "Spicy Tuna Roll",
      image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=100&auto=format&fit=crop",
      orders: 86,
      revenue: "$731",
      growth: "+15%",
    },
    {
      id: 4,
      name: "California Roll",
      image: "https://images.unsplash.com/photo-1559410545-0bdcd187e323?q=80&w=100&auto=format&fit=crop",
      orders: 72,
      revenue: "$594",
      growth: "+5%",
    },
  ]

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400">Welcome back, Admin User</p>
        </div>

        <div className="mt-4 md:mt-0 bg-[#1E1E1E] rounded-lg p-1 flex">
          <button
            onClick={() => setTimeRange("day")}
            className={`px-4 py-2 rounded-md text-sm ${
              timeRange === "day" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setTimeRange("week")}
            className={`px-4 py-2 rounded-md text-sm ${
              timeRange === "week" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange("month")}
            className={`px-4 py-2 rounded-md text-sm ${
              timeRange === "month" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange("year")}
            className={`px-4 py-2 rounded-md text-sm ${
              timeRange === "year" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-[#1E1E1E] rounded-xl p-6 shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className={stat.textColor} size={24} />
              </div>
              <div className="flex items-center">
                <span className={`text-sm ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {stat.change}
                </span>
                {stat.trend === "up" ? (
                  <ArrowUpRight size={16} className="text-green-500" />
                ) : (
                  <ArrowDownRight size={16} className="text-red-500" />
                )}
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.name}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1 text-sm"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#2a2a2a]">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#2a2a2a] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={order.avatar || "/placeholder.svg"}
                              alt={order.customer}
                              width={32}
                              height={32}
                              className="object-cover"
                            />
                          </div>
                          <span>{order.customer}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.items}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.total}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "Completed"
                              ? "bg-green-500/20 text-green-500"
                              : order.status === "Processing"
                                ? "bg-blue-500/20 text-blue-500"
                                : order.status === "Delivered"
                                  ? "bg-purple-500/20 text-purple-500"
                                  : "bg-yellow-500/20 text-yellow-500"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{order.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button className="text-gray-400 hover:text-white">
                          <MoreHorizontal size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div>
          <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Top Products</h2>
              <Link
                href="/admin/menu"
                className="text-orange-500 hover:text-orange-400 transition-colors flex items-center gap-1 text-sm"
              >
                View All
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="p-6 space-y-6">
              {topProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{product.orders} orders</span>
                      <span className="text-green-500">{product.growth}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{product.revenue}</p>
                    <p className="text-sm text-gray-400">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
