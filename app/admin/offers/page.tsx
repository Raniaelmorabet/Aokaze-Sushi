"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Tag,
  Calendar,
  Percent,
  Filter,
  SortAsc,
  SortDesc,
  Upload,
  AlertCircle,
  CheckCircle2,
  TicketPercent,
  ShoppingBag,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { format, set } from "date-fns";
import { API_BASE_URL, categoryAPI, menuAPI, offersAPI } from "@/utils/api";
import Loading from "./loading";

// Sample data for offers
const SAMPLE_OFFERS = [
  {
    id: "1",
    title: "Summer Special",
    description:
      "Enjoy 20% off on all summer menu items. Perfect for hot days!",
    couponCode: "SUMMER20",
    discountPercentage: 20,
    validFrom: new Date("2023-06-01"),
    validUntil: new Date("2023-08-31"),
    minOrderAmount: 25,
    maxDiscountAmount: 50,
    applicableCategories: ["Sushi", "Drinks"],
    applicableMenuItems: [],
    isActive: true,
    usageLimit: 100,
    currentUsage: 45,
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=3540&auto=format&fit=crop",
    createdAt: new Date("2023-05-15"),
  },
  {
    id: "2",
    title: "Weekend Feast",
    description:
      "Get 15% off on family platters every weekend. Minimum order $50.",
    couponCode: "WEEKEND15",
    discountPercentage: 15,
    validFrom: new Date("2023-07-01"),
    validUntil: new Date("2023-12-31"),
    minOrderAmount: 50,
    maxDiscountAmount: 75,
    applicableCategories: ["Platters", "Combos"],
    applicableMenuItems: [],
    isActive: true,
    usageLimit: 200,
    currentUsage: 87,
    image:
      "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=3542&auto=format&fit=crop",
    createdAt: new Date("2023-06-20"),
  },
  {
    id: "3",
    title: "First Order Discount",
    description:
      "New customers get 25% off on their first order. Maximum discount $30.",
    couponCode: "FIRST25",
    discountPercentage: 25,
    validFrom: new Date("2023-01-01"),
    validUntil: new Date("2023-12-31"),
    minOrderAmount: 20,
    maxDiscountAmount: 30,
    applicableCategories: ["All"],
    applicableMenuItems: [],
    isActive: true,
    usageLimit: 500,
    currentUsage: 342,
    image:
      "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=3329&auto=format&fit=crop",
    createdAt: new Date("2023-01-01"),
  },
  {
    id: "4",
    title: "Happy Hour Special",
    description:
      "10% off on all drinks between 4PM and 7PM. Valid on weekdays only.",
    couponCode: "HAPPY10",
    discountPercentage: 10,
    validFrom: new Date("2023-05-01"),
    validUntil: new Date("2023-10-31"),
    minOrderAmount: 15,
    maxDiscountAmount: 20,
    applicableCategories: ["Drinks", "Beverages"],
    applicableMenuItems: [],
    isActive: false,
    usageLimit: 300,
    currentUsage: 178,
    image:
      "https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=3425&auto=format&fit=crop",
    createdAt: new Date("2023-04-15"),
  },
];

// Sample categories for dropdown
const SAMPLE_CATEGORIES = [
  "Sushi",
  "Sashimi",
  "Drinks",
  "Beverages",
  "Platters",
  "Combos",
  "Appetizers",
  "Desserts",
  "Specials",
  "All",
];

const AnimatedCounter = ({ value, prefix = "", suffix = "", dur }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = dur || 2000;
    const start = 0;
    const end = value;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);

      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};


export default function OffersManagement() {
  const { toast } = useToast();
  const [offers, setOffers] = useState(SAMPLE_OFFERS);
  const [showOffers, setShowOffers] = useState([]);
  const [activeOffer, setActiveOffer] = useState("basic");
  const [filteredOffers, setFilteredOffers] = useState(showOffers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortField, setSortField] = useState("title");
  const [alertStatus, setAlertStatus] = useState({});
  const [isExiting, setIsExiting] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all"); // all, active, inactive
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    couponCode: "",
    discountPercentage: 10,
    validFrom: new Date(),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    minOrderAmount: 0,
    maxDiscountAmount: null,
    applicableCategories: [],
    applicableMenuItems: [],
    isActive: true,
    usageLimit: null,
    currentUsage: 0,
    image: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState();
  const [categories, setCategories] = useState();
  const fileInputRef = useRef(null);
  // Add a new state for the confirmation dialog
  const [isStatusConfirmOpen, setIsStatusConfirmOpen] = useState(false);
  const [offerToToggle, setOfferToToggle] = useState(null);
  // Add a new state to track the recently toggled offer for animation
  const [recentlyToggledOfferId, setRecentlyToggledOfferId] = useState(null);

  // Clear the recently toggled offer ID after animation completes
  useEffect(() => {
    if (recentlyToggledOfferId) {
      const timer = setTimeout(() => {
        setRecentlyToggledOfferId(null);
      }, 2000); // Animation duration + a little extra
      return () => clearTimeout(timer);
    }
  }, [recentlyToggledOfferId]);

  // Validation function
  const validateOffer = (offer) => {
    const newErrors = {};

    if (!offer.title || !offer.title.trim()) {
      newErrors.title = "Title is required";
    } else if (offer.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
    }

    if (!offer.description || !offer.description.trim()) {
      newErrors.description = "Description is required";
    } else if (offer.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (!offer.couponCode || !offer.couponCode.trim()) {
      newErrors.couponCode = "Coupon code is required";
    } else if (offer.couponCode.length > 20) {
      newErrors.couponCode = "Coupon code cannot exceed 20 characters";
    }

    if (offer.discountPercentage < 1) {
      newErrors.discountPercentage = "Discount percentage must be at least 1%";
    } else if (offer.discountPercentage > 100) {
      newErrors.discountPercentage = "Discount percentage cannot exceed 100%";
    }

    if (!offer.validFrom) {
      newErrors.validFrom = "Start date is required";
    }

    if (!offer.validUntil) {
      newErrors.validUntil = "End date is required";
    } else if (offer.validUntil <= offer.validFrom) {
      newErrors.validUntil = "End date must be after start date";
    }

    if (offer.minOrderAmount < 0) {
      newErrors.minOrderAmount = "Minimum order amount cannot be negative";
    }

    if (offer.maxDiscountAmount !== null && offer.maxDiscountAmount < 0) {
      newErrors.maxDiscountAmount =
        "Maximum discount amount cannot be negative";
    }

    if (offer.usageLimit !== null && offer.usageLimit < 0) {
      newErrors.usageLimit = "Usage limit cannot be negative";
    }

    return newErrors;
  };

  // Filter offers based on search query and status filter
  useEffect(() => {
    let filtered = showOffers.filter(
      (offer) =>
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.couponCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (statusFilter !== "all") {
      filtered = filtered.filter((offer) =>
        statusFilter === "active" ? offer.isActive : !offer.isActive
      );
    }

    // Sort the filtered offers
    const sorted = [...filtered].sort((a, b) => {
      if (sortField === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortField === "createdAt") {
        return sortOrder === "asc"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortField === "discountPercentage") {
        return sortOrder === "asc"
          ? a.discountPercentage - b.discountPercentage
          : b.discountPercentage - a.discountPercentage;
      }
      return 0;
    });

    setFilteredOffers(sorted);
  }, [showOffers, searchQuery, sortOrder, sortField, statusFilter]);

  // Validate form on change to provide real-time feedback
  useEffect(() => {
    if (isAddModalOpen) {
      setErrors(validateOffer(newOffer));
    }
  }, [newOffer, isAddModalOpen]);

  // Validate update form on change
  useEffect(() => {
    if (isUpdateModalOpen && selectedOffer) {
      setErrors(validateOffer(selectedOffer));
    }
  }, [selectedOffer, isUpdateModalOpen]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        image: "Only JPG, PNG, or WEBP images are allowed",
      });
      return;
    }

    if (file.size > maxSize) {
      setErrors({ ...errors, image: "Image size must be less than 2MB" });
      return;
    }

    setImageFile(file);
    setIsUploading(true);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setNewOffer({
        ...newOffer,
        image: e.target.result,
      });
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
      setErrors({ ...errors, image: "Failed to read image file" });
    };
    reader.readAsDataURL(file);
  };

  // Handle adding a new offer
  const handleAddOffer = async () => {
    if (!newOffer.title.trim()) {
      setAlertStatus({
        type: false,
        message: "Offer title is required",
      });
      return;
    }
    if (!newOffer.description.trim()) {
      setAlertStatus({
        type: false,
        message: "Offer description is required",
      });
      return;
    }
    if (!newOffer.couponCode.trim()) {
      setAlertStatus({
        type: false,
        message: "Coupon code is required",
      });
      return;
    }
    const isTitleExists = showOffers.some(
        offer => offer.title.toLowerCase() === newOffer.title.trim().toLowerCase()
    );
    const isCouponExists = showOffers.some(
        offer => offer.couponCode.toLowerCase() === newOffer.couponCode.trim().toLowerCase()
    );
    if (isTitleExists) {
      setAlertStatus({
          type: false,
          message: "An offer with this title already exists",
      });
      return;
    }
    if (isCouponExists) {
      setAlertStatus({
          type: false,
          message: "An offer with this coupon code already exists",
      });
      return;
    }
    if (newOffer.discountPercentage < 1) {
      setAlertStatus({
        type: false,
        message: "Discount percentage must be at least 1%",
      });
      return;
    }
    if (newOffer.discountPercentage > 100) {
      setAlertStatus({
        type: false,
        message: "Discount percentage cannot exceed 100%",
      });
      return;
    }
    if (!newOffer.validFrom) {
      setAlertStatus({
        type: false,
        message: "Start date is required",
      });
      return;
    }
    if (!newOffer.validUntil) {
      setAlertStatus({
        type: false,
        message: "End date is required",
      });
      return;
    }
    if (newOffer.validUntil <= newOffer.validFrom) {
      setAlertStatus({
        type: false,
        message: "End date must be after start date",
      });
      return;
    }
    if (newOffer.minOrderAmount < 0) {
      setAlertStatus({
        type: false,
        message: "Minimum order amount cannot be negative",
      });
      return;
    }
    if (newOffer.maxDiscountAmount !== null && newOffer.maxDiscountAmount < 0) {
      setAlertStatus({
        type: false,
        message: "Maximum discount amount cannot be negative",
      });
      return;
    }
    if (newOffer.usageLimit !== null && newOffer.usageLimit < 0) {
      setAlertStatus({
        type: false,
        message: "Usage limit cannot be negative",
      });
      return;
    }
    if (!newOffer.image) {
      setAlertStatus({
        type: false,
        message: "Image is required",
      });
      return;
    }

    try {
      const offerToAdd = {
        ...newOffer,
        couponCode: newOffer.couponCode.toUpperCase(),
      };
      

      const formData = new FormData();

      // Append all offer fields to formData
      formData.append("title", offerToAdd.title);
      formData.append("description", offerToAdd.description);
      formData.append("couponCode", offerToAdd.couponCode);
      formData.append(
        "discountPercentage",
        offerToAdd.discountPercentage.toString()
      );
      formData.append("validFrom", offerToAdd.validFrom.toISOString());
      formData.append("validUntil", offerToAdd.validUntil.toISOString());
      formData.append("minOrderAmount", offerToAdd.minOrderAmount.toString());

      if (offerToAdd.maxDiscountAmount !== null) {
        formData.append(
          "maxDiscountAmount",
          offerToAdd.maxDiscountAmount.toString()
        );
      }

      // For applicableCategories (array of IDs)
      formData.append(
        "applicableCategories", 
        JSON.stringify(offerToAdd.applicableCategories.map(cat => cat._id || cat))
      );

      // For applicableMenuItems (array of objects, but we only need IDs)
      formData.append(
        "applicableMenuItems",
        JSON.stringify(offerToAdd.applicableMenuItems.map(item => item._id || item))
      );

      formData.append("isActive", offerToAdd.isActive.toString());
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        formData.append("image", offerToAdd.image);
      }

      if (offerToAdd.usageLimit !== null) {
        formData.append("usageLimit", offerToAdd.usageLimit.toString());
      }

      for (const [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Use formData with the API call
      const res = await offersAPI.createOffer(formData);
      console.log(res);

      if (res.success) {
        setShowOffers([...showOffers, res.data]);
        setIsAddModalOpen(false);
        setNewOffer({
          title: "",
          description: "",
          couponCode: "",
          discountPercentage: 10,
          validFrom: new Date(),
          validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          minOrderAmount: 0,
          maxDiscountAmount: null,
          applicableCategories: [],
          applicableMenuItems: [],
          isActive: true,
          usageLimit: null,
          currentUsage: 0,
          image: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error adding offer:", error);
    }
  };

  // Handle updating an offer
  const handleUpdateOffer = async () => {
    // Validation checks
    if (!selectedOffer.title.trim()) {
        setAlertStatus({
            type: false,
            message: "Offer title is required",
        });
        return;
    }
    if (!selectedOffer.couponCode.trim()) {
        setAlertStatus({
            type: false,
            message: "Coupon code is required",
        });
        return;
    }

    // Check for unique title (excluding current offer)
    const isTitleExists = showOffers.some(
        offer => 
            offer._id !== selectedOffer._id &&
            offer.title.toLowerCase() === selectedOffer.title.trim().toLowerCase()
    );
    
    if (isTitleExists) {
        setAlertStatus({
            type: false,
            message: "An offer with this title already exists",
        });
        return;
    }

    // Check for unique coupon code (excluding current offer)
    const isCouponExists = showOffers.some(
        offer => 
            offer._id !== selectedOffer._id &&
            offer.couponCode.toLowerCase() === selectedOffer.couponCode.trim().toLowerCase()
    );

    if (isCouponExists) {
        setAlertStatus({
            type: false,
            message: "An offer with this coupon code already exists",
        });
        return;
    }

    // Convert dates to Date objects if they aren't already
    const validFrom = selectedOffer.validFrom instanceof Date 
        ? selectedOffer.validFrom 
        : new Date(selectedOffer.validFrom);
    const validUntil = selectedOffer.validUntil instanceof Date 
        ? selectedOffer.validUntil 
        : new Date(selectedOffer.validUntil);

    if (!validFrom || isNaN(validFrom.getTime())) {
        setAlertStatus({
            type: false,
            message: "Invalid start date",
        });
        return;
    }
    if (!validUntil || isNaN(validUntil.getTime())) {
        setAlertStatus({
            type: false,
            message: "Invalid end date",
        });
        return;
    }
    if (validUntil <= validFrom) {
        setAlertStatus({
            type: false,
            message: "End date must be after start date",
        });
        return;
    }

    if (!selectedOffer.description.trim()) {
        setAlertStatus({
            type: false,
            message: "Offer description is required",
        });
        return;
    }
    if (selectedOffer.discountPercentage < 1) {
        setAlertStatus({
            type: false,
            message: "Discount percentage must be at least 1%",
        });
        return;
    }
    if (selectedOffer.discountPercentage > 100) {
        setAlertStatus({
            type: false,
            message: "Discount percentage cannot exceed 100%",
        });
        return;
    }
    if (selectedOffer.minOrderAmount < 0) {
        setAlertStatus({
            type: false,
            message: "Minimum order amount cannot be negative",
        });
        return;
    }
    if (
        selectedOffer.maxDiscountAmount !== null &&
        selectedOffer.maxDiscountAmount < 0
    ) {
        setAlertStatus({
            type: false,
            message: "Maximum discount amount cannot be negative",
        });
        return;
    }
    if (selectedOffer.usageLimit !== null && selectedOffer.usageLimit < 0) {
        setAlertStatus({
            type: false,
            message: "Usage limit cannot be negative",
        });
        return;
    }
    if (selectedOffer.applicableCategories.length === 0) {
        setAlertStatus({
            type: false,
            message: "At least one category is required",
        });
        return;
    }
    if (selectedOffer.applicableMenuItems.length === 0) {
        setAlertStatus({
            type: false,
            message: "At least one menu item is required",
        });
        return;
    }

    try {
        const offerToUpdate = {
            ...selectedOffer,
            couponCode: selectedOffer.couponCode.toUpperCase(),
            validFrom,
            validUntil
        };

        const formData = new FormData();

        // Append all offer fields to formData
        formData.append("title", offerToUpdate.title);
        formData.append("description", offerToUpdate.description);
        formData.append("couponCode", offerToUpdate.couponCode);
        formData.append(
            "discountPercentage",
            offerToUpdate.discountPercentage.toString()
        );
        formData.append("validFrom", offerToUpdate.validFrom.toISOString());
        formData.append("validUntil", offerToUpdate.validUntil.toISOString());
        formData.append(
            "minOrderAmount",
            offerToUpdate.minOrderAmount.toString()
        );

        if (offerToUpdate.maxDiscountAmount !== null && offerToUpdate.maxDiscountAmount !== undefined) {
          formData.append("maxDiscountAmount", offerToUpdate.maxDiscountAmount.toString())
        } else {
          formData.append("maxDiscountAmount", "1")
        }

        formData.append(
            "applicableCategories",
            JSON.stringify(offerToUpdate.applicableCategories)
        );
        formData.append(
            "applicableMenuItems",
            JSON.stringify(offerToUpdate.applicableMenuItems)
        );
        formData.append("isActive", offerToUpdate.isActive.toString());

        // Handle image upload
        if (imageFile) {
            formData.append("image", imageFile);
        } else if (offerToUpdate.image) {
            formData.append("image", offerToUpdate.image);
        }

        if (offerToUpdate.usageLimit !== null) {
            formData.append("usageLimit", offerToUpdate.usageLimit);
        }
        for (const [key, value] of formData.entries()) {
          console.log(key, value);
        }

        // API call
        const res = await offersAPI.updateOffer(selectedOffer._id, formData);
        console.log(res);
        
        if (res.success) {
            // Update offers list
            setShowOffers(
                showOffers.map((offer) =>
                    offer._id === res.data._id ? res.data : offer
                )
            );

            // Reset state
            setIsUpdateModalOpen(false);
            setSelectedOffer(null);
            setImageFile(null);
            setErrors({});
            setAlertStatus({
              type: true,
              message: "Offer Updated Successfully",
          });
        }
    } catch (error) {
        console.error("Error updating offer:", error);
        setAlertStatus({
            type: false,
            message: error || "Failed to update offer. Please try again.",
        });
    }
};

  // Handle deleting an offer
  const handleDeleteOffer = async () => {
    try {
      const res = await offersAPI.deleteOffer(selectedOffer._id);
      if (res.success) {
        const updatedOffers = showOffers.filter(
          (offer) => offer._id !== selectedOffer._id
        );

        setShowOffers(updatedOffers);
        setIsDeleteModalOpen(false);
        setSelectedOffer(null);
      }
    } catch (error) {
      console.error("Error deleting offer:", error);
    }
  };

  // Modify the handleToggleStatus function to actually toggle the status and set the animation state
  const handleToggleStatus = async (offer) => {
    try {
      const res = await offersAPI.toggleOfferStatus(offer._id, !offer.isActive);
      if (res.success) {
        const updatedOffers = showOffers.map((o) =>
          o._id === offer._id ? { ...o, isActive: !o.isActive } : o
        );

        setShowOffers(updatedOffers);
        setRecentlyToggledOfferId(offer._id);
      }
    } catch (error) {
      console.error("Error toggling offer status:", error);
    }
  };

  // Handle adding a category
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
  
    // Find the full category object from categories list
    const categoryToAdd = categories.find((cat) => cat._id === newCategory);
    
    if (categoryToAdd) {
      if (isUpdateModalOpen && selectedOffer) {
        if (!selectedOffer.applicableCategories.some(cat => cat._id === categoryToAdd._id)) {
          setSelectedOffer({
            ...selectedOffer,
            applicableCategories: [...selectedOffer.applicableCategories, categoryToAdd],
          });
        }
      } else {
        if (!newOffer.applicableCategories.some(cat => cat._id === categoryToAdd._id)) {
          setNewOffer({
            ...newOffer,
            applicableCategories: [...newOffer.applicableCategories, categoryToAdd],
          });
        }
      }
    }
    
    setNewCategory("");
  };

  // Handle removing a category
  const handleRemoveCategory = (category) => {
    if (isUpdateModalOpen && selectedOffer) {
      setSelectedOffer({
        ...selectedOffer,
        applicableCategories: selectedOffer.applicableCategories.filter(
          (c) => c !== category
        ),
      });
    } else {
      setNewOffer({
        ...newOffer,
        applicableCategories: newOffer.applicableCategories.filter(
          (c) => c !== category
        ),
      });
    }
  };

  // Handle adding a menu item
  const handleAddMenuItem = () => {
    if (!selectedMenuItem) return;

    const menuItem = menu.find(
      (item) => item._id === selectedMenuItem
    );
    if (!menuItem) return;

    if (isUpdateModalOpen && selectedOffer) {
      if (
        !selectedOffer.applicableMenuItems.some(
          (item) => item._id === menuItem._id
        )
      ) {
        setSelectedOffer({
          ...selectedOffer,
          applicableMenuItems: [...selectedOffer.applicableMenuItems, menuItem],
        });
      }
    } else {
      if (
        !newOffer.applicableMenuItems.some((item) => item._id === menuItem._id)
      ) {
        setNewOffer({
          ...newOffer,
          applicableMenuItems: [...newOffer.applicableMenuItems, menuItem],
        });
      }
    }

    setSelectedMenuItem("");
  };

  // Handle removing a menu item
  const handleRemoveMenuItem = (itemId) => {
    if (isUpdateModalOpen && selectedOffer) {
      setSelectedOffer({
        ...selectedOffer,
        applicableMenuItems: selectedOffer.applicableMenuItems.filter(
          (item) => item._id !== itemId
        ),
      });
    } else {
      setNewOffer({
        ...newOffer,
        applicableMenuItems: newOffer.applicableMenuItems.filter(
          (item) => item._id !== itemId
        ),
      });
    }
  };

  // Reset form when closing modals
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setNewOffer({
      title: "",
      description: "",
      couponCode: "",
      discountPercentage: 10,
      validFrom: new Date(),
      validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      minOrderAmount: 0,
      maxDiscountAmount: null,
      applicableCategories: [],
      applicableMenuItems: [],
      isActive: true,
      usageLimit: null,
      currentUsage: 0,
      image: "",
    });
    setErrors({});
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedOffer(null);
    setErrors({});
  };

  // Format date for display
  const formatDate = (date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  // Calculate usage percentage
  const calculateUsagePercentage = (current, limit) => {
    if (!limit) return 0;
    return Math.min(Math.round((current / limit) * 100), 100);
  };

  // Calculate days remaining
  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Add a new function to open the confirmation dialog
  const openStatusConfirmation = (offer) => {
    setOfferToToggle(offer);
    setIsStatusConfirmOpen(true);
  };

  const getOffers = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/offers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data.data);
      const normalizedOffers = data.data.map(offer => ({
        ...offer,
        applicableCategories: offer.applicableCategories || [],
        applicableMenuItems: offer.applicableMenuItems || []
      }));
  
      setShowOffers(normalizedOffers);
      setFilteredOffers(normalizedOffers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMenuItems = async () => {
    setLoading(true);
    try {
      const data = await menuAPI.getItems({
        page: 1,
        limit: 10,
        available: true,
      });
      setMenu(data.data);
      console.log(data.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryAPI.getPaginatedCategories({
        page: 1,
        limit: 10,
        active: true,
      });
      setCategories(data.data);
      console.log(data.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOffers();
    getMenuItems();
    getCategories();
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 bg-[#121212] text-white min-h-screen">
      {/*Header */}
      <div className="p-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Special Offers
            </h1>
            <p className="text-gray-400">
              Manage discounts and promotional offers
            </p>
          </div>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white shadow-lg transition-all duration-300 hover:shadow-orange-900/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Offer
          </Button>
        </div>
      </div>

      {successMessage && (
        <Alert className="bg-green-900/20 border-green-500 text-green-300 mb-4 mx-6 animate-fadeIn">
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-6">
        <motion.div
          className="bg-gradient-to-br from-[#1A1A1A] to-[#252525] p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{
            y: -5,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <h3 className="font-medium mb-2 flex items-center text-gray-300">
            <Tag className="mr-2 h-5 w-5 text-orange-500" />
            Total Offers
          </h3>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            <AnimatedCounter value={showOffers.length} dur={1000} />
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#1A1A1A] to-[#252525] p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          whileHover={{
            y: -5,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <h3 className="font-medium mb-2 flex items-center text-gray-300">
            <Eye className="mr-2 h-5 w-5 text-green-500" />
            Active Offers
          </h3>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            <AnimatedCounter value={showOffers.filter((offer) => offer.isActive).length} dur={1000} />
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#1A1A1A] to-[#252525] p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{
            y: -5,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <h3 className="font-medium mb-2 flex items-center text-gray-300">
            <Percent className="mr-2 h-5 w-5 text-blue-500" />
            Avg. Discount
          </h3>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            <AnimatedCounter value={Math.round(
              showOffers.reduce(
                (sum, offer) => sum + offer.discountPercentage,
                0
              ) / showOffers.length
            )} dur={1000} />
            %
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-[#1A1A1A] to-[#252525] p-6 rounded-lg shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{
            y: -5,
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          }}
        >
          <h3 className="font-medium mb-2 flex items-center text-gray-300">
            <ShoppingBag className="mr-2 h-5 w-5 text-purple-500" />
            Total Redemptions
          </h3>
          <p className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            <AnimatedCounter value={showOffers.reduce((sum, offer) => sum + offer.currentUsage, 0)} dur={1000} />
          </p>
        </motion.div>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-[#1A1A1A] to-[#252525] rounded-lg p-6 mx-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search offers by title, description, or code..."
              className="pl-10 bg-[#252525] border-[#333] text-white focus:ring-2 focus:ring-orange-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              className={`border-[#333] transition-all ${
                statusFilter === "all"
                  ? "bg-[#333] text-white"
                  : "text-gray-300 hover:bg-[#252525]"
              }`}
              onClick={() => setStatusFilter("all")}
            >
              All Offers
            </Button>
            <Button
              variant="outline"
              className={`border-[#333] transition-all ${
                statusFilter === "active"
                  ? "bg-[#333] text-white"
                  : "text-gray-300 hover:bg-[#252525]"
              }`}
              onClick={() => setStatusFilter("active")}
            >
              <Eye className="h-4 w-4 mr-2" />
              Active
            </Button>
            <Button
              variant="outline"
              className={`border-[#333] transition-all ${
                statusFilter === "inactive"
                  ? "bg-[#333] text-white"
                  : "text-gray-300 hover:bg-[#252525]"
              }`}
              onClick={() => setStatusFilter("inactive")}
            >
              <EyeOff className="h-4 w-4 mr-2" />
              Inactive
            </Button>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            className="border-[#333] text-gray-300 hover:bg-[#252525] hover:text-white transition-all"
            onClick={() => {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }}
          >
            {sortOrder === "asc" ? (
              <SortAsc className="h-4 w-4 mr-2" />
            ) : (
              <SortDesc className="h-4 w-4 mr-2" />
            )}
            {sortField === "title"
              ? "Title"
              : sortField === "discountPercentage"
              ? "Discount"
              : "Date"}
          </Button>

          <Button
            variant="outline"
            className="border-[#333] text-gray-300 hover:bg-[#252525] hover:text-white transition-all"
            onClick={() => {
              const fields = ["title", "discountPercentage", "createdAt"];
              const currentIndex = fields.indexOf(sortField);
              const nextIndex = (currentIndex + 1) % fields.length;
              setSortField(fields[nextIndex]);
            }}
          >
            <Filter className="h-4 w-4 mr-2" />
            Sort by{" "}
            {sortField === "title"
              ? "Discount"
              : sortField === "discountPercentage"
              ? "Date"
              : "Title"}
          </Button>
        </div>
      </div>

      {/* Offers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-6">
        <AnimatePresence>
          {filteredOffers.map((offer, index) => (
            <motion.div
              key={offer._id}
              className={`bg-gradient-to-br from-[#1E1E1E] to-[#252525] rounded-xl overflow-hidden shadow-lg border border-[#333] group relative ${
                recentlyToggledOfferId === offer._id ? "z-10" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                boxShadow:
                  recentlyToggledOfferId === offer._id
                    ? [
                        "0px 0px 0px rgba(0,0,0,0)",
                        "0px 0px 30px rgba(255,165,0,0.5)",
                        "0px 0px 0px rgba(0,0,0,0)",
                      ]
                    : "0px 0px 0px rgba(0,0,0,0)",
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                boxShadow: {
                  duration: 1.5,
                  repeat: 0,
                  ease: "easeInOut",
                },
              }}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            >
              {/* Success animation overlay */}
              {recentlyToggledOfferId === offer._id && (
                <motion.div
                  className={`absolute inset-0 z-20 ${
                    offer.isActive ? "bg-green-500" : "bg-red-500"
                  } rounded-xl`}
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="flex items-center justify-center h-full">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.2, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="text-white"
                    >
                      {offer.isActive ? (
                        <CheckCircle2 className="h-16 w-16" />
                      ) : (
                        <EyeOff className="h-16 w-16" />
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              )}

              <div className="relative h-48 overflow-hidden">
                <Image
                  src={offer.image || "/placeholder.svg?height=400&width=600"}
                  alt={offer.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-80"></div>

                <div className="absolute top-3 right-3">
                  <Badge
                    className={`${
                      offer.isActive ? "bg-green-600" : "bg-gray-600"
                    } text-white`}
                  >
                    {offer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold">{offer.title}</h3>
                  <div className="flex items-center mt-1">
                    <Tag className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-orange-300 font-mono">
                      {offer.couponCode}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {offer.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#1A1A1A] p-2 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1 flex items-center">
                      <Percent className="h-3 w-3 mr-1" /> Discount
                    </p>
                    <p className="text-lg font-bold">
                      {offer.discountPercentage}%
                    </p>
                  </div>

                  <div className="bg-[#1A1A1A] p-2 rounded-lg">
                    <p className="text-xs text-gray-400 mb-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" /> Expires
                    </p>
                    <p className="text-sm font-medium">
                      {formatDate(offer.validUntil)}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>
                      Usage: {offer.currentUsage}
                      {offer.usageLimit ? `/${offer.usageLimit}` : ""}
                    </span>
                    <span>
                      {offer.usageLimit
                        ? `${calculateUsagePercentage(
                            offer.currentUsage,
                            offer.usageLimit
                          )}%`
                        : "Unlimited"}
                    </span>
                  </div>
                  {offer.usageLimit && (
                    <div className="w-full bg-[#1A1A1A] rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{
                          width: `${calculateUsagePercentage(
                            offer.currentUsage,
                            offer.usageLimit
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1">Applicable to:</p>
                  <div className="flex flex-wrap gap-1">
                  {offer?.applicableCategories?.length > 0 ? (
                    offer.applicableCategories.map((category, i) => (
                      <span
                        key={i}
                        className="bg-[#2a2a2a] text-xs px-2 py-1 rounded-full border border-[#333]"
                      >
                        {category.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">
                      {offer?.applicableCategories ? "No categories selected" : "All items"}
                    </span>
                  )}
                  </div>
                </div>

                <div className="flex justify-between gap-2 mt-4 pt-4 border-t border-[#333]">
                  {/* Replace the button click handler in the offer card to use the new function */}
                  <button
                    className={`rounded-full p-2 flex items-center justify-center w-9 h-9 transition-colors ${
                      offer.isActive ? "bg-green-500" : "bg-red-500"
                    } hover:opacity-90 transform hover:scale-105 transition-all duration-200`}
                    onClick={() => openStatusConfirmation(offer)}
                    title={
                      offer.isActive ? "Deactivate offer" : "Activate offer"
                    }
                  >
                    {offer.isActive ? (
                      <Eye className="h-5 w-5 text-white" />
                    ) : (
                      <EyeOff className="h-5 w-5 text-white" />
                    )}
                    <span className="sr-only">
                      {offer.isActive ? "Deactivate" : "Activate"}
                    </span>
                  </button>

                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#333] hover:bg-[#252525] transition-colors"
                      onClick={() => {
                        setSelectedOffer(offer);
                        setIsUpdateModalOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedOffer(offer);
                        setIsDeleteModalOpen(true);
                      }}
                      className="hover:none transition-colors border-[#333]"
                    >
                      <Trash2 className="h-4 w-4 text-[#EF4444]" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredOffers.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
            <TicketPercent className="h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-medium mb-2">No offers found</h3>
            <p className="text-gray-400 mb-4">
              {searchQuery
                ? "Try a different search term"
                : "Add your first offer to get started"}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="border-[#333] hover:bg-[#252525]"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add Offer Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={handleCloseAddModal}>
        <DialogContent className="bg-[#1A1A1A] text-white border-[#333] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center">
              <TicketPercent className="mr-2 h-5 w-5 text-orange-500" />
              Add New Offer
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeOffer}
            onValueChange={setActiveOffer}
            className="mt-4"
          >
            <TabsList className="bg-[#252525]">
              <TabsTrigger
                className={`${
                  activeOffer === "basic" ? "!bg-white !text-black" : ""
                }`}
                value="basic"
              >
                Basic Info
              </TabsTrigger>
              <TabsTrigger
                className={`${
                  activeOffer === "discount" ? "!bg-white !text-black" : ""
                }`}
                value="discount"
              >
                Discount Details
              </TabsTrigger>
              <TabsTrigger
                className={`${
                  activeOffer === "applicability" ? "!bg-white !text-black" : ""
                }`}
                value="applicability"
              >
                Applicability
              </TabsTrigger>
              <TabsTrigger
                className={`${
                  activeOffer === "limits" ? "!bg-white !text-black" : ""
                }`}
                value="limits"
              >
                Limits & Usage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Offer Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g. Summer Special, Weekend Discount"
                  className={`bg-[#252525] border-[#333] `}
                  value={newOffer.title}
                  onChange={(e) => {
                    setNewOffer({ ...newOffer, title: e.target.value });
                    if (errors.title) {
                      const { title, ...rest } = errors;
                      setErrors(rest);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe the offer details"
                  className={`bg-[#252525] border-[#333] min-h-[100px] `}
                  value={newOffer.description}
                  onChange={(e) => {
                    setNewOffer({ ...newOffer, description: e.target.value });
                    if (errors.description) {
                      const { description, ...rest } = errors;
                      setErrors(rest);
                    }
                  }}
                />
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{newOffer.description.length} characters</span>
                  <span>Max 500 characters</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="couponCode">
                  Coupon Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="couponCode"
                  placeholder="e.g. SUMMER20, WEEKEND15"
                  className={`bg-[#252525] border-[#333] uppercase `}
                  value={newOffer.couponCode}
                  onChange={(e) => {
                    setNewOffer({ ...newOffer, couponCode: e.target.value });
                    if (errors.couponCode) {
                      const { couponCode, ...rest } = errors;
                      setErrors(rest);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Offer Image</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-32 rounded-md overflow-hidden bg-[#252525] border border-[#333]">
                    {newOffer.image ? (
                      <Image
                        src={newOffer.image || "/placeholder.svg"}
                        alt="Offer preview"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <TicketPercent className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-dashed border-[#333] hover:bg-[#252525]"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="flex items-center">
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                          Uploading...
                        </div>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          {newOffer.image ? "Change Image" : "Upload Image"}
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG or WEBP (max. 2MB)
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="discount" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="discountPercentage">
                  Discount Percentage <span className="text-red-500">*</span>
                </Label>
                <div className="space-y-4">
                  <Slider
                    id="discountPercentage"
                    min={1}
                    max={100}
                    step={1}
                    value={[newOffer.discountPercentage]}
                    onValueChange={(value) => {
                      setNewOffer({
                        ...newOffer,
                        discountPercentage: value[0],
                      });
                      if (errors.discountPercentage) {
                        const { discountPercentage, ...rest } = errors;
                        setErrors(rest);
                      }
                    }}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-500">
                      {newOffer.discountPercentage}%
                    </span>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      value={newOffer.discountPercentage}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value);
                        if (value >= 1 && value <= 100) {
                          setNewOffer({
                            ...newOffer,
                            discountPercentage: value,
                          });
                          if (errors.discountPercentage) {
                            const { discountPercentage, ...rest } = errors;
                            setErrors(rest);
                          }
                        }
                      }}
                      className="w-20 bg-[#252525] border-[#333]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="validFrom">
                  Valid From <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="validFrom"
                  type="date"
                  className={`bg-[#252525] border-[#333] `}
                  value={
                    newOffer.validFrom
                      ? new Date(newOffer.validFrom).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    setNewOffer({
                      ...newOffer,
                      validFrom: new Date(e.target.value),
                    });
                    if (errors.validFrom) {
                      const { validFrom, ...rest } = errors;
                      setErrors(rest);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">
                  Valid Until <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="validUntil"
                  type="date"
                  className={`bg-[#252525] border-[#333] `}
                  value={
                    newOffer.validUntil
                      ? new Date(newOffer.validUntil)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    setNewOffer({
                      ...newOffer,
                      validUntil: new Date(e.target.value),
                    });
                    if (errors.validUntil) {
                      const { validUntil, ...rest } = errors;
                      setErrors(rest);
                    }
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="applicability" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="applicableCategories">
                  Applicable Categories
                </Label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 bg-[#252525] border-[#333] rounded-md p-2 text-white"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {Array.isArray(categories) && categories
                      .filter((cat) => !newOffer.applicableCategories.includes(cat))
                      .map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                    ))}
                  </select>
                  <Button
                    type="button"
                    onClick={handleAddCategory}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {newOffer.applicableCategories.map((category, index) => (
                    <Badge
                      key={index}
                      className="bg-[#252525] hover:bg-[#303030] text-white"
                    >
                      {category.name}
                      <button
                        type="button"
                        className="ml-1 text-gray-400 hover:text-white"
                        onClick={() => handleRemoveCategory(category)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}

                  {newOffer.applicableCategories.length === 0 && (
                    <p className="text-sm text-gray-400 italic">
                      No categories selected. Offer will apply to all
                      categories.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicableMenuItems">
                  Applicable Menu Items
                </Label>
                <div className="flex gap-2">
                  <select
                    className="flex-1 bg-[#252525] border-[#333] rounded-md p-2 text-white"
                    value={selectedMenuItem}
                    onChange={(e) => setSelectedMenuItem(e.target.value)}
                  >
                    <option value="">Select a menu item</option>
                    {menu
                      ? menu
                          .filter(
                            (item) =>
                              !newOffer.applicableMenuItems.some(
                                (i) => i._id === item._id
                              )
                          )
                          .map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))
                      : null}
                  </select>
                  <Button
                    type="button"
                    onClick={handleAddMenuItem}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-col gap-2 mt-3">
                  {newOffer.applicableMenuItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-[#252525] p-2 rounded-md"
                    >
                      <span>{item.name}</span>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white"
                        onClick={() => handleRemoveMenuItem(item._id)}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {newOffer.applicableMenuItems.length === 0 && (
                    <p className="text-sm text-gray-400 italic">
                      No menu items selected. Offer will apply based on selected
                      categories.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="limits" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderAmount">Minimum Order Amount ($)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`bg-[#252525] border-[#333] `}
                  value={newOffer.minOrderAmount}
                  onChange={(e) => {
                    setNewOffer({
                      ...newOffer,
                      minOrderAmount: Number.parseFloat(e.target.value) || 0,
                    });
                    if (errors.minOrderAmount) {
                      const { minOrderAmount, ...rest } = errors;
                      setErrors(rest);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxDiscountAmount">
                  Maximum Discount Amount ($)
                </Label>
                <Input
                  id="maxDiscountAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Leave empty for no limit"
                  className={`bg-[#252525] border-[#333] `}
                  value={
                    newOffer.maxDiscountAmount === null
                      ? ""
                      : newOffer.maxDiscountAmount
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? null
                        : Number.parseFloat(e.target.value);
                    setNewOffer({ ...newOffer, maxDiscountAmount: value });
                    if (errors.maxDiscountAmount) {
                      const { maxDiscountAmount, ...rest } = errors;
                      setErrors(rest);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  min="0"
                  placeholder="Leave empty for unlimited usage"
                  className={`bg-[#252525] border-[#333] `}
                  value={
                    newOffer.usageLimit === null ? "" : newOffer.usageLimit
                  }
                  onChange={(e) => {
                    const value =
                      e.target.value === ""
                        ? null
                        : Number.parseInt(e.target.value);
                    setNewOffer({ ...newOffer, usageLimit: value });
                    if (errors.usageLimit) {
                      const { usageLimit, ...rest } = errors;
                      setErrors(rest);
                    }
                  }}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active Status</Label>
                  <Switch
                    id="isActive"
                    checked={newOffer.isActive}
                    onCheckedChange={(checked) =>
                      setNewOffer({ ...newOffer, isActive: checked })
                    }
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {newOffer.isActive
                    ? "This offer will be immediately available for customers to use."
                    : "This offer will be saved as inactive and can be activated later."}
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="bg-[#151515] -mx-6 -mb-6 px-6 py-4 mt-6 flex justify-between items-center">
            <div>
              {Object.keys(errors).length > 0 ? (
                <p className="text-red-500 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Please fill the required fields
                </p>
              ) : (
                <p className="text-green-500 text-sm flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Form is valid and ready to submit
                </p>
              )}
            </div>

            <DialogFooter className="sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseAddModal}
                className="border-[#333] hover:bg-[#252525]"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddOffer}
                className="bg-orange-600 hover:bg-orange-700"
                disabled={Object.keys(errors).length > 0}
              >
                Add Offer
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Offer Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={handleCloseUpdateModal}>
        <DialogContent className="bg-[#1A1A1A] text-white border-[#333] max-w-2xl">
          {selectedOffer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold flex items-center">
                  <Edit className="mr-2 h-5 w-5 text-orange-500" />
                  Edit Offer: {selectedOffer.title}
                </DialogTitle>
              </DialogHeader>

              <Tabs
                value={activeOffer}
                onValueChange={setActiveOffer}
                className="mt-4"
              >
                <TabsList className="bg-[#252525]">
                  <TabsTrigger
                    className={`${
                      activeOffer === "basic" ? "!bg-white !text-black" : ""
                    }`}
                    value="basic"
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger
                    className={`${
                      activeOffer === "discount" ? "!bg-white !text-black" : ""
                    }`}
                    value="discount"
                  >
                    Discount Details
                  </TabsTrigger>
                  <TabsTrigger
                    className={`${
                      activeOffer === "applicability"
                        ? "!bg-white !text-black"
                        : ""
                    }`}
                    value="applicability"
                  >
                    Applicability
                  </TabsTrigger>
                  <TabsTrigger
                    className={`${
                      activeOffer === "limits" ? "!bg-white !text-black" : ""
                    }`}
                    value="limits"
                  >
                    Limits & Usage
                  </TabsTrigger>
                </TabsList>

                {/* Same content as Add Modal but with selectedOffer instead of newOffer */}
                {/* Basic Info Tab */}
                <TabsContent value="basic" className="space-y-4 mt-4">
                  {/* Same fields as Add Modal but for selectedOffer */}
                  <div className="space-y-2">
                    <Label htmlFor="update-title">
                      Offer Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="update-title"
                      placeholder="e.g. Summer Special, Weekend Discount"
                      className={`bg-[#252525] border-[#333] `}
                      value={selectedOffer.title}
                      onChange={(e) => {
                        setSelectedOffer({
                          ...selectedOffer,
                          title: e.target.value,
                        });
                        if (errors.title) {
                          const { title, ...rest } = errors;
                          setErrors(rest);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-description">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="update-description"
                      placeholder="Describe the offer details"
                      className={`bg-[#252525] border-[#333] min-h-[100px] `}
                      value={selectedOffer.description}
                      onChange={(e) => {
                        setSelectedOffer({
                          ...selectedOffer,
                          description: e.target.value,
                        });
                        if (errors.description) {
                          const { description, ...rest } = errors;
                          setErrors(rest);
                        }
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{selectedOffer.description.length} characters</span>
                      <span>Max 500 characters</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-couponCode">
                      Coupon Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="update-couponCode"
                      placeholder="e.g. SUMMER20, WEEKEND15"
                      className={`bg-[#252525] border-[#333] uppercase `}
                      value={selectedOffer.couponCode}
                      onChange={(e) => {
                        setSelectedOffer({
                          ...selectedOffer,
                          couponCode: e.target.value,
                        });
                        if (errors.couponCode) {
                          const { couponCode, ...rest } = errors;
                          setErrors(rest);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-image">Offer Image</Label>
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-32 rounded-md overflow-hidden bg-[#252525] border border-[#333]">
                        {selectedOffer.image ? (
                          <Image
                            src={selectedOffer.image || "/placeholder.svg"}
                            alt="Offer preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <TicketPercent className="h-8 w-8 text-gray-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageUpload}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-dashed border-[#333] hover:bg-[#252525]"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <div className="flex items-center">
                              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                              Uploading...
                            </div>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              {selectedOffer.image
                                ? "Change Image"
                                : "Upload Image"}
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-gray-400 mt-1">
                          JPG, PNG or WEBP (max. 2MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Other tabs with similar structure but for selectedOffer */}
                <TabsContent value="discount" className="space-y-4 mt-4">
                  {/* Similar to Add Modal but for selectedOffer */}
                  <div className="space-y-2">
                    <Label htmlFor="update-discountPercentage">
                      Discount Percentage{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-4">
                      <Slider
                        id="update-discountPercentage"
                        min={1}
                        max={100}
                        step={1}
                        value={[selectedOffer.discountPercentage]}
                        onValueChange={(value) => {
                          setSelectedOffer({
                            ...selectedOffer,
                            discountPercentage: value[0],
                          });
                          if (errors.discountPercentage) {
                            const { discountPercentage, ...rest } = errors;
                            setErrors(rest);
                          }
                        }}
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-orange-500">
                          {selectedOffer.discountPercentage}%
                        </span>
                        <Input
                          type="number"
                          min={1}
                          max={100}
                          value={selectedOffer.discountPercentage}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value);
                            if (value >= 1 && value <= 100) {
                              setSelectedOffer({
                                ...selectedOffer,
                                discountPercentage: value,
                              });
                              if (errors.discountPercentage) {
                                const { discountPercentage, ...rest } = errors;
                                setErrors(rest);
                              }
                            }
                          }}
                          className="w-20 bg-[#252525] border-[#333]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-validFrom">
                      Valid From <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="update-validFrom"
                      type="date"
                      className={`bg-[#252525] border-[#333] `}
                      value={
                        selectedOffer.validFrom
                          ? new Date(selectedOffer.validFrom)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        setSelectedOffer({
                          ...selectedOffer,
                          validFrom: new Date(e.target.value),
                        });
                        if (errors.validFrom) {
                          const { validFrom, ...rest } = errors;
                          setErrors(rest);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-validUntil">
                      Valid Until <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="update-validUntil"
                      type="date"
                      className={`bg-[#252525] border-[#333] `}
                      value={
                        selectedOffer.validUntil
                          ? new Date(selectedOffer.validUntil)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        setSelectedOffer({
                          ...selectedOffer,
                          validUntil: new Date(e.target.value),
                        });
                        if (errors.validUntil) {
                          const { validUntil, ...rest } = errors;
                          setErrors(rest);
                        }
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="applicability" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="update-applicableCategories">
                      Applicable Categories
                    </Label>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 bg-[#252525] border-[#333] rounded-md p-2 text-white"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      >
                        <option value="">Select a category</option>
                        {categories.filter(
                          (cat) =>
                            !selectedOffer.applicableCategories.includes(cat)
                        ).map((category) => (
                          <option key={category} value={category}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        type="button"
                        onClick={handleAddCategory}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {selectedOffer.applicableCategories.map(
                        (category, index) => (
                          <Badge
                            key={index}
                            className="bg-[#252525] hover:bg-[#303030] text-white"
                          >
                            {category}
                            <button
                              type="button"
                              className="ml-1 text-gray-400 hover:text-white"
                              onClick={() => handleRemoveCategory(category)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )
                      )}

                      {selectedOffer.applicableCategories.length === 0 && (
                        <p className="text-sm text-gray-400 italic">
                          No categories selected. Offer will apply to all
                          categories.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-applicableMenuItems">
                      Applicable Menu Items
                    </Label>
                    <div className="flex gap-2">
                      <select
                        className="flex-1 bg-[#252525] border-[#333] rounded-md p-2 text-white"
                        value={selectedMenuItem}
                        onChange={(e) => setSelectedMenuItem(e.target.value)}
                      >
                        <option value="">Select a menu item</option>
                        {menu
                          .filter(
                            (item) =>
                              !selectedOffer.applicableMenuItems.some(
                                (i) => i._id === item._id
                              )
                          )
                          .map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                      <Button
                        type="button"
                        onClick={handleAddMenuItem}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                      {selectedOffer.applicableMenuItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-[#252525] p-2 rounded-md"
                        >
                          <span>{item.name}</span>
                          <button
                            type="button"
                            className="text-gray-400 hover:text-white"
                            onClick={() => handleRemoveMenuItem(item._id)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}

                      {selectedOffer.applicableMenuItems.length === 0 && (
                        <p className="text-sm text-gray-400 italic">
                          No menu items selected. Offer will apply based on
                          selected categories.
                        </p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="limits" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="update-minOrderAmount">
                      Minimum Order Amount ($)
                    </Label>
                    <Input
                      id="update-minOrderAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      className={`bg-[#252525] border-[#333] `}
                      value={selectedOffer.minOrderAmount}
                      onChange={(e) => {
                        setSelectedOffer({
                          ...selectedOffer,
                          minOrderAmount:
                            Number.parseFloat(e.target.value) || 0,
                        });
                        if (errors.minOrderAmount) {
                          const { minOrderAmount, ...rest } = errors;
                          setErrors(rest);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-maxDiscountAmount">
                      Maximum Discount Amount ($)
                    </Label>
                    <Input
                      id="update-maxDiscountAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Leave empty for no limit"
                      className={`bg-[#252525] border-[#333] `}
                      value={
                        selectedOffer.maxDiscountAmount === null
                          ? ""
                          : selectedOffer.maxDiscountAmount
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? null
                            : Number.parseFloat(e.target.value);
                        setSelectedOffer({
                          ...selectedOffer,
                          maxDiscountAmount: value,
                        });
                        if (errors.maxDiscountAmount) {
                          const { maxDiscountAmount, ...rest } = errors;
                          setErrors(rest);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-usageLimit">Usage Limit</Label>
                    <Input
                      id="update-usageLimit"
                      type="number"
                      min="0"
                      placeholder="Leave empty for unlimited usage"
                      className={`bg-[#252525] border-[#333] `}
                      value={
                        selectedOffer.usageLimit === null
                          ? ""
                          : selectedOffer.usageLimit
                      }
                      onChange={(e) => {
                        const value =
                          e.target.value === ""
                            ? null
                            : Number.parseInt(e.target.value);
                        setSelectedOffer({
                          ...selectedOffer,
                          usageLimit: value,
                        });
                        if (errors.usageLimit) {
                          const { usageLimit, ...rest } = errors;
                          setErrors(rest);
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="update-isActive">Active Status</Label>
                      <Switch
                        id="update-isActive"
                        checked={selectedOffer.isActive}
                        onCheckedChange={(checked) =>
                          setSelectedOffer({
                            ...selectedOffer,
                            isActive: checked,
                          })
                        }
                      />
                    </div>
                    <p className="text-xs text-gray-400">
                      {selectedOffer.isActive
                        ? "This offer is currently active and available for customers to use."
                        : "This offer is currently inactive and not available for customers."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="update-currentUsage">Current Usage</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="update-currentUsage"
                        type="number"
                        min="0"
                        className="bg-[#252525] border-[#333]"
                        value={selectedOffer.currentUsage}
                        onChange={(e) => {
                          setSelectedOffer({
                            ...selectedOffer,
                            currentUsage: Number.parseInt(e.target.value) || 0,
                          });
                        }}
                      />
                      <span className="text-gray-400">
                        {selectedOffer.usageLimit
                          ? `/ ${selectedOffer.usageLimit}`
                          : ""}
                      </span>
                    </div>
                    {selectedOffer.usageLimit && (
                      <div className="w-full bg-[#1A1A1A] rounded-full h-2 mt-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full"
                          style={{
                            width: `${calculateUsagePercentage(
                              selectedOffer.currentUsage,
                              selectedOffer.usageLimit
                            )}%`,
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="bg-[#151515] -mx-6 -mb-6 px-6 py-4 mt-6 flex justify-between items-center">
                <div>
                  {Object.keys(errors).length > 0 ? (
                    <p className="text-red-500 text-sm flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Please fill the required fields
                    </p>
                  ) : (
                    <p className="text-green-500 text-sm flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Form is valid and ready to submit
                    </p>
                  )}
                </div>

                <DialogFooter className="sm:justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseUpdateModal}
                    className="border-[#333] hover:bg-[#252525]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleUpdateOffer}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={Object.keys(errors).length > 0}
                  >
                    Update Offer
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => !open && setIsDeleteModalOpen(false)}
      >
        <DialogContent className="bg-[#1A1A1A] text-white border-[#333] max-w-md">
          {selectedOffer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-red-500 flex items-center">
                  <Trash2 className="mr-2 h-5 w-5" />
                  Delete Offer
                </DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <p className="mb-4">
                  Are you sure you want to delete{" "}
                  <span className="font-bold">{selectedOffer.title}</span>? This
                  action cannot be undone.
                </p>

                <div className="bg-[#252525] p-3 rounded-md flex items-center gap-3 border border-[#333]">
                  {selectedOffer.image ? (
                    <Image
                      src={selectedOffer.image || "/placeholder.svg"}
                      alt={selectedOffer.title}
                      width={50}
                      height={50}
                      className="rounded-md object-cover h-12 w-12"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-[#303030] rounded-md flex items-center justify-center">
                      <TicketPercent className="h-6 w-6 text-gray-500" />
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium">{selectedOffer.title}</h4>
                    <p className="text-sm text-orange-500">
                      {selectedOffer.couponCode}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="border-[#333] hover:bg-[#252525]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-700 hover:bg-red-700"
                  onClick={handleDeleteOffer}
                >
                  Delete Offer
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Toggle Confirmation Dialog */}
      <Dialog
        open={isStatusConfirmOpen}
        onOpenChange={(open) => !open && setIsStatusConfirmOpen(false)}
      >
        <DialogContent className="bg-[#1A1A1A] text-white border-[#333] max-w-xs">
          {offerToToggle && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-bold flex items-center">
                  {offerToToggle.isActive ? (
                    <EyeOff className="mr-2 h-5 w-5 text-red-500" />
                  ) : (
                    <Eye className="mr-2 h-5 w-5 text-green-500" />
                  )}
                  {offerToToggle.isActive
                    ? "Deactivate Offer"
                    : "Activate Offer"}
                </DialogTitle>
              </DialogHeader>

              <div className="py-3">
                <p className="text-sm">
                  Are you sure you want to{" "}
                  {offerToToggle.isActive ? "deactivate" : "activate"}{" "}
                  <span className="font-bold">{offerToToggle.title}</span>?
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {offerToToggle.isActive
                    ? "This offer will no longer be available to customers."
                    : "This offer will become available to customers."}
                </p>
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsStatusConfirmOpen(false)}
                  className="border-[#333] hover:bg-[#252525]"
                  size="sm"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    handleToggleStatus(offerToToggle);
                    setIsStatusConfirmOpen(false);
                  }}
                  className={
                    offerToToggle.isActive
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }
                  size="sm"
                >
                  {offerToToggle.isActive ? "Deactivate" : "Activate"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Status */}
      {Object.keys(alertStatus).length > 0 && (
        <div
          className={`fixed z-[100] w-fit bottom-5 right-5 ${
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
