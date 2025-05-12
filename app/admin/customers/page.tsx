"use client"

import {useEffect, useState} from "react"
import { Search, Eye, Phone, MapPin, Calendar, User, X } from "lucide-react"
import Image from "next/image"
import { API_BASE_URL } from "@/utils/api"

export default function CustomersPage() {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [customers, setCustomers] = useState([])
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCustomers: 0,
    limit: 8
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const getCustomers = async (page = 1, search = "") => {
    setIsLoading(true)
    const token = localStorage.getItem("token")
    try {
      let url = `${API_BASE_URL}/customers?page=${page}&limit=${pagination.limit}`
      
      if (search) {
        url += `&search=${search}`
      }
      
      if (selectedStatus !== "all") {
        url += `&status=${selectedStatus}`
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      })
      
      const data = await response.json()
      
      setCustomers(data.data)
      setPagination({
        ...pagination,
        currentPage: data.pagination.currentPage,
        totalPages: data.pagination.totalPages,
        totalCustomers: data.pagination.total
      })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCustomers()
  }, [selectedStatus])

  const handleSearch = (e) => {
    e.preventDefault()
    getCustomers(1, searchQuery)
  }

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.totalPages) return
    getCustomers(page, searchQuery)
  }

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
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </form>
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden mb-8">
        {/* <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4">
          <button
            onClick={() => {
              setSelectedStatus("all")
              setSearchQuery("")
            }}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "all" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            All Customers
          </button>
          <button
            onClick={() => setSelectedStatus("active")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "active" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setSelectedStatus("inactive")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "inactive" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Inactive
          </button>
          <button
            onClick={() => setSelectedStatus("blocked")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "blocked" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Blocked
          </button>
        </div> */}

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
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-gray-500 h-20 py-10 text-center animate-bounce">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length > 0 ? (
                customers.map((customer) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {customer.purchaseStats?.totalOrders || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${customer.purchaseStats?.totalSpent?.toFixed(2) || "0.00"}
                    </td>
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
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    No customers found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Showing {customers.length} of {pagination.totalCustomers} customers
          </p>
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1 bg-[#2a2a2a] rounded-md text-sm ${pagination.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333]'}`}
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum
              if (pagination.totalPages <= 5) {
                pageNum = i + 1
              } else if (pagination.currentPage <= 3) {
                pageNum = i + 1
              } else if (pagination.currentPage >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i
              } else {
                pageNum = pagination.currentPage - 2 + i
              }
              
              return (
                <button
                  key={pageNum}
                  className={`px-3 py-1 rounded-md text-sm ${
                    pageNum === pagination.currentPage 
                      ? 'bg-orange-500' 
                      : 'bg-[#2a2a2a] hover:bg-[#333]'
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              )
            })}
            
            <button 
              className={`px-3 py-1 bg-[#2a2a2a] rounded-md text-sm ${pagination.currentPage === pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#333]'}`}
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next
            </button>
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
                      {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                        <div className='flex flex-row flex-wrap gap-1 '>
                          <p>{selectedCustomer.orders[0].deliveryAddress?.street},</p>
                          <p>{selectedCustomer.orders[0].deliveryAddress?.city}</p>
                          <p>{selectedCustomer.orders[0].deliveryAddress?.state}</p>
                        </div>
                      ) : (
                        <p>No address available</p>
                      )}
                    </div>

                    <div className="bg-[#2a2a2a] p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-gray-400 mb-1">
                        <Calendar size={16}/>
                        <span className="text-sm">Last Order</span>
                      </div>
                      <p>
                        {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? 
                          formatDate(selectedCustomer.orders[selectedCustomer.orders.length - 1].orderDate) : 
                          'No orders yet'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#2a2a2a] p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm mb-1">Total Orders</p>
                      <p className="text-2xl font-bold">{selectedCustomer.purchaseStats?.totalOrders || 0}</p>
                    </div>

                    <div className="bg-[#2a2a2a] p-4 rounded-lg text-center">
                      <p className="text-gray-400 text-sm mb-1">Total Spent</p>
                      <p className="text-2xl font-bold text-orange-500">
                        ${selectedCustomer.purchaseStats?.totalSpent?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-lg font-medium mb-3">Recent Orders</h4>
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
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
                        {selectedCustomer.orders.map((order, index) => (
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
                ) : (
                  <p className="text-gray-400">No orders found for this customer.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}