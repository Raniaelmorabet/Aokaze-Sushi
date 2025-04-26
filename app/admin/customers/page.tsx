"use client"

import {useEffect, useState} from "react"
import { Search, Eye, Phone, MapPin, Calendar, User, X } from "lucide-react"
import Image from "next/image"
import { API_BASE_URL } from "@/utils/api"

export default function CustomersPage() {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [showCustomers, setShowCustomers] = useState([])

  // Mock data
  const customers = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (123) 456-7890",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
      address: "123 Main St, New York, NY 10001",
      joinDate: "2023-01-15",
      totalOrders: 12,
      totalSpent: 345.75,
      status: "active",
      lastOrder: "2023-05-10",
      notes: "Prefers spicy food. Allergic to shellfish.",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 (234) 567-8901",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
      address: "456 Oak Ave, San Francisco, CA 94102",
      joinDate: "2023-02-20",
      totalOrders: 8,
      totalSpent: 210.5,
      status: "active",
      lastOrder: "2023-05-12",
      notes: "",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "michael.c@example.com",
      phone: "+1 (345) 678-9012",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
      address: "789 Pine St, Seattle, WA 98101",
      joinDate: "2023-03-05",
      totalOrders: 5,
      totalSpent: 175.25,
      status: "inactive",
      lastOrder: "2023-04-18",
      notes: "Vegetarian",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily.w@example.com",
      phone: "+1 (456) 789-0123",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
      address: "321 Maple Rd, Chicago, IL 60601",
      joinDate: "2023-03-15",
      totalOrders: 15,
      totalSpent: 420.0,
      status: "active",
      lastOrder: "2023-05-14",
      notes: "VIP customer. Prefers window seating.",
    },
    {
      id: 5,
      name: "David Kim",
      email: "david.k@example.com",
      phone: "+1 (567) 890-1234",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
      address: "654 Elm St, Boston, MA 02108",
      joinDate: "2023-04-01",
      totalOrders: 3,
      totalSpent: 85.5,
      status: "active",
      lastOrder: "2023-05-01",
      notes: "",
    },
    {
      id: 6,
      name: "Jessica Martinez",
      email: "jessica.m@example.com",
      phone: "+1 (678) 901-2345",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop",
      address: "987 Cedar Ln, Austin, TX 78701",
      joinDate: "2023-04-10",
      totalOrders: 7,
      totalSpent: 195.75,
      status: "blocked",
      lastOrder: "2023-04-25",
      notes: "Payment issues. Account temporarily blocked.",
    },
  ]

  const getCustomers = async ()=> {
    const token = localStorage.getItem("token");
    try {
       const response = await fetch(`${API_BASE_URL}/customers?limit=6`, {
         method: "GET",
         headers: {
           "Content-Type": "application/json",
           Authorization: `Bearer ${token}`,
         }
       })
      const data = await response.json()
      console.log(data)
      setShowCustomers(data.data)
    }
    catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getCustomers()
  }, []);


  const filteredCustomers = customers.filter((customer) => {
    if (selectedStatus !== "all" && customer.status !== selectedStatus) {
      return false
    }
    return true
  })

  const viewCustomerDetails = (customer) => {
    setSelectedCustomer(customer)
    setShowCustomerDetails(true)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-500"
      case "inactive":
        return "bg-yellow-500/20 text-yellow-500"
      case "blocked":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-400">Manage your customer database</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "all" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            All Customers
          </button>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#2a2a2a]">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Spent
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {showCustomers.map((customer) => (
                <tr key={customer._id} className="hover:bg-[#2a2a2a] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <img
                          src={customer.image || "/placeholder.svg"}
                          alt={customer.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-xs text-gray-400">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-1 text-gray-400">
                      <Phone size={14} />
                      <span>{customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(customer.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{customer.purchaseStats.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${customer.purchaseStats.totalSpent.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => viewCustomerDetails(customer)}
                        className="p-1 hover:bg-[#333] rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-400">No customers found matching your filters.</p>
          </div>
        )}

        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Showing {filteredCustomers.length} of {customers.length} customers
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 bg-orange-500 rounded-md text-sm">1</button>
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">2</button>
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">Next</button>
          </div>
        </div>
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
              <h3 className="text-xl font-bold">Customer Details</h3>
              <button onClick={() => setShowCustomerDetails(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="md:w-1/3 flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img
                      src={selectedCustomer.image || "/placeholder.svg"}
                      alt={selectedCustomer.name}
                      className="object-cover h-full w-full"
                    />
                  </div>

                  <h3 className="text-xl font-bold text-center">{selectedCustomer.name}</h3>
                  <p className="text-gray-400 text-center mb-4">{selectedCustomer.email}</p>

                </div>

                <div className="md:w-2/3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#2a2a2a] p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Phone size={16} />
                        <span className="text-sm">Phone</span>
                      </div>
                      <p>{selectedCustomer.phone}</p>
                    </div>

                    <div className="bg-[#2a2a2a] p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Calendar size={16} />
                        <span className="text-sm">Customer Since</span>
                      </div>
                      <p>{formatDate(selectedCustomer.createdAt)}</p>
                    </div>

                    <div className="bg-[#2a2a2a] p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <MapPin size={16} />
                        <span className="text-sm">Address</span>
                      </div>
                      <div className='flex flex-row flex-wrap gap-1 '>
                        <p>{selectedCustomer.orders[0].deliveryAddress.street},</p>
                        <p>{selectedCustomer.orders[0].deliveryAddress.city}</p>
                        <p>{selectedCustomer.orders[0].deliveryAddress.state}</p>
                      </div>
                    </div>

                    <div className="bg-[#2a2a2a] p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Calendar size={16}/>
                        <span className="text-sm">Last Order</span>
                      </div>
                      <p>{formatDate(selectedCustomer.orders[selectedCustomer.orders.length - 1].orderDate)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#2a2a2a] p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                      <p className="text-2xl font-bold">{selectedCustomer.purchaseStats.totalOrders}</p>
                    </div>

                    <div className="bg-[#2a2a2a] p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                      <p className="text-2xl font-bold text-orange-500">${selectedCustomer.purchaseStats.totalSpent.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-medium mb-3">Recent Orders</h4>
                <div className="bg-[#2a2a2a] rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#333]">
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Order ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Amount</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                    {selectedCustomer.orders.map((order, index)=> (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm">{order.orderNumber}</td>
                          <td className="px-4 py-2 text-sm">{formatDate(order.orderDate)}</td>
                          <td className="px-4 py-2 text-sm">{order.totalPrice}</td>
                          <td className="px-4 py-2 text-sm">
                          <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-500">
                           {order.status}
                          </span>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
