"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  Clock,
  CheckCircle,
  TruckIcon,
  AlertCircle,
  Calendar,
  MapPin,
  Edit,
  Search,
  Users,
  Save,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import logo from "@/public/logo.png";
import { API_BASE_URL, authAPI } from "@/utils/api";

export default function ProfilePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("orders");
  const [getorders, setGetOrders] = useState([]);
  const [getuser, setGetUser] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState();
  const [alertStatus, setAlertStatus] = useState({});
  const [isExiting, setIsExiting] = useState(false);
  const [formDataForPassword, setFormDataForPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Mock reservations data
  const reservations = [
    {
      id: "RES-1234",
      date: "2023-05-20",
      time: "19:00",
      guests: 4,
      status: "confirmed",
    },
    {
      id: "RES-1235",
      date: "2023-06-15",
      time: "20:00",
      guests: 2,
      status: "pending",
    },
  ];

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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-500/20 text-orange-500";
      case "processing":
        return "bg-yellow-500/20 text-yellow-500";
      case "completed":
        return "bg-blue-500/20 text-blue-500";
      case "delivered":
        return "bg-green-500/20 text-green-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      case "refunded":
        return "bg-red-500/20 text-red-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending";
      case "processing":
        return "Processing";
      case "completed":
        return "Completed";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      case "refunded":
        return "Refunded";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={18} />;
      case "processing":
        return <Clock size={18} />;
      case "completed":
        return <CheckCircle size={18} />;
      case "delivered":
        return <TruckIcon size={18} />;
      case "cancelled":
        return <AlertCircle size={18} />;
      case "refunded":
        return <AlertCircle size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  const handleSaveUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/updatedetails`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
        }),
      });
      if (response.success) {
        setGetUser(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const ShowOrders = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/orders/myorders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data.data);
      setGetOrders(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const ShowUser = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data.data);
      setGetUser(data.data);
      setUser(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchQuery.trim()) return getorders;

    const query = searchQuery.toLowerCase().trim();
    return getorders.filter((order) => {
      // Search in order number
      if (order.orderNumber.toLowerCase().includes(query)) return true;

      // Search in status
      if (getStatusText(order.status).toLowerCase().includes(query))
        return true;

      // Search in items
      if (
        order.items &&
        order.items.some((item) => item.name.toLowerCase().includes(query))
      )
        return true;

      return false;
    });
  }, [getorders, searchQuery]);

  useEffect(() => {
    ShowOrders();
    ShowUser();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/logout`);
      const ress = await res.json();
      console.log(ress);

      if (ress.success) {
        // Clear token and user data
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("email");
        localStorage.removeItem("orders");
        localStorage.removeItem("cart");

        // Clear session storage if used
        sessionStorage.clear();

        // Replace current history entry and redirect
        window.history.replaceState(null, "", "/");
        window.location.href = "/";

        // Optional: Force reload to clear any in-memory state
        window.location.reload();
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Optional: Show error message to user
      // setError("Failed to logout. Please try again.");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setFormDataForPassword((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      formDataForPassword.newPassword !== formDataForPassword.confirmPassword
    ) {
      setAlertStatus({
        type: true,
        message: "New passwords don't match!",
      });
      return;
    }

    if (formDataForPassword.newPassword.length < 8) {
      alert();
      setAlertStatus({
        type: true,
        message: "Password must be at least 8 characters long!",
      });
      return;
    }

    try {
      const responce = await authAPI.updatePassword({currentPassword: formDataForPassword.currentPassword, newPassword: formDataForPassword.newPassword});
      if (responce.success) {
        setAlertStatus({
          type: true,
          message: "Password updated successfully!",
        });
      } else {
        setAlertStatus({
          type: true,
          message: responce.message,
        });
      }
    } catch (error) {
      setAlertStatus({
        type: true,
        message: "Current Password is incorrect!",
      });
    }

    // Reset form after submission
    setFormDataForPassword({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (Object.keys(alertStatus).length > 0) {
      setIsExiting(false);
      timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setAlertStatus({});
          setIsExiting(false);
        }, 300); 
      }, 3000); 
    }
    return () => clearTimeout(timer);
  }, [alertStatus]);

  return (
    <div className="bg-[#121212] text-white min-h-screen">
      {/* Header */}
      <header className="bg-[#1a1a1a] py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo || "/placeholder.svg"}
              alt={logo}
              className="w-28"
            ></Image>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden sticky top-8">
              <div className="p-6 border-b border-gray-800">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src={getuser.image || "/placeholder.svg"}
                      alt={getuser.name || "/placeholder.svg"}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h2 className="text-xl font-bold">{getuser.name}</h2>
                  <p className="text-gray-400 text-sm">{getuser.email}</p>
                </div>
              </div>

              <nav className="p-4">
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                    activeTab === "orders"
                      ? "bg-orange-500 text-white"
                      : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                  }`}
                >
                  <Package size={18} />
                  <span>My Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab("reservations")}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                    activeTab === "reservations"
                      ? "bg-orange-500 text-white"
                      : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                  }`}
                >
                  <Calendar size={18} />
                  <span>My Reservations</span>
                </button>

                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                    activeTab === "profile"
                      ? "bg-orange-500 text-white"
                      : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                  }`}
                >
                  <User size={18} />
                  <span>Profile Settings</span>
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                    activeTab === "settings"
                      ? "bg-orange-500 text-white"
                      : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                  }`}
                >
                  <Settings size={18} />
                  <span>Account Settings</span>
                </button>
              </nav>

              <div className="p-4 border-t border-gray-800">
                <button
                  onClick={() => handleLogout()}
                  className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <h1 className="text-2xl font-bold mb-2 md:mb-0">My Orders</h1>

                  <div className="w-full md:w-auto">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
                      />
                      <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                {getorders.length === 0 ? (
                  <div className="bg-[#1E1E1E] rounded-xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
                      <Package size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">No Orders Yet</h3>
                    <p className="text-gray-400 mb-6">
                      You haven't placed any orders yet.
                    </p>
                    <Link
                      href="/"
                      onClick={() => scrollToSection("menu")}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                    >
                      Browse Menu
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredOrders.length === 0 &&
                      searchQuery.trim() !== "" && (
                        <div className="bg-[#1E1E1E] rounded-xl p-8 text-center">
                          <div className="w-16 h-16 mx-auto bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
                            <Search size={24} className="text-gray-400" />
                          </div>
                          <h3 className="text-xl font-medium mb-2">
                            No Orders Found
                          </h3>
                          <p className="text-gray-400 mb-6">
                            No orders match your search for "{searchQuery}"
                          </p>
                          <button
                            onClick={() => setSearchQuery("")}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                          >
                            Clear Search
                          </button>
                        </div>
                      )}
                    {filteredOrders.map((order) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1E1E1E] rounded-xl overflow-hidden"
                      >
                        <div className="p-4 md:p-6 border-b border-gray-800">
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold">
                                  {order.orderNumber}
                                </h3>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {getStatusText(order.status)}
                                </span>
                              </div>
                              <p className="text-gray-400 text-sm">
                                {formatDate(order.orderDate)}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0">
                              <p className="text-xl font-bold text-orange-500">
                                ${order.totalPrice.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-400 text-right">
                                {order.itemsCount} items
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="p-4 md:p-6 border-b border-gray-800">
                          <h4 className="font-medium mb-4">Order Progress</h4>

                          {order.status === "cancelled" ||
                          order.status === "refunded" ? (
                            <div className="bg-red-500/10 text-red-500 p-3 rounded-lg flex items-center gap-2">
                              <AlertCircle size={18} />
                              <span className="font-medium">
                                {order.status === "cancelled"
                                  ? "Order Cancelled"
                                  : "Order Refunded"}
                              </span>
                            </div>
                          ) : (
                            <div className="flex justify-between items-center relative">
                              <div className="absolute left-0 right-0 top-1/4 h-[2px] bg-[#2a2a2a] -translate-y-1/2 z-0"></div>

                              {[
                                "pending",
                                "processing",
                                "completed",
                                "delivered",
                              ].map((status, index) => {
                                const isActive =
                                  (order.status === "pending" &&
                                    status === "pending") ||
                                  (order.status === "processing" &&
                                    (status === "pending" ||
                                      status === "processing")) ||
                                  (order.status === "completed" &&
                                    (status === "pending" ||
                                      status === "processing" ||
                                      status === "completed")) ||
                                  (order.status === "delivered" &&
                                    (status === "pending" ||
                                      status === "processing" ||
                                      status === "completed" ||
                                      status === "delivered"));

                                return (
                                  <div
                                    key={index}
                                    className="relative z-10 flex flex-col items-center"
                                  >
                                    <div
                                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        isActive
                                          ? "bg-orange-500"
                                          : "bg-gray-700"
                                      }`}
                                    >
                                      {status === "pending" && (
                                        <Clock size={18} />
                                      )}
                                      {status === "processing" && (
                                        <Clock size={18} />
                                      )}
                                      {status === "completed" && (
                                        <CheckCircle size={18} />
                                      )}
                                      {status === "delivered" && (
                                        <TruckIcon size={18} />
                                      )}
                                    </div>
                                    <p className="text-xs mt-2 text-center max-w-[80px]">
                                      {status === "pending"
                                        ? "Pending"
                                        : status === "processing"
                                        ? "Processing"
                                        : status === "completed"
                                        ? "Completed"
                                        : "Delivered"}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* Order Items */}
                        <div className="p-4 md:p-6">
                          <h4 className="font-medium mb-4">Order Items</h4>
                          <div className="space-y-4">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex gap-4">
                                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                  <Image
                                    src={item.image || "/placeholder.svg"}
                                    alt={item.name}
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <h5 className="font-medium">{item.name}</h5>
                                    <p className="font-medium">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                  <p className="text-sm text-gray-400">
                                    Qty: {item.quantity} × $
                                    {item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Reservations Tab */}
            {activeTab === "reservations" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">My Reservations</h1>

                {reservations.length === 0 ? (
                  <div className="bg-[#1E1E1E] rounded-xl p-8 text-center">
                    <div className="w-16 h-16 mx-auto bg-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
                      <Calendar size={24} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">
                      No Reservations
                    </h3>
                    <p className="text-gray-400 mb-6">
                      You haven't made any reservations yet.
                    </p>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
                      Make a Reservation
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reservations.map((reservation) => (
                      <motion.div
                        key={reservation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1E1E1E] rounded-xl p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold">{reservation.id}</h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              reservation.status === "confirmed"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-yellow-500/20 text-yellow-500"
                            }`}
                          >
                            {reservation.status === "confirmed"
                              ? "Confirmed"
                              : "Pending"}
                          </span>
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-gray-400" />
                            <span>
                              {new Date(reservation.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Clock size={18} className="text-gray-400" />
                            <span>{reservation.time}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Users size={18} className="text-gray-400" />
                            <span>
                              {reservation.guests}{" "}
                              {reservation.guests === 1 ? "person" : "people"}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <button className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors">
                            Modify
                          </button>
                          <button className="bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-lg transition-colors">
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === "profile" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

                <div className="bg-[#1E1E1E] rounded-xl p-6 mb-6">
                  <div className="flex justify-center items-center mx-auto mt-3 mb-10">
                    <div className="relative w-44 h-44">
                      <img
                        src={user.image || "/placeholder.svg"}
                        alt={user.name}
                        className="object-cover w-full h-full rounded-full"
                      />
                      <button className="absolute bottom-2 right-2 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors">
                        <Edit size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        onChange={(e) =>
                          setUser({ ...user, name: e.target.value })
                        }
                        defaultValue={user.name}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        disabled
                        defaultValue={user.email}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        onChange={(e) =>
                          setUser({ ...user, phone: e.target.value })
                        }
                        defaultValue={user.phone}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Member Since
                      </label>
                      <input
                        type="text"
                        defaultValue={formatDate(user.createdAt)}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSaveUser()}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                </div>

                {/*<div className="bg-[#1E1E1E] rounded-xl p-6">*/}
                {/*    <h2 className="text-xl font-medium mb-4">Profile Picture</h2>*/}

                {/*    <div className="flex flex-col md:flex-row items-center gap-6">*/}
                {/*        <div className="relative">*/}
                {/*            <div className="w-32 h-32 rounded-full overflow-hidden">*/}
                {/*                <Image*/}
                {/*                    src={user.image || "/placeholder.svg"}*/}
                {/*                    alt={user.name}*/}
                {/*                    width={128}*/}
                {/*                    height={128}*/}
                {/*                    className="object-cover"*/}
                {/*                />*/}
                {/*            </div>*/}
                {/*            <button className="absolute bottom-0 right-0 bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-colors">*/}
                {/*                <Edit size={16} />*/}
                {/*            </button>*/}
                {/*        </div>*/}

                {/*        <div className="flex-1">*/}
                {/*            <p className="text-gray-400 mb-4">Upload a new profile picture. JPG, PNG or GIF, maximum 5MB.</p>*/}
                {/*            <div className="flex flex-col gap-4">*/}
                {/*                <button className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors">*/}
                {/*                    Upload New Picture*/}
                {/*                </button>*/}
                {/*                <button className="bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-lg transition-colors">*/}
                {/*                    Remove Picture*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

                <div className="bg-[#1E1E1E] rounded-xl p-6 mb-6">
                  <h2 className="text-xl font-medium mb-4">Password</h2>

                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formDataForPassword.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formDataForPassword.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formDataForPassword.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="••••••••"
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handlePasswordSubmit}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-xl p-6">
                  <h2 className="text-xl font-medium mb-4 text-red-500">
                    Danger Zone
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="font-medium text-red-500 mb-2">
                        Delete Account
                      </p>
                      <p className="text-sm text-gray-400 mb-4">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Alert Status */}
      {Object.keys(alertStatus).length > 0 && (
        <div
          className={`fixed w-fit bottom-5 right-5 ${
            alertStatus.type
              ? "border-[#179417] bg-[#1b3f07]"
              : "border-[#941717] bg-[#3f0707]"
          } text-center py-4 px-4 border-2 rounded-xl text-gray-400 ${
            isExiting ? "animate-slideOut" : "animate-slideIn"
          }`}
        >
          {alertStatus.message}
        </div>
      )}
    </div>
  );
}
