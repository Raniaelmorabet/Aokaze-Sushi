"use client";

import { unstable_noStore as noStore } from 'next/cache';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  CreditCard,
  MapPin,
  Truck,
  Check,
  Shield,
  Clock,
  AlertCircle,
  Lock,
  LogIn,
  User,
  X,
} from "lucide-react";
import logo from "@/public/logo.png";
import { API_BASE_URL } from "@/utils/api";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/hooks/use-local-storage";

// This forces dynamic rendering and prevents static generation
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

export default function Checkout() {
  // Prevent static generation for this route
  noStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Shipping info
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Indonesia",
    },
    deliveryInstructions: "",
    // Payment info
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    savePaymentInfo: false,
    paymentMethod: "credit_card",
    deliveryType: "delivery",
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [resData, setResData] = useState();
  const [errors, setErrors] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("login");
  const token = useLocalStorage("token");
  const validateStep1 = () => {
    const newErrors = {};
    let isValid = true;

    // Street validation
    if (!formData.deliveryAddress.street.trim()) {
      newErrors.street = "Street address is required";
      isValid = false;
    }

    // City validation
    if (!formData.deliveryAddress.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    // State validation
    if (!formData.deliveryAddress.state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }

    // Country validation
    if (!formData.deliveryAddress.country) {
      newErrors.country = "Please select a country";
      isValid = false;
    }

    // Zip Code validation
    if (!formData.deliveryAddress.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
      isValid = false;
    } else if (!/^\d+$/.test(formData.deliveryAddress.zipCode)) {
      newErrors.zipCode = "Zip code must contain only numbers";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Check if the field is part of deliveryAddress
    if (name in formData.deliveryAddress) {
      setFormData({
        ...formData,
        deliveryAddress: {
          ...formData.deliveryAddress,
          [name]: type === "checkbox" ? checked : value,
        },
      });
    } else {
      // Handle top-level fields
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const nextStep = () => {
    setStep(step + 1);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
    console.log("stepone", formData);
  };

  const prevStep = () => {
    setStep(step - 1);
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
    }
  };

  const placeOrder = async () => {
    setLoading(true);
    setError("");

    try {
      // Prepare order data from your form/state
      const orderData = {
        paymentMethod: "credit_card",
        deliveryType: "delivery",
        deliveryAddress: formData.deliveryAddress,
        deliveryInstructions: formData.deliveryInstructions,
      };
      console.log("orderData", orderData);

      // Call the API to place the order
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      const responseData = await response.json();
      console.log("Order response:", responseData.data);
      setResData(responseData.data);
      if (response.ok) {
        setOrderPlaced(true);
        setStep(3);
        // You might want to store the order details in state
        // setOrderDetails(response.data);
      } else {
        // Handle API validation errors
        if (response.errors) {
          const errorMessages = response.errors
            .map((err) => err.msg)
            .join(", ");
          setError(errorMessages);
        } else {
          setError(
            response.message || "There was an error processing your order."
          );
        }
      }
    } catch (err) {
      console.error("Order error:", err);
      setError("There was an error processing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateShipping = () => {
    return 5.0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!token);

    if (!token) {
      setShowLoginModal(true);
    }
  }, []);

  const LoginModal = () => (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="bg-[#1E1E1E] border-gray-800 text-white sm:max-w-md">
        <DialogHeader className="relative">
          <div className="flex justify-center mb-2">
            <div className="bg-orange-500/20 p-3 rounded-full">
              <Lock className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-center">
            Account Access
          </DialogTitle>
          <DialogDescription className="text-orange-500 text-center">
            Sign in to complete your checkout and track your orders
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 bg-gray-800">
            <TabsTrigger
              value="login"
              className={`${
                activeTab === "login" ? "!bg-white !text-black" : ""
              }`}
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className={`${
                activeTab === "signup" ? "!bg-white !text-black" : ""
              }`}
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 pt-4">
            <div className="grid gap-4">
              <div className="relative my-6">
                <Separator className="absolute inset-0 top-1/2 -translate-y-1/2 w-full border-t-[1px] border-white z-0" />
                <div className="relative z-10 flex justify-center text-xs">
                  <span className="bg-[#1E1E1E] px-2 text-gray-400">
                    or continue with email
                  </span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-300">
              <p className="flex items-center mb-2">
                <LogIn className="mr-2 h-4 w-4 text-orange-500" />
                Logging in provides:
              </p>
              <ul className="list-disc pl-10 space-y-1 text-gray-400">
                <li>Order tracking and history</li>
                <li>Faster checkout experience</li>
                <li>Personalized recommendations</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="signup" className="pt-4">
            <div className="grid gap-4">
              <div className="relative my-6">
                <Separator className="absolute inset-0 top-1/2 -translate-y-1/2 w-full border-t-[1px] border-white z-0" />
                <div className="relative z-10 flex justify-center text-xs">
                  <span className="bg-[#1E1E1E] px-2 text-gray-400">
                    or continue with email
                  </span>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-300 mb-4">
              <p className="flex items-center mb-2">
                <User className="mr-2 h-4 w-4 text-orange-500" />
                Create an account to:
              </p>
              <ul className="list-disc pl-10 space-y-1 text-gray-400">
                <li>Save your shipping information</li>
                <li>Track orders and view history</li>
                <li>Receive exclusive offers</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            className="w-full sm:w-auto bg-transparent border-gray-700 hover:bg-gray-800 text-white group"
            onClick={() => {
              router.push("/#?redirect=checkout");
              setShowLoginModal(false);
            }}
          >
            Continue as Guest
            <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition" />
          </Button>
          <Button
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => {
              router.push(
                `${
                  activeTab === "login" ? "/auth/login" : "/auth/register"
                }?redirect=checkout`
              );
              setShowLoginModal(false);
            }}
          >
            {activeTab === "login" ? "Login" : "Sign Up"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="bg-[#1a1a1a] py-4 shadow-md">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo || "/placeholder.svg"}
              alt={logo}
              className="w-24"
            ></Image>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              <span>Back to Shopping</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Progress Steps */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 1
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                <MapPin size={20} />
              </div>
              <span
                className={`mt-2 text-sm ${
                  step >= 1 ? "text-white" : "text-gray-400"
                }`}
              >
                Shipping
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <div
                className={`h-1 w-full ${
                  step >= 2 ? "bg-orange-500" : "bg-gray-700"
                }`}
              ></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 2
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                <CreditCard size={20} />
              </div>
              <span
                className={`mt-2 text-sm ${
                  step >= 2 ? "text-white" : "text-gray-400"
                }`}
              >
                Payment
              </span>
            </div>
            <div className="flex-1 flex items-center">
              <div
                className={`h-1 w-full ${
                  step >= 3 ? "bg-orange-500" : "bg-gray-700"
                }`}
              ></div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= 3
                    ? "bg-orange-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}
              >
                <Check size={20} />
              </div>
              <span
                className={`mt-2 text-sm ${
                  step >= 3 ? "text-white" : "text-gray-400"
                }`}
              >
                Confirmation
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Shipping */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6">
                  Shipping Information
                </h2>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (validateStep1()) {
                      nextStep();
                    }
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Street
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.deliveryAddress.street}
                        onChange={handleChange}
                        className={`w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                          errors.street
                            ? "focus:ring-red-500 border-red-500"
                            : "focus:ring-orange-500"
                        }`}
                        required
                      />
                      {errors.street && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.street}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.deliveryAddress.city}
                      onChange={handleChange}
                      className={`w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                        errors.city
                          ? "focus:ring-red-500 border-red-500"
                          : "focus:ring-orange-500"
                      }`}
                      required
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.deliveryAddress.state}
                      onChange={handleChange}
                      className={`w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                        errors.state
                          ? "focus:ring-red-500 border-red-500"
                          : "focus:ring-orange-500"
                      }`}
                      required
                    />
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-1">
                      Delivery Instructions
                    </label>
                    <input
                      type="text"
                      name="deliveryInstructions"
                      value={formData.deliveryAddress.deliveryInstructions}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">
                        Country
                      </label>
                      <select
                        name="country"
                        value={formData.deliveryAddress.country}
                        onChange={handleChange}
                        className={`w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                          errors.country
                            ? "focus:ring-red-500 border-red-500"
                            : "focus:ring-orange-500"
                        } appearance-none`}
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Japan">Japan</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Thailand">Thailand</option>
                      </select>
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.country}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        Zip Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.deliveryAddress.zipCode}
                        onChange={handleChange}
                        className={`w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 ${
                          errors.zipCode
                            ? "focus:ring-red-500 border-red-500"
                            : "focus:ring-orange-500"
                        }`}
                        required
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
            {/* Payment */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl"
              >
                <h2 className="text-2xl font-bold mb-6">Payment Information</h2>

                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-1">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    name="cardName"
                    value={formData.cardName}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-1">
                    Card Number
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    placeholder="XXXX XXXX XXXX XXXX"
                    className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      CVV
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleChange}
                      placeholder="123"
                      className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="savePaymentInfo"
                      checked={formData.savePaymentInfo}
                      onChange={handleChange}
                      className="w-4 h-4 accent-orange-500"
                    />
                    <span className="text-gray-300">
                      Save payment information for future orders
                    </span>
                  </label>
                </div>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Shield size={20} />
                    <span className="text-sm">
                      Your payment information is secure and encrypted
                    </span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={prevStep}
                      className="bg-[#2a2a2a] hover:bg-[#333] text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={placeOrder}
                      disabled={loading}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 bg-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}
              </motion.div>
            )}
            {/* Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl text-center"
              >
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
                  <Check size={40} />
                </div>

                <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Thank you for your order. We've sent a confirmation to your
                  email. Your order will be prepared shortly.
                </p>

                <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8 max-w-md mx-auto">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Order Number:</span>
                    <span className="font-medium">
                      {resData.orderNumber || "123456789"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Date:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Total:</span>
                    <span className="font-medium">${resData.totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Estimated Delivery:</span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      30-45 minutes
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Link
                    href="/"
                    className="bg-[#2a2a2a] hover:bg-[#333] text-white px-8 py-3 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </Link>
                  <Link
                    href="/profile"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors"
                  >
                    Track Order
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl sticky top-8">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id + JSON.stringify(item.selectedOptions)}
                    className="flex gap-3"
                  >
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
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-400">
                        Qty: {item.quantity}
                      </p>
                      {item.selectedOptions &&
                        Object.entries(item.selectedOptions).length > 0 && (
                          <div className="mb-2">
                            {Object.entries(item.selectedOptions).map(
                              ([category, options]) => (
                                <div
                                  key={category}
                                  className="text-xs text-gray-400"
                                >
                                  <span className="font-medium">
                                    {category}:
                                  </span>{" "}
                                  {Array.isArray(options)
                                    ? options.join(", ")
                                    : options}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      <p className="text-orange-500">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Tax (10%)</span>
                  <span>${calculateTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Shipping</span>
                  <span>${calculateShipping().toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 mb-6">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <Truck size={18} />
                <span className="text-sm">
                  Free delivery for orders over $50
                </span>
              </div>

              {step < 3 && (
                <div className="text-center text-sm text-gray-400">
                  {step === 1
                    ? "Proceed to payment after filling shipping details"
                    : "Review your order before placing it"}
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Login Modal */}
        <LoginModal />
      </div>
    </div>
  );
}
