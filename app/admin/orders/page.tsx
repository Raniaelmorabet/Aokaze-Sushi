"use client"

import { useState } from "react"
import { Search, Filter, ChevronDown, MoreHorizontal, Download, Printer, Eye, X, Check } from "lucide-react"
import Image from "next/image"

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTimeRange, setSelectedTimeRange] = useState("all")
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Mock data
  const orders = [
    {
      id: "ORD-7352",
      customer: {
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (123) 456-7890",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
        address: "123 Main St, New York, NY 10001",
      },
      items: [
        {
          id: 1,
          name: "Salmon Nigiri",
          price: 8.5,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
        },
        {
          id: 2,
          name: "Dragon Roll",
          price: 12.95,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=600&auto=format&fit=crop",
        },
      ],
      total: 29.95,
      status: "Completed",
      paymentMethod: "Credit Card",
      date: "2023-05-15T14:30:00",
      notes: "No wasabi please",
    },
    {
      id: "ORD-7351",
      customer: {
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "+1 (234) 567-8901",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
        address: "456 Oak Ave, San Francisco, CA 94102",
      },
      items: [
        {
          id: 3,
          name: "California Roll",
          price: 8.25,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1559410545-0bdcd187e323?q=80&w=600&auto=format&fit=crop",
        },
        {
          id: 4,
          name: "Miso Soup",
          price: 3.25,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?q=80&w=600&auto=format&fit=crop",
        },
        {
          id: 5,
          name: "Gyoza",
          price: 6.75,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1625938145744-e380515399b7?q=80&w=600&auto=format&fit=crop",
        },
      ],
      total: 29.75,
      status: "Processing",
      paymentMethod: "PayPal",
      date: "2023-05-15T12:15:00",
      notes: "",
    },
    {
      id: "ORD-7350",
      customer: {
        name: "Michael Chen",
        email: "michael.c@example.com",
        phone: "+1 (345) 678-9012",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
        address: "789 Pine St, Seattle, WA 98101",
      },
      items: [
        {
          id: 6,
          name: "Sushi Bento",
          price: 17.95,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
        },
        {
          id: 7,
          name: "Sake",
          price: 7.5,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1627517511589-b920f2c1a30b?q=80&w=600&auto=format&fit=crop",
        },
      ],
      total: 25.45,
      status: "Delivered",
      paymentMethod: "Credit Card",
      date: "2023-05-14T19:45:00",
      notes: "Extra wasabi and ginger",
    },
    {
      id: "ORD-7349",
      customer: {
        name: "Emily Wilson",
        email: "emily.w@example.com",
        phone: "+1 (456) 789-0123",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
        address: "321 Maple Rd, Chicago, IL 60601",
      },
      items: [
        {
          id: 8,
          name: "Spicy Tuna Roll",
          price: 9.5,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=600&auto=format&fit=crop",
        },
        {
          id: 9,
          name: "Edamame",
          price: 4.5,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1615361200141-f45625a9296d?q=80&w=600&auto=format&fit=crop",
        },
        {
          id: 10,
          name: "Matcha Tea",
          price: 4.25,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1563929084-73cd4bbe2ddc?q=80&w=600&auto=format&fit=crop",
        },
      ],
      total: 32.0,
      status: "Cancelled",
      paymentMethod: "Credit Card",
      date: "2023-05-14T18:30:00",
      notes: "Allergy to shellfish",
    },
    {
      id: "ORD-7348",
      customer: {
        name: "David Kim",
        email: "david.k@example.com",
        phone: "+1 (567) 890-1234",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
        address: "654 Elm St, Boston, MA 02108",
      },
      items: [
        {
          id: 11,
          name: "Rainbow Roll",
          price: 13.95,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=600&auto=format&fit=crop",
        },
        {
          id: 12,
          name: "Salmon Nigiri",
          price: 8.5,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop",
        },
      ],
      total: 30.95,
      status: "Pending",
      paymentMethod: "Apple Pay",
      date: "2023-05-14T15:20:00",
      notes: "",
    },
  ]

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus !== "all" && order.status !== selectedStatus) {
      return false
    }

    // Time range filtering would go here in a real application

    return true
  })

  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-500/20 text-green-500"
      case "Processing":
        return "bg-blue-500/20 text-blue-500"
      case "Delivered":
        return "bg-purple-500/20 text-purple-500"
      case "Cancelled":
        return "bg-red-500/20 text-red-500"
      case "Pending":
        return "bg-yellow-500/20 text-yellow-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateTax = (subtotal) => {
    return subtotal * 0.1 // 10% tax
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-400">Manage and track customer orders</p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              className="bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>

          <div className="relative">
            <button className="bg-[#1E1E1E] text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Filter size={18} />
              <span>Filter</span>
              <ChevronDown size={16} />
            </button>
          </div>

          <button className="bg-[#1E1E1E] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Download size={18} />
            <span>Export</span>
          </button>
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
            All Orders
          </button>
          <button
            onClick={() => setSelectedStatus("Pending")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "Pending" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setSelectedStatus("Processing")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "Processing"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setSelectedStatus("Delivered")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "Delivered" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setSelectedStatus("Completed")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "Completed" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setSelectedStatus("Cancelled")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "Cancelled" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Cancelled
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#2a2a2a]">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-[#2a2a2a] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={order.customer.avatar || "/placeholder.svg"}
                          alt={order.customer.name}
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-xs text-gray-400">{order.customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(order.date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{order.paymentMethod}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="p-1 hover:bg-[#333] rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-1 hover:bg-[#333] rounded-md transition-colors" title="Print Invoice">
                        <Printer size={16} />
                      </button>
                      <button className="p-1 hover:bg-[#333] rounded-md transition-colors" title="More Options">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-400">No orders found matching your filters.</p>
          </div>
        )}

        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm disabled:opacity-50">Previous</button>
            <button className="px-3 py-1 bg-orange-500 rounded-md text-sm">1</button>
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">2</button>
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">3</button>
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">Next</button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
              <h3 className="text-xl font-bold">Order Details - {selectedOrder.id}</h3>
              <button onClick={() => setShowOrderDetails(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-lg font-medium mb-4">Customer Information</h4>
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={selectedOrder.customer.avatar || "/placeholder.svg"}
                          alt={selectedOrder.customer.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{selectedOrder.customer.name}</p>
                        <p className="text-sm text-gray-400">{selectedOrder.customer.email}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-400">Phone: </span>
                        {selectedOrder.customer.phone}
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400">Address: </span>
                        {selectedOrder.customer.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Order Information</h4>
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Order Date:</span>
                        <span>{formatDate(selectedOrder.date)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Order Status:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Payment Method:</span>
                        <span>{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Amount:</span>
                        <span className="font-bold">${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <h4 className="text-lg font-medium mb-4">Order Items</h4>
              <div className="bg-[#2a2a2a] rounded-lg overflow-hidden mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#333]">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {selectedOrder.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-md overflow-hidden">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                            <span>{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">${item.price.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-lg font-medium mb-4">Order Notes</h4>
                  <div className="bg-[#2a2a2a] rounded-lg p-4 min-h-[100px]">
                    {selectedOrder.notes ? (
                      <p>{selectedOrder.notes}</p>
                    ) : (
                      <p className="text-gray-400 italic">No notes for this order</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium mb-4">Order Summary</h4>
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal:</span>
                        <span>${calculateSubtotal(selectedOrder.items).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tax (10%):</span>
                        <span>${calculateTax(calculateSubtotal(selectedOrder.items)).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shipping:</span>
                        <span>$5.00</span>
                      </div>
                      <div className="border-t border-gray-700 pt-2 mt-2">
                        <div className="flex justify-between font-bold">
                          <span>Total:</span>
                          <span>${selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6 flex flex-wrap gap-4 justify-between">
                <div className="space-x-2">
                  <button className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors">
                    <Printer size={18} className="inline mr-2" />
                    Print Invoice
                  </button>
                  <button className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors">
                    <Download size={18} className="inline mr-2" />
                    Download PDF
                  </button>
                </div>

                <div className="space-x-2">
                  {selectedOrder.status === "Pending" && (
                    <>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <X size={18} className="inline mr-2" />
                        Cancel Order
                      </button>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
                        <Check size={18} className="inline mr-2" />
                        Process Order
                      </button>
                    </>
                  )}

                  {selectedOrder.status === "Processing" && (
                    <button className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors">
                      <Check size={18} className="inline mr-2" />
                      Mark as Delivered
                    </button>
                  )}

                  {selectedOrder.status === "Delivered" && (
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors">
                      <Check size={18} className="inline mr-2" />
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
