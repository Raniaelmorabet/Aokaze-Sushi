"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Trash2,
    Plus,
    X,
    Loader2,
    Search,
    Edit,
    Check,
    ImageIcon,
    Filter,
    Upload,
    CheckCircle,
    Eye,
    EyeOff,
    RefreshCw,
} from "lucide-react"
import Image from "next/image"
import Loader from "@/components/Loader"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

// Sample categories data
const sampleCategories = [
    {
        _id: "1",
        name: "Sushi Rolls",
        description: "Traditional and fusion sushi rolls with various fillings and toppings.",
        image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=1200&auto=format&fit=crop",
        isActive: true,
        createdAt: "2023-05-15T12:00:00Z",
        updatedAt: "2023-11-20T14:30:00Z",
    },
    {
        _id: "2",
        name: "Sashimi",
        description: "Fresh slices of raw fish served with wasabi and soy sauce.",
        image: "https://images.unsplash.com/photo-1534482421-64566f976cfa?q=80&w=1200&auto=format&fit=crop",
        isActive: true,
        createdAt: "2023-06-10T10:15:00Z",
        updatedAt: "2023-10-05T09:45:00Z",
    },
    {
        _id: "3",
        name: "Nigiri",
        description: "Hand-pressed sushi with a slice of fish or seafood on top of rice.",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1200&auto=format&fit=crop",
        isActive: true,
        createdAt: "2023-04-22T15:30:00Z",
        updatedAt: "2023-09-18T11:20:00Z",
    },
    {
        _id: "4",
        name: "Tempura",
        description: "Seafood and vegetables deep-fried in a light, crispy batter.",
        image: "https://images.unsplash.com/photo-1617196034183-421b4917c92d?q=80&w=1200&auto=format&fit=crop",
        isActive: false,
        createdAt: "2023-07-05T09:00:00Z",
        updatedAt: "2023-12-01T16:10:00Z",
    },
    {
        _id: "5",
        name: "Bento Boxes",
        description: "Assorted dishes served in compartmentalized boxes.",
        image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1200&auto=format&fit=crop",
        isActive: true,
        createdAt: "2023-08-18T14:20:00Z",
        updatedAt: "2023-11-10T13:40:00Z",
    },
    {
        _id: "6",
        name: "Ramen",
        description: "Japanese noodle soup with various toppings and flavors.",
        image: "https://images.unsplash.com/photo-1562158074-d49fbeffcc91?q=80&w=1200&auto=format&fit=crop",
        isActive: true,
        createdAt: "2023-09-30T11:45:00Z",
        updatedAt: null,
    },
    {
        _id: "7",
        name: "Donburi",
        description: "Rice bowl dishes topped with meat, fish, or vegetables.",
        image: "https://images.unsplash.com/photo-1584583570840-0a3d88497351?q=80&w=1200&auto=format&fit=crop",
        isActive: false,
        createdAt: "2023-10-12T13:25:00Z",
        updatedAt: "2023-12-15T10:30:00Z",
    },
    {
        _id: "8",
        name: "Desserts",
        description: "Japanese-inspired sweet treats and desserts.",
        image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?q=80&w=1200&auto=format&fit=crop",
        isActive: true,
        createdAt: "2023-11-05T19:10:00Z",
        updatedAt: null,
    },
]

export default function CategoryManagement() {
    const [categories, setCategories] = useState(sampleCategories)
    const [loading, setLoading] = useState(false)
    const [addModalOpen, setAddModalOpen] = useState(false)
    const [updateModalOpen, setUpdateModalOpen] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [statusModalOpen, setStatusModalOpen] = useState(false) // New state for status confirmation modal
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterActive, setFilterActive] = useState("all")
    const [sortBy, setSortBy] = useState("name")
    const [sortOrder, setSortOrder] = useState("asc")
    const [filterOpen, setFilterOpen] = useState(false)
    const [recentlyUpdated, setRecentlyUpdated] = useState(null) // New state to track recently updated category

    const { toast } = useToast()

    // Form states
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        isActive: true,
    })
    const [formErrors, setFormErrors] = useState({})
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const fileInputRef = useRef(null)

    // Clear the recently updated state after animation completes
    useEffect(() => {
        if (recentlyUpdated) {
            const timer = setTimeout(() => {
                setRecentlyUpdated(null)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [recentlyUpdated])

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true)
        try {
            setTimeout(() => {
                setCategories(sampleCategories)
                setLoading(false)
            }, 2000)
        } catch (error) {
            console.error("Error fetching categories:", error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    // Filter and sort categories
    const filteredCategories = categories
        .filter((category) => {
            // Filter by search query
            const matchesSearch =
                category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))

            // Filter by active status
            const matchesStatus =
                filterActive === "all" ||
                (filterActive === "active" && category.isActive) ||
                (filterActive === "inactive" && !category.isActive)

            return matchesSearch && matchesStatus
        })
        .sort((a, b) => {
            // Sort by selected field
            if (sortBy === "name") {
                return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
            } else if (sortBy === "date") {
                return sortOrder === "asc"
                    ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                    : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            return 0
        })

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        const newValue = type === "checkbox" ? checked : value

        setFormData({
            ...formData,
            [name]: newValue,
        })

        // Perform real-time validation
        const error = validateField(name, newValue)

        setFormErrors({
            ...formErrors,
            [name]: error,
        })
    }

    // Validate form
    const validateForm = () => {
        const errors = {}

        // Validate name
        if (!formData.name.trim()) {
            errors.name = "Category name is required"
        } else if (formData.name.trim().length < 2) {
            errors.name = "Category name must be at least 2 characters"
        } else if (formData.name.trim().length > 50) {
            errors.name = "Category name cannot exceed 50 characters"
        } else if (!/^[a-zA-Z0-9\s-&]+$/.test(formData.name)) {
            errors.name = "Category name can only contain letters, numbers, spaces, hyphens, and ampersands"
        }

        // Check for duplicate name (only for adding new category)
        if (!selectedCategory && categories.some((cat) => cat.name.toLowerCase() === formData.name.toLowerCase())) {
            errors.name = "A category with this name already exists"
        }

        // Validate description
        if (formData.description && formData.description.length > 200) {
            errors.description = "Description cannot exceed 200 characters"
        }

        // Validate image
        if (formData.image && !/\.(jpg|jpeg|png|webp)$/i.test(formData.image)) {
            errors.image = "Image must be a valid JPG, JPEG, PNG, or WEBP file"
        }

        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (!/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                setFormErrors({
                    ...formErrors,
                    image: "Image must be a valid JPG, JPEG, PNG, or WEBP file",
                })
                return
            }

            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
                setFormData({
                    ...formData,
                    image: file.name, // In a real app, this would be the URL after upload
                })
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    // Handle drop event
    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            if (!/\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                setFormErrors({
                    ...formErrors,
                    image: "Image must be a valid JPG, JPEG, PNG, or WEBP file",
                })
                return
            }

            setImageFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
                setFormData({
                    ...formData,
                    image: file.name, // In a real app, this would be the URL after upload
                })
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle form submission for adding a category
    const handleAddCategory = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setUploading(true)
        setUploadProgress(0)

        try {
            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 95) {
                        clearInterval(interval)
                        return 95
                    }
                    return prev + 5
                })
            }, 100)

            // For demo, we'll simulate the API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Add the new category to our local state
            const newCategory = {
                _id: String(Date.now()),
                ...formData,
                createdAt: new Date().toISOString(),
                updatedAt: null,
            }

            setCategories([newCategory, ...categories])

            clearInterval(interval)
            setUploadProgress(100)
            setUploadSuccess(true)

            // Show success toast
            toast({
                title: "Category Added",
                description: `"${formData.name}" has been successfully created.`,
                variant: "success",
            })

            // Reset form after successful upload
            setTimeout(() => {
                setAddModalOpen(false)
                resetForm()
            }, 1500)
        } catch (error) {
            console.error("Error adding category:", error)
            setUploading(false)

            // Show error toast
            toast({
                title: "Error",
                description: "Failed to add category. Please try again.",
                variant: "destructive",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }

    // Handle form submission for updating a category
    const handleUpdateCategory = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setUploading(true)
        setUploadProgress(0)

        try {
            // Simulate upload progress
            const interval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 95) {
                        clearInterval(interval)
                        return 95
                    }
                    return prev + 5
                })
            }, 100)

            // For demo, we'll simulate the API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            // Update the category in our local state
            const updatedCategories = categories.map((cat) =>
                cat._id === selectedCategory._id
                    ? {
                        ...cat,
                        ...formData,
                        updatedAt: new Date().toISOString(),
                    }
                    : cat,
            )

            setCategories(updatedCategories)

            clearInterval(interval)
            setUploadProgress(100)
            setUploadSuccess(true)

            // Show success toast
            toast({
                title: "Category Updated",
                description: `"${formData.name}" has been successfully updated.`,
                variant: "success",
            })

            // Reset form after successful upload
            setTimeout(() => {
                setUpdateModalOpen(false)
                resetForm()
            }, 1500)
        } catch (error) {
            console.error("Error updating category:", error)
            setUploading(false)

            // Show error toast
            toast({
                title: "Error",
                description: "Failed to update category. Please try again.",
                variant: "destructive",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }

    // Handle category delete
    const handleDeleteCategory = async () => {
        try {
            // For demo, we'll update our local state
            setCategories(categories.filter((cat) => cat._id !== selectedCategory._id))
            setDeleteModalOpen(false)

            // Show success toast
            toast({
                title: "Category Deleted",
                description: `"${selectedCategory.name}" has been successfully deleted.`,
                variant: "success",
            })
        } catch (error) {
            console.error("Error deleting category:", error)

            // Show error toast
            toast({
                title: "Error",
                description: "Failed to delete category. Please try again.",
                variant: "destructive",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }

    // Open status confirmation modal
    const openStatusModal = (category) => {
        setSelectedCategory(category)
        setStatusModalOpen(true)
    }

    // Toggle category active status
    const toggleCategoryStatus = async () => {
        try {
            // Close the confirmation modal
            setStatusModalOpen(false)

            // For demo, we'll update our local state
            const updatedCategories = categories.map((cat) =>
                cat._id === selectedCategory._id
                    ? {
                        ...cat,
                        isActive: !cat.isActive,
                        updatedAt: new Date().toISOString(),
                    }
                    : cat,
            )

            setCategories(updatedCategories)

            // Set the recently updated category for animation
            setRecentlyUpdated(selectedCategory._id)

            // Show success toast
            toast({
                title: "Status Updated",
                description: `"${selectedCategory.name}" is now ${!selectedCategory.isActive ? "active" : "inactive"}.`,
                variant: "success",
            })
        } catch (error) {
            console.error("Error toggling category status:", error)

            // Show error toast
            toast({
                title: "Error",
                description: "Failed to update status. Please try again.",
                variant: "destructive",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
        }
    }

    // Open update modal
    const openUpdateModal = (category) => {
        setSelectedCategory(category)
        setFormData({
            name: category.name,
            description: category.description || "",
            image: category.image,
            isActive: category.isActive,
        })
        setImagePreview(category.image)
        setUpdateModalOpen(true)
    }

    // Open delete confirmation modal
    const openDeleteModal = (category) => {
        setSelectedCategory(category)
        setDeleteModalOpen(true)
    }

    // Reset form
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            image: "",
            isActive: true,
        })
        setImageFile(null)
        setImagePreview(null)
        setFormErrors({})
        setUploading(false)
        setUploadProgress(0)
        setUploadSuccess(false)
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return "N/A"
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Add this function for real-time validation as user types
    const validateField = (name, value) => {
        let error = null

        switch (name) {
            case "name":
                if (!value.trim()) {
                    error = "Category name is required"
                } else if (value.trim().length < 2) {
                    error = "Category name must be at least 2 characters"
                } else if (value.trim().length > 50) {
                    error = "Category name cannot exceed 50 characters"
                } else if (!/^[a-zA-Z0-9\s-&]+$/.test(value)) {
                    error = "Category name can only contain letters, numbers, spaces, hyphens, and ampersands"
                } else if (!selectedCategory && categories.some((cat) => cat.name.toLowerCase() === value.toLowerCase())) {
                    error = "A category with this name already exists"
                }
                break
            case "description":
                if (value && value.length > 200) {
                    error = "Description cannot exceed 200 characters"
                }
                break
            default:
                break
        }

        return error
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
            >
                <div>
                    <h1 className="text-3xl font-bold mb-2">Category Management</h1>
                    <p className="text-gray-400">Create, update, and manage menu categories</p>
                </div>

                <div className="flex gap-3 mt-4 md:mt-0">
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        <Filter size={18} />
                        <span>Filter</span>
                    </motion.button>

                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        onClick={() => {
                            resetForm()
                            setAddModalOpen(true)
                        }}
                    >
                        <Plus size={18} />
                        <span>Add Category</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Search and Filter */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mb-6"
            >
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search categories by name or description..."
                        className="w-full bg-[#1E1E1E] border border-gray-800 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </motion.div>

            {/* Filter Dropdown */}
            <AnimatePresence>
                {filterOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-[#1E1E1E] rounded-xl p-4 mb-6 border border-gray-800"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="font-medium mb-3">Status</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="filter-all"
                                            name="filter-status"
                                            className="mr-2"
                                            checked={filterActive === "all"}
                                            onChange={() => setFilterActive("all")}
                                        />
                                        <label htmlFor="filter-all" className="text-sm">
                                            All Categories
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="filter-active"
                                            name="filter-status"
                                            className="mr-2"
                                            checked={filterActive === "active"}
                                            onChange={() => setFilterActive("active")}
                                        />
                                        <label htmlFor="filter-active" className="text-sm">
                                            Active Only
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="filter-inactive"
                                            name="filter-status"
                                            className="mr-2"
                                            checked={filterActive === "inactive"}
                                            onChange={() => setFilterActive("inactive")}
                                        />
                                        <label htmlFor="filter-inactive" className="text-sm">
                                            Inactive Only
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3">Sort By</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="sort-name"
                                            name="sort"
                                            className="mr-2"
                                            checked={sortBy === "name"}
                                            onChange={() => setSortBy("name")}
                                        />
                                        <label htmlFor="sort-name" className="text-sm">
                                            Name
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="sort-date"
                                            name="sort"
                                            className="mr-2"
                                            checked={sortBy === "date"}
                                            onChange={() => setSortBy("date")}
                                        />
                                        <label htmlFor="sort-date" className="text-sm">
                                            Creation Date
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3">Order</h3>
                                <div className="flex items-center gap-2">
                                    <button
                                        className={`px-3 py-1 text-sm rounded ${
                                            sortOrder === "asc" ? "bg-orange-500 text-white" : "bg-[#3a3a3a] text-gray-300"
                                        }`}
                                        onClick={() => setSortOrder("asc")}
                                    >
                                        Ascending
                                    </button>
                                    <button
                                        className={`px-3 py-1 text-sm rounded ${
                                            sortOrder === "desc" ? "bg-orange-500 text-white" : "bg-[#3a3a3a] text-gray-300"
                                        }`}
                                        onClick={() => setSortOrder("desc")}
                                    >
                                        Descending
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
                <div className="bg-[#1E1E1E] rounded-xl p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mr-4">
                        <ImageIcon size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Categories</p>
                        <p className="text-2xl font-bold">{categories.length}</p>
                    </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-xl p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mr-4">
                        <Eye size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Active Categories</p>
                        <p className="text-2xl font-bold">{categories.filter((cat) => cat.isActive).length}</p>
                    </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-xl p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mr-4">
                        <EyeOff size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Inactive Categories</p>
                        <p className="text-2xl font-bold">{categories.filter((cat) => !cat.isActive).length}</p>
                    </div>
                </div>
            </motion.div>

            {/* Categories Grid */}
            {loading ? (
                // <div className="flex flex-col justify-center items-center h-64">
                //     <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
                //     <p className="text-gray-400">Loading categories...</p>
                // </
                <Loader/>
            ) : filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCategories.map((category, index) => (
                            <motion.div
                                key={category._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    boxShadow:
                                        recentlyUpdated === category._id
                                            ? [
                                                "0 0 0 rgba(249, 115, 22, 0)",
                                                "0 0 20px rgba(249, 115, 22, 0.7)",
                                                "0 0 0 rgba(249, 115, 22, 0)",
                                            ]
                                            : "0 0 0 rgba(0,0,0,0)",
                                }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                layout
                                className={`bg-[#1E1E1E] rounded-xl overflow-hidden shadow-md group relative ${
                                    recentlyUpdated === category._id ? "animate-pulse-border" : ""
                                }`}
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={category.image || "/placeholder.svg"}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <div className="flex justify-between items-center">
                                            <button
                                                onClick={() => openUpdateModal(category)}
                                                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                                            >
                                                <Edit size={16} />
                                            </button>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openStatusModal(category)}
                                                    className={`${
                                                        category.isActive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                                                    } text-white p-2 rounded-full transition-colors`}
                                                >
                                                    {category.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(category)}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="font-medium text-lg">{category.name}</h3>
                                        <div
                                            className={`${
                                                category.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                            } text-xs px-2 py-1 rounded-full flex items-center gap-1`}
                                        >
                                            {category.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                            <span>{category.isActive ? "Active" : "Inactive"}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{category.description || "No description"}</p>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Created: {formatDate(category.createdAt)}</span>
                                        {category.updatedAt && <span>Updated: {formatDate(category.updatedAt)}</span>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="bg-[#1E1E1E] rounded-xl p-12 text-center">
                    <ImageIcon className="mx-auto text-gray-600 mb-4" size={48} />
                    <h3 className="text-xl font-medium mb-2">No categories found</h3>
                    <p className="text-gray-400 mb-6">
                        {searchQuery
                            ? `No categories match "${searchQuery}"`
                            : filterActive !== "all"
                                ? `No ${filterActive} categories found`
                                : "No categories have been created yet. Add some categories to get started."}
                    </p>
                    <button
                        onClick={() => {
                            resetForm()
                            setAddModalOpen(true)
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add Category</span>
                    </button>
                </div>
            )}

            {/* Add Category Modal */}
            <AnimatePresence>
                {addModalOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => {
                                    if (!uploading) {
                                        setAddModalOpen(false)
                                        resetForm()
                                    }
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                disabled={uploading}
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-xl font-bold mb-6">Add New Category</h2>

                            {uploadSuccess ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                                    <h3 className="text-xl font-medium mb-2">Category Added!</h3>
                                    <p className="text-gray-400">Your category has been successfully created.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleAddCategory}>
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium mb-1">
                                            Category Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full bg-[#2a2a2a] border ${
                                                formErrors.name ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-orange-500"
                                            } rounded-lg p-2 text-white focus:outline-none focus:ring-2 transition-colors`}
                                            placeholder="e.g., Sushi Rolls"
                                            disabled={uploading}
                                            aria-invalid={formErrors.name ? "true" : "false"}
                                            aria-describedby={formErrors.name ? "name-error" : undefined}
                                        />
                                        {formErrors.name && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center" id="name-error">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 mr-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                    />
                                                </svg>
                                                {formErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className={`w-full bg-[#2a2a2a] border ${
                                                formErrors.description
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-700 focus:ring-orange-500"
                                            } rounded-lg p-2 text-white focus:outline-none focus:ring-2 transition-colors`}
                                            placeholder="Brief description of the category..."
                                            disabled={uploading}
                                            aria-invalid={formErrors.description ? "true" : "false"}
                                            aria-describedby={formErrors.description ? "description-error" : "description-hint"}
                                        />
                                        {formErrors.description ? (
                                            <p className="text-red-500 text-xs mt-1 flex items-center" id="description-error">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 mr-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                    />
                                                </svg>
                                                {formErrors.description}
                                            </p>
                                        ) : (
                                            <p className="text-gray-500 text-xs mt-1 flex items-center justify-between" id="description-hint">
                                                <span>Brief description of the category</span>
                                                <span className={formData.description.length > 180 ? "text-orange-500" : ""}>
                          {formData.description.length}/200 characters
                        </span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Category Image</label>
                                        {imagePreview ? (
                                            <div className="mb-3 relative">
                                                <div className="aspect-video rounded-lg overflow-hidden">
                                                    <img
                                                        src={imagePreview || "/placeholder.svg"}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {!uploading && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImageFile(null)
                                                            setImagePreview(null)
                                                            setFormData({
                                                                ...formData,
                                                                image: "",
                                                            })
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className={`mb-3 relative ${dragActive ? "border-orange-500 bg-orange-500/10" : ""}`}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                            >
                                                <label
                                                    htmlFor="category-image"
                                                    className={`block w-full aspect-video border-2 border-dashed ${
                                                        dragActive ? "border-orange-500" : "border-gray-600"
                                                    } rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors`}
                                                >
                                                    <Upload className="text-gray-400 mb-2" size={32} />
                                                    <p className="text-gray-400 text-center">
                                                        {dragActive ? "Drop your image here" : "Drag & drop or click to upload"}
                                                        <br />
                                                        <span className="text-sm">JPG, JPEG, PNG or WEBP</span>
                                                    </p>
                                                    <input
                                                        id="category-image"
                                                        type="file"
                                                        accept=".jpg,.jpeg,.png,.webp"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                        disabled={uploading}
                                                        ref={fileInputRef}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                        {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="isActive"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                                disabled={uploading}
                                            />
                                            <label htmlFor="isActive" className="text-sm">
                                                Active Category
                                            </label>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-1">Active categories will be visible to customers</p>
                                    </div>

                                    <div className="mb-4">
                                        {Object.keys(formErrors).length > 0 ? (
                                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-500">
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                        />
                                                    </svg>
                                                    <span>Please fix the errors above before submitting</span>
                                                </div>
                                            </div>
                                        ) : formData.name ? (
                                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-500">
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Form is valid and ready to submit</span>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>

                                    {uploading && (
                                        <div className="mb-6">
                                            <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500 transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                            <p className="text-center text-sm text-gray-400 mt-2">Saving category... {uploadProgress}%</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                                            Object.keys(formErrors).length > 0
                                                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                                                : "bg-orange-500 hover:bg-orange-600 text-white"
                                        } ${uploading ? "bg-gray-600 cursor-not-allowed" : ""}`}
                                        disabled={uploading || Object.keys(formErrors).length > 0}
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span>Creating Category...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus size={18} />
                                                <span>Create Category</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Update Category Modal */}
            <AnimatePresence>
                {updateModalOpen && selectedCategory && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={() => {
                                    if (!uploading) {
                                        setUpdateModalOpen(false)
                                        resetForm()
                                    }
                                }}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                disabled={uploading}
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-xl font-bold mb-6">Update Category</h2>

                            {uploadSuccess ? (
                                <div className="text-center py-8">
                                    <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                                    <h3 className="text-xl font-medium mb-2">Category Updated!</h3>
                                    <p className="text-gray-400">Your category has been successfully updated.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleUpdateCategory}>
                                    <div className="mb-4">
                                        <label htmlFor="update-name" className="block text-sm font-medium mb-1">
                                            Category Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="update-name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full bg-[#2a2a2a] border ${
                                                formErrors.name ? "border-red-500 focus:ring-red-500" : "border-gray-700 focus:ring-orange-500"
                                            } rounded-lg p-2 text-white focus:outline-none focus:ring-2 transition-colors`}
                                            placeholder="e.g., Sushi Rolls"
                                            disabled={uploading}
                                            aria-invalid={formErrors.name ? "true" : "false"}
                                            aria-describedby={formErrors.name ? "update-name-error" : undefined}
                                        />
                                        {formErrors.name && (
                                            <p className="text-red-500 text-xs mt-1 flex items-center" id="update-name-error">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 mr-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                    />
                                                </svg>
                                                {formErrors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="update-description" className="block text-sm font-medium mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            id="update-description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className={`w-full bg-[#2a2a2a] border ${
                                                formErrors.description
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-700 focus:ring-orange-500"
                                            } rounded-lg p-2 text-white focus:outline-none focus:ring-2 transition-colors`}
                                            placeholder="Brief description of the category..."
                                            disabled={uploading}
                                            aria-invalid={formErrors.description ? "true" : "false"}
                                            aria-describedby={formErrors.description ? "update-description-error" : "update-description-hint"}
                                        />
                                        {formErrors.description ? (
                                            <p className="text-red-500 text-xs mt-1 flex items-center" id="update-description-error">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-3 w-3 mr-1"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                    />
                                                </svg>
                                                {formErrors.description}
                                            </p>
                                        ) : (
                                            <p
                                                className="text-gray-500 text-xs mt-1 flex items-center justify-between"
                                                id="update-description-hint"
                                            >
                                                <span>Brief description of the category</span>
                                                <span className={formData.description.length > 180 ? "text-orange-500" : ""}>
                          {formData.description.length}/200 characters
                        </span>
                                            </p>
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-1">Category Image</label>
                                        {imagePreview ? (
                                            <div className="mb-3 relative">
                                                <div className="aspect-video rounded-lg overflow-hidden">
                                                    <img
                                                        src={imagePreview || "/placeholder.svg"}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {!uploading && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setImageFile(null)
                                                            setImagePreview(null)
                                                            setFormData({
                                                                ...formData,
                                                                image: "",
                                                            })
                                                        }}
                                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                className={`mb-3 relative ${dragActive ? "border-orange-500 bg-orange-500/10" : ""}`}
                                                onDragEnter={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDragOver={handleDrag}
                                                onDrop={handleDrop}
                                            >
                                                <label
                                                    htmlFor="update-category-image"
                                                    className={`block w-full aspect-video border-2 border-dashed ${
                                                        dragActive ? "border-orange-500" : "border-gray-600"
                                                    } rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 transition-colors`}
                                                >
                                                    <Upload className="text-gray-400 mb-2" size={32} />
                                                    <p className="text-gray-400 text-center">
                                                        {dragActive ? "Drop your image here" : "Drag & drop or click to upload"}
                                                        <br />
                                                        <span className="text-sm">JPG, JPEG, PNG or WEBP</span>
                                                    </p>
                                                    <input
                                                        id="update-category-image"
                                                        type="file"
                                                        accept=".jpg,.jpeg,.png,.webp"
                                                        className="hidden"
                                                        onChange={handleFileChange}
                                                        disabled={uploading}
                                                        ref={fileInputRef}
                                                    />
                                                </label>
                                            </div>
                                        )}
                                        {formErrors.image && <p className="text-red-500 text-xs mt-1">{formErrors.image}</p>}
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="update-isActive"
                                                name="isActive"
                                                checked={formData.isActive}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                                disabled={uploading}
                                            />
                                            <label htmlFor="update-isActive" className="text-sm">
                                                Active Category
                                            </label>
                                        </div>
                                        <p className="text-gray-500 text-xs mt-1">Active categories will be visible to customers</p>
                                    </div>

                                    <div className="mb-4 bg-[#2a2a2a] rounded-lg p-3">
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Created: {formatDate(selectedCategory.createdAt)}</span>
                                            {selectedCategory.updatedAt && (
                                                <span>Last Updated: {formatDate(selectedCategory.updatedAt)}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-gray-400">
                                            <RefreshCw size={12} />
                                            <span>Will update timestamp on save</span>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        {Object.keys(formErrors).length > 0 ? (
                                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-500">
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                        />
                                                    </svg>
                                                    <span>Please fix the errors above before submitting</span>
                                                </div>
                                            </div>
                                        ) : formData.name ? (
                                            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-500">
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-5 w-5"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    <span>Form is valid and ready to submit</span>
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>

                                    {uploading && (
                                        <div className="mb-6">
                                            <div className="h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-orange-500 transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                            <p className="text-center text-sm text-gray-400 mt-2">Updating category... {uploadProgress}%</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                                            Object.keys(formErrors).length > 0
                                                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                                                : "bg-orange-500 hover:bg-orange-600 text-white"
                                        } ${uploading ? "bg-gray-600 cursor-not-allowed" : ""}`}
                                        disabled={uploading || Object.keys(formErrors).length > 0}
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span>Updating Category...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check size={18} />
                                                <span>Update Category</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalOpen && selectedCategory && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md"
                        >
                            <h2 className="text-xl font-bold mb-2">Delete Category</h2>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete the "{selectedCategory.name}" category? This action cannot be undone.
                            </p>

                            <div className="mb-6 flex items-center">
                                <div className="w-16 h-16 rounded-lg overflow-hidden mr-4">
                                    <Image
                                        src={selectedCategory.image || "/placeholder.svg"}
                                        alt={selectedCategory.name}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium">{selectedCategory.name}</h3>
                                    <p className="text-gray-400 text-sm line-clamp-2">
                                        {selectedCategory.description || "No description"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteCategory}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Status Confirmation Modal */}
            <AnimatePresence>
                {statusModalOpen && selectedCategory && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md"
                        >
                            <div className="text-center mb-2">
                                {selectedCategory.isActive ? (
                                    <div className="w-16 h-16 rounded-full bg-red-500/20 mx-auto flex items-center justify-center text-red-500 mb-4">
                                        <EyeOff size={32} />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-green-500/20 mx-auto flex items-center justify-center text-green-500 mb-4">
                                        <Eye size={32} />
                                    </div>
                                )}
                                <h2 className="text-xl font-bold">
                                    {selectedCategory.isActive ? "Deactivate Category" : "Activate Category"}
                                </h2>
                            </div>

                            <p className="text-gray-400 mb-6 text-center">
                                Are you sure you want to {selectedCategory.isActive ? "deactivate" : "activate"} the "
                                {selectedCategory.name}" category?
                                {selectedCategory.isActive
                                    ? " This will hide it from customers."
                                    : " This will make it visible to customers."}
                            </p>

                            <div className="mb-6 bg-[#2a2a2a] rounded-lg p-4 flex items-center">
                                <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                                    <Image
                                        src={selectedCategory.image || "/placeholder.svg"}
                                        alt={selectedCategory.name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-medium">{selectedCategory.name}</h3>
                                    <div className="flex items-center mt-1">
                                        <div
                                            className={`${
                                                selectedCategory.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                                            } text-xs px-2 py-0.5 rounded-full flex items-center gap-1`}
                                        >
                                            {selectedCategory.isActive ? <Eye size={10} /> : <EyeOff size={10} />}
                                            <span>Currently {selectedCategory.isActive ? "Active" : "Inactive"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setStatusModalOpen(false)}
                                    className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={toggleCategoryStatus}
                                    className={`flex-1 ${
                                        selectedCategory.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                    } text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2`}
                                >
                                    {selectedCategory.isActive ? (
                                        <>
                                            <EyeOff size={18} />
                                            <span>Deactivate</span>
                                        </>
                                    ) : (
                                        <>
                                            <Eye size={18} />
                                            <span>Activate</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add CSS for animation */}
            <style jsx global>{`
        @keyframes pulse-border {
          0% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
          }
        }
        
        .animate-pulse-border {
          animation: pulse-border 2s ease-out;
        }
      `}</style>
        </div>
    )
}