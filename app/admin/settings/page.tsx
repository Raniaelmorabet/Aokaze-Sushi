"use client";

import { useEffect, useRef, useState } from "react";
import {
  Save,
  User,
  Lock,
  Globe,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Building,
  Check,
  Bell,
} from "lucide-react";
import Image from "next/image";
import { API_BASE_URL, authAPI, settingsAPI } from "@/utils/api";
import Loading from "./loading";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [alertStatus, setAlertStatus] = useState({});
  const [isExiting, setIsExiting] = useState(false);
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState();
  const [name, setName] = useState();
  const [phone, setPhone] = useState();
  const fileInputRef = useRef();
  const [formDataForPassword, setFormDataForPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [generalSettings, setGeneralSettings] = useState({
    restaurantName: "Sushibre",
    email: "info@sushibre.com",
    phone: "+62 8914 2014",
    address: "123 Sushi Street, Cijeruk, Indonesia",
    website: "https://sushibre.com",
    currency: "USD",
    taxRate: "10",
    openingHours: {
      monday: { open: "09:00", close: "21:00", closed: false },
      tuesday: { open: "09:00", close: "21:00", closed: false },
      wednesday: { open: "09:00", close: "21:00", closed: false },
      thursday: { open: "09:00", close: "21:00", closed: false },
      friday: { open: "09:00", close: "10:00", closed: false },
      saturday: { open: "10:00", close: "22:00", closed: false },
      sunday: { open: "10:00", close: "20:00", closed: false },
    },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrder: true,
    orderStatus: true,
    customerReviews: true,
    lowInventory: false,
    promotions: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  });

  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    });
  };

  const handleHoursChange = (day, field, value) => {
    setGeneralSettings({
      ...generalSettings,
      openingHours: {
        ...generalSettings.openingHours,
        [day]: {
          ...generalSettings.openingHours[day],
          [field]: value,
        },
      },
    });
  };

  const handleToggleClosed = (day) => {
    setGeneralSettings({
      ...generalSettings,
      openingHours: {
        ...generalSettings.openingHours,
        [day]: {
          ...generalSettings.openingHours[day],
          closed: !generalSettings.openingHours[day].closed,
        },
      },
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };

  const ShowUser = async () => {
    setLoading(true);
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
      setUser(data.data);
      setProfileImage(data.data.image);
      setName(data.data.name);
      setPhone(data.data.phone);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);

      // Only append the image if a new one was selected
      const file = fileInputRef.current.files[0];
      if (file) {
        formData.append("image", file);
      }

      // Make the API request
      const response = await authAPI.updateUserDetails(formData);

      if (response.success) {
        setAlertStatus({
          type: true,
          message: "Settings saved successfully",
        });
        setUser(response.data);
      } else {
        console.error("Failed to save settings", response);
        setAlertStatus({
          type: false,
          message: "Failed to save settings",
        });
      }
    } catch (error) {
      console.error("Error saving settings", error);
      setAlertStatus({
        type: false,
        message: "Error saving settings",
      });
    }
  };

  const handleSaveSettings = async () => {
    try {
      // Prepare the data to send
      const settingsToUpdate = {
        ...generalSettings,
        taxRate: Number(generalSettings.taxRate),
      };

      const response = await settingsAPI.updateGeneralSettings(
        settingsToUpdate
      );

      if (response.success) {
        setAlertStatus({
          type: true,
          message: "Settings saved successfully",
        });
        // Optionally refresh the settings
        await getSettings();
      } else {
        console.error("Failed to save settings", response);
        setAlertStatus({
          type: false,
          message: response.message || "Failed to save settings",
        });
      }
    } catch (error) {
      console.error("Error saving settings", error);
      setAlertStatus({
        type: false,
        message: error.message || "Error saving settings",
      });
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
      setAlertStatus({
        type: true,
        message: "Password must be at least 8 characters long!",
      });
      return;
    }

    try {
      const responce = await authAPI.updatePassword({
        currentPassword: formDataForPassword.currentPassword,
        newPassword: formDataForPassword.newPassword,
      });
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

  const getSettings = async () => {
    try {
      const response = await settingsAPI.getSettings();
      if (response.success && response.data) {
        setGeneralSettings((prev) => ({
          ...prev,
          ...response.data,
          // Ensure taxRate is a string if your input expects it
          taxRate: response.data.taxRate?.toString() || "10",
        }));
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      setAlertStatus({
        type: false,
        message: "Failed to load settings",
      });
    }
  };

  useEffect(() => {
    ShowUser();
    getSettings();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (Object.keys(alertStatus).length > 0) {
      setIsExiting(false);
      timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setAlertStatus({});
          setIsExiting(false);
        }, 300); // Match this with your slideOut animation duration
      }, 3000); // Display duration
    }
    return () => clearTimeout(timer);
  }, [alertStatus]);

  if (loading) return <Loading />;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400">Manage your restaurant settings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full  flex items-center justify-center overflow-hidden">
                  <Image
                    src={user.image}
                    alt="image"
                    width={20}
                    height={20}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user.role}</p>
                </div>
              </div>
            </div>

            <nav className="p-4">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                  activeTab === "general"
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                <Building size={18} />
                <span>General</span>
              </button>

              <button
                onClick={() => setActiveTab("account")}
                className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                  activeTab === "account"
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                <User size={18} />
                <span>Account</span>
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                  activeTab === "notifications"
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                <Bell size={18} />
                <span>Notifications</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                  activeTab === "security"
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                <Lock size={18} />
                <span>Security</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden relative">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="p-6  mb-10">
                <h2 className="text-xl font-bold mb-6">General Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Restaurant Name
                    </label>
                    <input
                      type="text"
                      name="restaurantName"
                      value={generalSettings.restaurantName}
                      onChange={handleGeneralChange}
                      className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={generalSettings.email}
                        onChange={handleGeneralChange}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <Mail
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={generalSettings.phone}
                        onChange={handleGeneralChange}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <Phone
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        name="website"
                        value={generalSettings.website}
                        onChange={handleGeneralChange}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <Globe
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        value={generalSettings.address}
                        onChange={handleGeneralChange}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <MapPin
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Currency
                    </label>
                    <select
                      name="currency"
                      value={generalSettings.currency}
                      onChange={handleGeneralChange}
                      className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="IDR">IDR (Rp)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      name="taxRate"
                      value={generalSettings.taxRate}
                      onChange={handleGeneralChange}
                      min="0"
                      max="100"
                      className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-4">Opening Hours</h3>
                <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6 overflow-auto">
                  {Object.entries(generalSettings.openingHours).map(
                    ([day, hours]) => (
                      <div
                        key={day}
                        className="flex flex-col sm:flex-row items-center sm:justify-between py-3 border-b border-gray-700 last:border-0"
                      >
                        {/* Day Name */}
                        <div className="w-full sm:w-1/4 mb-2 sm:mb-0 capitalize text-center sm:text-left">
                          {day}
                        </div>

                        {/* Opening and Closing Times */}
                        {hours.closed ? (
                          <div className="text-gray-400 w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">
                            Closed
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 w-full sm:w-auto mb-2 sm:mb-0">
                            <input
                              type="time"
                              value={hours.open}
                              onChange={(e) =>
                                handleHoursChange(day, "open", e.target.value)
                              }
                              className="bg-[#333] text-white px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 w-1/2 sm:w-auto"
                            />
                            <span>to</span>
                            <input
                              type="time"
                              value={hours.close}
                              onChange={(e) =>
                                handleHoursChange(day, "close", e.target.value)
                              }
                              className="bg-[#333] text-white px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 w-1/2 sm:w-auto"
                            />
                          </div>
                        )}

                        {/* Closed Toggle */}
                        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={hours.closed}
                              onChange={() => handleToggleClosed(day)}
                              className="w-4 h-4 accent-orange-500"
                            />
                            <span className="text-sm">Closed</span>
                          </label>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-4 md:mt-0">
                  <button
                    onClick={handleSaveSettings}
                    className="absolute right-6 bottom-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="p-6 pb-10 relative">
                <h2 className="text-xl font-bold mb-6">Account Settings</h2>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  {/* Profile Image */}
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 relative">
                      <Image
                        src={profileImage}
                        alt="Profile"
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          className="text-white text-sm"
                          onClick={() => fileInputRef.current.click()}
                        >
                          Change
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">
                      Click on the image to change your profile picture
                    </p>
                  </div>

                  {/* Account Details */}
                  <div className="md:w-2/3">
                    <div className="mb-6">
                      <label className="block text-sm text-gray-400 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          defaultValue={user.email}
                          className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm text-gray-400 mb-1">
                        Role
                      </label>
                      <select
                        defaultValue="admin"
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        disabled
                      >
                        <option value="admin">Administrator</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">
                        Role changes must be made by a super administrator
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 md:mt-0">
                  <button
                    onClick={handleSave}
                    className="absolute right-6 bottom-5 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                  >
                    <Save size={18} />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">
                  Notification Settings
                </h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    Email Notifications
                  </h3>
                  <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">New Order Notifications</p>
                        <p className="text-sm text-gray-400">
                          Receive notifications when a new order is placed
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="newOrder"
                        checked={notificationSettings.newOrder}
                        onChange={handleNotificationChange}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Order Status Updates</p>
                        <p className="text-sm text-gray-400">
                          Receive notifications when an order status changes
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="orderStatus"
                        checked={notificationSettings.orderStatus}
                        onChange={handleNotificationChange}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Customer Reviews</p>
                        <p className="text-sm text-gray-400">
                          Receive notifications when a customer leaves a review
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="customerReviews"
                        checked={notificationSettings.customerReviews}
                        onChange={handleNotificationChange}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Low Inventory Alerts</p>
                        <p className="text-sm text-gray-400">
                          Receive notifications when inventory items are running
                          low
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="lowInventory"
                        checked={notificationSettings.lowInventory}
                        onChange={handleNotificationChange}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Promotions and Marketing</p>
                        <p className="text-sm text-gray-400">
                          Receive updates about promotions and marketing
                          campaigns
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="promotions"
                        checked={notificationSettings.promotions}
                        onChange={handleNotificationChange}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    Notification Channels
                  </h3>
                  <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-400">
                          Receive notifications via email
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-gray-400">
                          Receive notifications in your browser or mobile app
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="pushNotifications"
                        checked={notificationSettings.pushNotifications}
                        onChange={handleNotificationChange}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-400">
                          Receive notifications via text message
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={notificationSettings.smsNotifications}
                        onChange={handleNotificationChange}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Security Settings</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Change Password</h3>
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
                    {/* </div> */}

                    <button
                      onClick={handlePasswordSubmit}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Update Password
                    </button>
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
