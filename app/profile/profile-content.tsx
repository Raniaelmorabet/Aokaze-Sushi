"use client";

import { useEffect, useState, useRef } from "react";
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
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import logo from "@/public/logo.png";
import { API_BASE_URL, authAPI, orderAPI, reservationAPI } from "@/utils/api";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { AlertDialogHeader } from "@/components/ui/alert-dialog";
import useLocalStorage from "@/hooks/use-local-storage";

export default function ProfileContent() {
  // Safety check to prevent server-side rendering
  if (typeof window === 'undefined') {
    return null;
  }

  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("orders");
  const [getorders, setGetOrders] = useState([]);
  const [getuser, setGetUser] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState();
  const [alertStatus, setAlertStatus] = useState({});
  const [isExiting, setIsExiting] = useState(false);
  const [formDataForPassword, setFormDataForPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  // Add your existing functions and component rendering code here
  // The content should be identical to the previous profile page.tsx file
  
  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Your existing UI code from the profile page */}
      <h1>Profile Content</h1>
      {/* This is a placeholder - in your real implementation, copy the entire UI from the original profile page */}
    </div>
  );
} 