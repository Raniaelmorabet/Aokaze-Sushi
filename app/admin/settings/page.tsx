"use client"

import { useState } from "react"
import { Save, User, Lock, Globe, CreditCard, Mail, Phone, MapPin, Building, Check, Bell } from "lucide-react"
import Image from "next/image"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  const [generalSettings, setGeneralSettings] = useState({
    restaurantName: "Sushibre",
    email: "info@sushibre.com",
    phone: "+62 8914 2014",
    address: "123 Sushi Street, Cijeruk, Indonesia",
    website: "https://sushibre.com",
    currency: "USD",
    taxRate: "10",
    openingHours: {
      monday: { open: "10:00", close: "23:00", closed: false },
      tuesday: { open: "10:00", close: "23:00", closed: false },
      wednesday: { open: "10:00", close: "23:00", closed: false },
      thursday: { open: "10:00", close: "23:00", closed: false },
      friday: { open: "10:00", close: "23:00", closed: false },
      saturday: { open: "10:00", close: "24:00", closed: false },
      sunday: { open: "12:00", close: "22:00", closed: false },
    },
  })

  const [notificationSettings, setNotificationSettings] = useState({
    newOrder: true,
    orderStatus: true,
    customerReviews: true,
    lowInventory: false,
    promotions: true,
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
  })

  const [paymentMethods, setPaymentMethods] = useState({
    creditCard: true,
    paypal: true,
    cash: true,
    stripe: false,
  })

  const handleGeneralChange = (e) => {
    const { name, value } = e.target
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    })
  }

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
    })
  }

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
    })
  }

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    })
  }

  const handleSave = () => {
    // In a real application, this would save to a database
    console.log("Saving settings:", { generalSettings, notificationSettings })

    // Show success message
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-400">Manage your restaurant settings</p>
        </div>

        <div className="mt-4 md:mt-0">
          <button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Save size={18} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 bg-green-500/20 text-green-500 p-4 rounded-lg flex items-center gap-2">
          <Check size={20} />
          <span>Settings saved successfully!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-gray-400">Administrator</p>
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
                onClick={() => setActiveTab("payment")}
                className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-colors mb-1 ${
                  activeTab === "payment"
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-[#2a2a2a] hover:text-white"
                }`}
              >
                <CreditCard size={18} />
                <span>Payment</span>
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
          <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">General Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Restaurant Name</label>
                    <input
                      type="text"
                      name="restaurantName"
                      value={generalSettings.restaurantName}
                      onChange={handleGeneralChange}
                      className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={generalSettings.email}
                        onChange={handleGeneralChange}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={generalSettings.phone}
                        onChange={handleGeneralChange}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Website</label>
                    <div className="relative">
                      <input
                        type="url"
                        name="website"
                        value={generalSettings.website}
                        onChange={handleGeneralChange}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Address</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        value={generalSettings.address}
                        onChange={handleGeneralChange}
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Currency</label>
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
                    <label className="block text-sm text-gray-400 mb-1">Tax Rate (%)</label>
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
                <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
                  {Object.entries(generalSettings.openingHours).map(([day, hours]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between py-2 border-b border-gray-700 last:border-0"
                    >
                      <div className="w-1/4 capitalize">{day}</div>

                      {hours.closed ? (
                        <div className="text-gray-400">Closed</div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={(e) => handleHoursChange(day, "open", e.target.value)}
                            className="bg-[#333] text-white px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                          <span>to</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={(e) => handleHoursChange(day, "close", e.target.value)}
                            className="bg-[#333] text-white px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                          />
                        </div>
                      )}

                      <div>
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
                  ))}
                </div>
              </div>
            )}

            {/* Account Settings */}
            {activeTab === "account" && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Account Settings</h2>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="md:w-1/3 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 relative">
                      <Image
                        src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=128&auto=format&fit=crop"
                        alt="Profile"
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="text-white text-sm">Change</button>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400">Click on the image to change your profile picture</p>
                  </div>

                  <div className="md:w-2/3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">First Name</label>
                        <input
                          type="text"
                          defaultValue="Admin"
                          className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                        <input
                          type="text"
                          defaultValue="User"
                          className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                        <input
                          type="email"
                          defaultValue="admin@sushibre.com"
                          className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          defaultValue="+62 8914 2014"
                          className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm text-gray-400 mb-1">Role</label>
                      <select
                        defaultValue="admin"
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        disabled
                      >
                        <option value="admin">Administrator</option>
                        <option value="manager">Manager</option>
                        <option value="staff">Staff</option>
                      </select>
                      <p className="text-xs text-gray-400 mt-1">Role changes must be made by a super administrator</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Notification Settings</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                  <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">New Order Notifications</p>
                        <p className="text-sm text-gray-400">Receive notifications when a new order is placed</p>
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
                        <p className="text-sm text-gray-400">Receive notifications when an order status changes</p>
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
                        <p className="text-sm text-gray-400">Receive notifications when a customer leaves a review</p>
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
                          Receive notifications when inventory items are running low
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
                          Receive updates about promotions and marketing campaigns
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
                  <h3 className="text-lg font-medium mb-4">Notification Channels</h3>
                  <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-400">Receive notifications via email</p>
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
                        <p className="text-sm text-gray-400">Receive notifications in your browser or mobile app</p>
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
                        <p className="text-sm text-gray-400">Receive notifications via text message</p>
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

            {/* Payment Settings */}
            {activeTab === "payment" && (
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Payment Settings</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                  <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-4">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-white rounded flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 24 16">
                            <path fill="#FF5F00" d="M15.245 2.11h-6.49v11.78h6.49V2.11z" />
                            <path
                              fill="#EB001B"
                              d="M9.167 8A7.5 7.5 0 0 1 12 2.11a7.5 7.5 0 1 0 0 11.78A7.5 7.5 0 0 1 9.167 8z"
                            />
                            <path
                              fill="#F79E1B"
                              d="M24 8a7.5 7.5 0 0 1-12 6A7.5 7.5 0 0 0 12 2.11 7.5 7.5 0 0 1 24 8z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Credit/Debit Cards</p>
                          <p className="text-sm text-gray-400">Accept payments via credit and debit cards</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={paymentMethods.creditCard}
                        onChange={() =>
                          setPaymentMethods({ ...paymentMethods, creditCard: !paymentMethods.creditCard })
                        }
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-[#0070BA] rounded flex items-center justify-center text-white text-xs font-bold">
                          PayPal
                        </div>
                        <div>
                          <p className="font-medium">PayPal</p>
                          <p className="text-sm text-gray-400">Accept payments via PayPal</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={paymentMethods.paypal}
                        onChange={() => setPaymentMethods({ ...paymentMethods, paypal: !paymentMethods.paypal })}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-black rounded flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-gray-400">Accept cash payments upon delivery</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={paymentMethods.cash}
                        onChange={() => setPaymentMethods({ ...paymentMethods, cash: !paymentMethods.cash })}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 bg-[#635BFF] rounded flex items-center justify-center text-white text-xs font-bold">
                          Stripe
                        </div>
                        <div>
                          <p className="font-medium">Stripe</p>
                          <p className="text-sm text-gray-400">Accept payments via Stripe</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={paymentMethods.stripe}
                        onChange={() => setPaymentMethods({ ...paymentMethods, stripe: !paymentMethods.stripe })}
                        className="w-5 h-5 accent-orange-500"
                      />
                    </label>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Currency and Pricing</h3>
                  <div className="bg-[#2a2a2a] rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Default Currency</label>
                      <select
                        defaultValue="USD"
                        className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                        <option value="IDR">IDR (Rp)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Tax Rate (%)</label>
                      <input
                        type="number"
                        defaultValue="10"
                        min="0"
                        max="100"
                        className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Minimum Order Amount</label>
                      <input
                        type="number"
                        defaultValue="10"
                        min="0"
                        className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Delivery Fee</label>
                      <input
                        type="number"
                        defaultValue="5"
                        min="0"
                        className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>
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
                  <div className="bg-[#2a2a2a] rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Current Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Password must be at least 8 characters long and include a mix of letters, numbers, and symbols
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full bg-[#333] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <div className="relative inline-block w-12 h-6">
                        <input
                          type="checkbox"
                          id="toggle"
                          className="opacity-0 w-0 h-0"
                          checked={twoFactorEnabled}
                          onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        />
                        <label
                          htmlFor="toggle"
                          className="block absolute cursor-pointer top-0 left-0 w-12 h-6 bg-gray-700 rounded-full transition-all duration-300 before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 before:transition-all before:duration-300 peer-checked:bg-orange-500 peer-checked:before:translate-x-6"
                        ></label>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400">
                      Two-factor authentication adds an additional layer of security to your account by requiring more
                      than just a password to sign in.
                    </p>

                    <button className="mt-4 bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-lg transition-colors">
                      Enable Two-Factor Authentication
                    </button>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Login Sessions</h3>
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <div className="mb-4">
                      <p className="font-medium">Current Sessions</p>
                      <p className="text-sm text-gray-400">
                        These are the devices that are currently logged into your account
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-[#333] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                              <path d="M12 18h.01" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Current Device</p>
                            <p className="text-xs text-gray-400">Jakarta, Indonesia • Chrome on Windows</p>
                          </div>
                        </div>
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">
                          Active Now
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-[#333] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect width="20" height="14" x="2" y="3" rx="2" />
                              <line x1="8" x2="16" y1="21" y2="21" />
                              <line x1="12" x2="12" y1="17" y2="21" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">MacBook Pro</p>
                            <p className="text-xs text-gray-400">Jakarta, Indonesia • Safari on macOS</p>
                          </div>
                        </div>
                        <button className="text-xs text-red-500 hover:text-red-400 transition-colors">Logout</button>
                      </div>
                    </div>

                    <button className="mt-4 bg-red-500/20 hover:bg-red-500/30 text-red-500 px-4 py-2 rounded-lg transition-colors">
                      Logout of All Devices
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
