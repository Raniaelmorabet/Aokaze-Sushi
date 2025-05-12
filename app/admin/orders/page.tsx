"use client";

import React, { useEffect, useState, useRef } from "react";
import { Search, MoreHorizontal, Eye, X, Check } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { orderAPI } from "@/utils/api";

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [count, setCount] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Create a ref object to store multiple menu refs
  const statusMenuRefs = useRef({});

  const statusEnum = [
    "pending",
    "processing",
    "completed",
    "cancelled",
    "refunded",
    "delivered",
  ];

  // Handle click outside status menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if we clicked outside any of the active menus
      const clickedOutsideAllMenus = !Object.values(
        statusMenuRefs.current
      ).some((ref) => ref && ref.contains(event.target));

      if (clickedOutsideAllMenus) {
        setSelectedOrderId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500/20 text-green-500";
      case "processing":
        return "bg-blue-500/20 text-blue-500";
      case "delivered":
        return "bg-purple-500/20 text-purple-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "refunded":
        return "bg-pink-500/20 text-pink-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const calculateTax = (subtotal) => {
    return subtotal * 0.1;
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setOrdersData((prevOrders) =>
      prevOrders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      )
    );
    setSelectedOrderId(null);
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      console.log(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error.message);
    }
  };

  const getOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await orderAPI.getOrders({
        page: currentPage,
        limit: 5,
        ...(selectedStatus ? { status: selectedStatus } : {}),
        ...(searchQuery ? { search: searchQuery } : {}),
      });
      setOrdersData(data.data);
      setPages(data.pages);
      setTotal(data.total);
      setCount(data.count);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  useEffect(() => {
    getOrders();
    console.log(currentPage, selectedStatus);
  }, [currentPage, selectedStatus, searchQuery]);

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 w-full">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-3xl font-bold"
          >
            Orders
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="text-gray-400"
          >
            Manage and track customer orders
          </motion.p>
        </div>

        <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="relative"
          >
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </motion.div>

          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="relative"
          >
            <button className="bg-[#1E1E1E] text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Filter size={18} />
              <span>Filter</span>
              <ChevronDown size={16} />
            </button>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="bg-[#1E1E1E] text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Download size={18} />
            <span>Export</span>
          </motion.button> */}
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-y-visible mb-8 w-full">
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            onClick={() => setSelectedStatus(null)}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === null
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            All Orders
          </motion.button>
          {statusEnum.map((status, index) => (
            <motion.button
              key={status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
              onClick={() => {
                setSelectedStatus(status);
                setCurrentPage(1);
                setSelectedOrderId(null);
              }}
              className={`px-4 py-2 rounded-lg text-sm ${
                selectedStatus === status
                  ? "bg-orange-500 text-white"
                  : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
        {!loadingOrders ? (
          <div className="overflow-x-auto overflow-y-visible relative w-full">
            <motion.table
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0 }}
              className="w-full"
            >
              <thead className="w-full">
                <tr className="bg-[#2a2a2a]">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
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
                {ordersData.map((order, index) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="hover:bg-[#2a2a2a] transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={order.customer.image || "/placeholder.svg"}
                            alt={order.customer.name}
                            width={32}
                            height={32}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{order.customer.name}</p>
                          <p className="text-xs text-gray-400">
                            {order.customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      $
                      {(
                        order.totalPrice +
                        calculateTax(calculateSubtotal(order.items)) +
                        5
                      ).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.payment.method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="p-1 hover:bg-[#333] rounded-md transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <div
                          className="relative"
                          ref={(el) => (statusMenuRefs.current[order._id] = el)}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrderId(
                                order._id === selectedOrderId ? null : order._id
                              );
                            }}
                            className="p-1 hover:bg-[#333] rounded-md transition-colors"
                            title="More Options"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {selectedOrderId === order._id && (
                            <div className="absolute right-0 z-50 mt-2 w-32 origin-top-right rounded-md bg-[#161616] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                              <div className="py-1">
                                {statusEnum.map((status) => (
                                  <button
                                    key={status}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(order._id, status);
                                    }}
                                    className={`block px-4 py-2 text-sm w-full text-left ${
                                      order.status.toLowerCase() === status
                                        ? "bg-orange-500/20 text-orange-500"
                                        : "text-gray-300 hover:bg-[#333]"
                                    }`}
                                  >
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          </div>
        ) : (
          <div className="w-full text-gray-400 h-20 flex justify-center items-center animate-bounce">
            Loading
          </div>
        )}
        {ordersData.length === 0 && !loadingOrders && (
          <div className="p-8 text-center">
            <p className="text-gray-400">No orders found</p>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Showing {count} of {total} orders
          </p>
          <div className="flex gap-2">
            <button
              onClick={() =>
                setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
              }
              disabled={currentPage === 1}
              className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(3, pages) }, (_, i) => {
              const pageNumber =
                Math.max(1, Math.min(currentPage - 1, pages - 3)) + i;
              if (pageNumber > pages) return null;
              return (
                <button
                  key={i}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === pageNumber
                      ? "bg-orange-500"
                      : "bg-[#2a2a2a] hover:bg-[#333]"
                  }`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => (prev < pages ? prev + 1 : prev))
              }
              disabled={currentPage === pages}
              className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetails && selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
                <h3 className="text-xl font-bold">
                  Order Details - {selectedOrder.orderNumber}
                </h3>
                <button onClick={() => setShowOrderDetails(false)}>
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      Customer Information
                    </h4>
                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                          <Image
                            src={
                              selectedOrder.customer.image || "/placeholder.svg"
                            }
                            alt={selectedOrder.customer.name}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {selectedOrder.customer.name}
                          </p>
                          <p className="text-sm text-gray-400">
                            {selectedOrder.customer.email}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="text-gray-400">Phone: </span>
                          {selectedOrder.customer.phone}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Address: </span>
                          {selectedOrder.deliveryAddress.street},{" "}
                          {selectedOrder.deliveryAddress.city}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-4">
                      Order Information
                    </h4>
                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order Date:</span>
                          <span>{formatDate(selectedOrder.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Order Status:</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                              selectedOrder.status
                            )}`}
                          >
                            {selectedOrder.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Method:</span>
                          <span>{selectedOrder.payment.method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Total Amount:</span>
                          <span className="font-bold">
                            ${selectedOrder.totalPrice.toFixed(2)}
                          </span>
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
                        <React.Fragment key={item._id + item.customizations}>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-md overflow-hidden">
                                  <Image
                                    src={
                                      item?.menuItem?.image || "/placeholder.svg"
                                    }
                                    alt={item?.menuItem?.name || "Menu Item"}
                                    width={48}
                                    height={48}
                                    className="object-cover"
                                  />
                                </div>
                                <span>{item?.menuItem?.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              ${item?.menuItem?.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              {item?.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                              ${(item?.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                          {item?.customizations &&
                            Object.entries(item.customizations).length > 0 && (
                              <tr className="bg-gray-800/50">
                                <td colSpan={4} className="px-6 py-2">
                                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-300">
                                    {Object.entries(item.customizations).map(
                                      ([category, options]) => (
                                        <div
                                          key={category}
                                          className="flex items-baseline"
                                        >
                                          <span className="font-medium text-gray-400 mr-1">
                                            {category}:
                                          </span>
                                          <span>
                                            {Array.isArray(options)
                                              ? options.join(", ")
                                              : options}
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-lg font-medium mb-4">Order Notes</h4>
                    <div className="bg-[#2a2a2a] rounded-lg p-4 min-h-[100px]">
                      {selectedOrder.deliveryInstructions ? (
                        <p>{selectedOrder.deliveryInstructions}</p>
                      ) : (
                        <p className="text-gray-400 italic">
                          No notes for this order
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium mb-4">Order Summary</h4>
                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal:</span>
                          <span>
                            ${calculateSubtotal(selectedOrder.items).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tax (10%):</span>
                          <span>
                            $
                            {calculateTax(
                              calculateSubtotal(selectedOrder.items)
                            ).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shipping:</span>
                          <span>$5.00</span>
                        </div>
                        <div className="border-t border-gray-700 pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total:</span>
                            <span>
                              $
                              {(
                                selectedOrder.totalPrice +
                                calculateTax(
                                  calculateSubtotal(selectedOrder.items)
                                ) +
                                5
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-wrap gap-4">
                  <div className="space-x-2">
                    {selectedOrder.status === "pending" && (
                      <>
                        <button
                          className="bg-[#f05a28] hover:bg-[#bb4b26] text-white px-4 py-2 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(selectedOrder._id, "processing");
                            setSelectedOrderId(null);
                            setShowOrderDetails(false);
                          }}
                        >
                          <Check size={18} className="inline mr-2" />
                          Process Order
                        </button>
                        <button
                          className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(selectedOrder._id, "cancelled");
                            setSelectedOrderId(null);
                            setShowOrderDetails(false);
                          }}
                        >
                          <X size={18} className="inline mr-2" />
                          Cancel Order
                        </button>
                      </>
                    )}

                    {selectedOrder.status === "processing" && (
                      <button
                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(selectedOrder._id, "completed");
                          setSelectedOrderId(null);
                          setShowOrderDetails(false);
                        }}
                      >
                        <Check size={18} className="inline mr-2" />
                        Mark as Completed
                      </button>
                    )}

                    {selectedOrder.status === "completed" && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusChange(selectedOrder._id, "delivered");
                          setSelectedOrderId(null);
                          setShowOrderDetails(false);
                        }}
                      >
                        <Check size={18} className="inline mr-2" />
                        Mark as Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
