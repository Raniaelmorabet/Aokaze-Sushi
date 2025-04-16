"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Trash2,
    CheckCircle,
    X,
    Loader2,
    MessageSquare,
    Check,
    AlertTriangle,
    Clock,
    Filter,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react"
import Image from "next/image"

// Sample testimonials data
const sampleTestimonials = [
    {
        _id: "1",
        user: {
            name: "Emma Thompson",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
        },
        title: "Amazing Sushi Experience",
        comment:
            "The dragon roll was absolutely divine! The freshness of the fish and the perfect balance of flavors made it an unforgettable dining experience. The staff was also incredibly attentive and friendly.",
        rate: 5,
        status: "accepted",
        date: "2023-11-15T12:00:00Z",
    },
    {
        _id: "2",
        user: {
            name: "Michael Chen",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop",
        },
        title: "Great Food, Slow Service",
        comment:
            "The sushi was excellent, especially the spicy tuna roll. However, the service was a bit slow during peak hours. Would still recommend for the quality of food alone.",
        rate: 4,
        status: "accepted",
        date: "2023-10-22T15:30:00Z",
    },
    {
        _id: "3",
        user: {
            name: "Sophia Rodriguez",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1887&auto=format&fit=crop",
        },
        title: "Best Sushi in Town!",
        comment:
            "I've tried many sushi restaurants in the area, and this one tops them all! The chef's special rolls are innovative and delicious. The ambiance is also perfect for both casual dining and special occasions.",
        rate: 5,
        status: "accepted",
        date: "2023-12-05T18:45:00Z",
    },
    {
        _id: "4",
        user: {
            name: "David Wilson",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop",
        },
        title: "Disappointing Experience",
        comment:
            "The sushi rice was overcooked and the fish didn't taste fresh. The restaurant was also very noisy. I expected better quality for the price.",
        rate: 2,
        status: "rejected",
        date: "2023-09-18T14:20:00Z",
    },
    {
        _id: "5",
        user: {
            name: "Olivia Johnson",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop",
        },
        title: "Excellent Vegetarian Options",
        comment:
            "As a vegetarian, I often struggle at sushi restaurants, but not here! They have an amazing selection of vegetarian rolls that are creative and delicious. The avocado tempura roll is a must-try!",
        rate: 5,
        status: "pending",
        date: "2023-11-30T11:15:00Z",
    },
    {
        _id: "6",
        user: {
            name: "James Lee",
            image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=1899&auto=format&fit=crop",
        },
        title: "Great Date Night Spot",
        comment:
            "Took my wife here for our anniversary and we had a wonderful time. The intimate lighting and delicious food made for a perfect evening. The sake selection is also impressive!",
        rate: 5,
        status: "pending",
        date: "2023-10-10T16:40:00Z",
    },
    {
        _id: "7",
        user: {
            name: "Aiden Taylor",
            image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1887&auto=format&fit=crop",
        },
        title: "Overpriced for What You Get",
        comment:
            "While the sushi was decent, I found it to be overpriced compared to other places with similar quality. The portions were also smaller than expected.",
        rate: 3,
        status: "pending",
        date: "2023-12-12T13:25:00Z",
    },
    {
        _id: "8",
        user: {
            name: "Isabella Martinez",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
        },
        title: "Authentic Japanese Experience",
        comment:
            "Having lived in Japan for several years, I can confidently say this restaurant offers an authentic experience. The attention to detail in both food preparation and presentation is impressive.",
        rate: 5,
        status: "accepted",
        date: "2023-11-05T19:10:00Z",
    },
    {
        _id: "9",
        user: {
            name: "Noah Garcia",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
        },
        title: "Great for Groups",
        comment:
            "Came here with a large group and they accommodated us perfectly. The boat platters are perfect for sharing and trying different things. Everyone in our party was impressed!",
        rate: 4,
        status: "pending",
        date: "2023-10-28T10:50:00Z",
    },
]

export default function TestimonialManagement() {
    const [testimonials, setTestimonials] = useState(sampleTestimonials)
    const [loading, setLoading] = useState(false)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [previewModalOpen, setPreviewModalOpen] = useState(false)
    const [statusModalOpen, setStatusModalOpen] = useState(false)
    const [selectedTestimonial, setSelectedTestimonial] = useState(null)
    const [selectedTab, setSelectedTab] = useState("all")
    const [activeTestimonial, setActiveTestimonial] = useState(0)
    const [filterOpen, setFilterOpen] = useState(false)
    const [sortBy, setSortBy] = useState("date")
    const [sortOrder, setSortOrder] = useState("desc")

    // Fetch testimonials
    const fetchTestimonials = async () => {
        setLoading(true)
        try {
            // In a real app, you would fetch from API
            // For demo, we'll use the sample data
            setTimeout(() => {
                setTestimonials(sampleTestimonials)
                setLoading(false)
            }, 800)
        } catch (error) {
            console.error("Error fetching testimonials:", error)
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTestimonials()
    }, [])

    // Filter testimonials based on tab
    const filteredTestimonials = testimonials
        .filter((testimonial) => {
            if (selectedTab === "all") return true
            return testimonial.status === selectedTab
        })
        .sort((a, b) => {
            // Sort by selected field
            if (sortBy === "date") {
                return sortOrder === "desc"
                    ? new Date(b.date).getTime() - new Date(a.date).getTime()
                    : new Date(a.date).getTime() - new Date(b.date).getTime()
            } else if (sortBy === "rating") {
                return sortOrder === "desc" ? b.rate - a.rate : a.rate - b.rate
            }
            return 0
        })

    // Handle testimonial delete
    const handleDelete = async () => {
        try {
            // For demo, we'll update our local state
            setTestimonials(testimonials.filter((t) => t._id !== selectedTestimonial._id))
            setDeleteModalOpen(false)
        } catch (error) {
            console.error("Error deleting testimonial:", error)
        }
    }

    // Handle status change
    const handleStatusChange = (status) => {
        try {
            // For demo, we'll update our local state
            const updatedTestimonials = testimonials.map((t) => (t._id === selectedTestimonial._id ? { ...t, status } : t))
            setTestimonials(updatedTestimonials)
            setStatusModalOpen(false)
        } catch (error) {
            console.error("Error updating testimonial status:", error)
        }
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    // Open delete confirmation modal
    const openDeleteModal = (testimonial) => {
        setSelectedTestimonial(testimonial)
        setDeleteModalOpen(true)
    }

    // Open preview modal
    const openPreviewModal = (testimonial, index) => {
        setSelectedTestimonial(testimonial)
        setActiveTestimonial(index)
        setPreviewModalOpen(true)
    }

    // Open status change modal
    const openStatusModal = (testimonial) => {
        setSelectedTestimonial(testimonial)
        setStatusModalOpen(true)
    }

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case "accepted":
                return "bg-green-500"
            case "rejected":
                return "bg-red-500"
            case "pending":
                return "bg-yellow-500"
            default:
                return "bg-gray-500"
        }
    }

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case "accepted":
                return <Check size={16} />
            case "rejected":
                return <X size={16} />
            case "pending":
                return <Clock size={16} />
            default:
                return null
        }
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
                    <h1 className="text-3xl font-bold mb-2">Testimonial Management</h1>
                    <p className="text-gray-400">Review, approve, and manage customer testimonials</p>
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
                        <span>Sort & Filter</span>
                    </motion.button>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-medium mb-3">Sort By</h3>
                                <div className="space-y-2 mb-4">
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
                                            Date
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="sort-rating"
                                            name="sort"
                                            className="mr-2"
                                            checked={sortBy === "rating"}
                                            onChange={() => setSortBy("rating")}
                                        />
                                        <label htmlFor="sort-rating" className="text-sm">
                                            Rating
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-medium mb-3">Order</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <button
                                        className={`px-3 py-1 text-sm rounded ${
                                            sortOrder === "desc" ? "bg-orange-500 text-white" : "bg-[#3a3a3a] text-gray-300"
                                        }`}
                                        onClick={() => setSortOrder("desc")}
                                    >
                                        Descending
                                    </button>
                                    <button
                                        className={`px-3 py-1 text-sm rounded ${
                                            sortOrder === "asc" ? "bg-orange-500 text-white" : "bg-[#3a3a3a] text-gray-300"
                                        }`}
                                        onClick={() => setSortOrder("asc")}
                                    >
                                        Ascending
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tabs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex mb-6 border-b border-gray-800"
            >
                <button
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                        selectedTab === "all" ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setSelectedTab("all")}
                >
                    All Testimonials
                    {selectedTab === "all" && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                            initial={false}
                        />
                    )}
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                        selectedTab === "pending" ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setSelectedTab("pending")}
                >
                    Pending
                    {selectedTab === "pending" && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                            initial={false}
                        />
                    )}
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                        selectedTab === "accepted" ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setSelectedTab("accepted")}
                >
                    Accepted
                    {selectedTab === "accepted" && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                            initial={false}
                        />
                    )}
                </button>
                <button
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${
                        selectedTab === "rejected" ? "text-white" : "text-gray-400 hover:text-white"
                    }`}
                    onClick={() => setSelectedTab("rejected")}
                >
                    Rejected
                    {selectedTab === "rejected" && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                            initial={false}
                        />
                    )}
                </button>
            </motion.div>

            {/* Stats */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            >
                <div className="bg-[#1E1E1E] rounded-xl p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 mr-4">
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Testimonials</p>
                        <p className="text-2xl font-bold">{testimonials.length}</p>
                    </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-xl p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 mr-4">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Accepted</p>
                        <p className="text-2xl font-bold">{testimonials.filter((t) => t.status === "accepted").length}</p>
                    </div>
                </div>

                <div className="bg-[#1E1E1E] rounded-xl p-4 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500 mr-4">
                        <Clock size={24} />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Pending Review</p>
                        <p className="text-2xl font-bold">{testimonials.filter((t) => t.status === "pending").length}</p>
                    </div>
                </div>
            </motion.div>

            {/* Testimonials Grid */}
            {loading ? (
                <div className="flex flex-col justify-center items-center h-64">
                    <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
                    <p className="text-gray-400">Loading testimonials...</p>
                </div>
            ) : filteredTestimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredTestimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                layout
                                className="bg-[#1E1E1E] rounded-xl overflow-hidden shadow-md group"
                            >
                                <div className="p-6 relative">
                                    {/* Status Badge */}
                                    <div
                                        className={`absolute top-3 right-3 ${getStatusColor(
                                            testimonial.status,
                                        )} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1`}
                                    >
                                        {getStatusIcon(testimonial.status)}
                                        <span className="capitalize">{testimonial.status}</span>
                                    </div>

                                    {/* User Info */}
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                                            <Image
                                                src={testimonial.user?.image || "/placeholder.svg"}
                                                alt={testimonial.user?.name || "User"}
                                                width={48}
                                                height={48}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{testimonial.user?.name}</h3>
                                            <p className="text-gray-400 text-sm">{formatDate(testimonial.date)}</p>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill={star <= Math.floor(testimonial.rate) ? "#facc15" : "none"}
                                                stroke="#facc15"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        ))}
                                    </div>

                                    {/* Title */}
                                    <h4 className="font-medium text-lg mb-2">{testimonial.title}</h4>

                                    {/* Comment (truncated) */}
                                    <p className="text-gray-400 mb-4 line-clamp-3">"{testimonial.comment}"</p>

                                    {/* Actions */}
                                    <div className="flex justify-between">
                                        <button
                                            onClick={() => openPreviewModal(testimonial, index)}
                                            className="bg-[#F05B29] text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
                                        >
                                            View Details
                                        </button>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openStatusModal(testimonial)}
                                                className="bg-[#333333] text-white p-1.5 rounded-lg transition-colors"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(testimonial)}
                                                className="bg-[#333333] text-[#EF4444] p-1.5 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="bg-[#1E1E1E] rounded-xl p-12 text-center">
                    <MessageSquare className="mx-auto text-gray-600 mb-4" size={48} />
                    <h3 className="text-xl font-medium mb-2">No testimonials found</h3>
                    <p className="text-gray-400 mb-6">
                        {selectedTab === "pending"
                            ? "No pending testimonials to review."
                            : selectedTab === "accepted"
                                ? "No accepted testimonials found."
                                : selectedTab === "rejected"
                                    ? "No rejected testimonials found."
                                    : "No testimonials have been submitted yet."}
                    </p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteModalOpen && selectedTestimonial && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md"
                        >
                            <h2 className="text-xl font-bold mb-2">Delete Testimonial</h2>
                            <p className="text-gray-400 mb-6">
                                Are you sure you want to delete this testimonial? This action cannot be undone.
                            </p>

                            <div className="mb-6">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                        <Image
                                            src={selectedTestimonial.user?.image || "/placeholder.svg"}
                                            alt={selectedTestimonial.user?.name || "User"}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{selectedTestimonial.user?.name}</h3>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <svg
                                                    key={star}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="12"
                                                    height="12"
                                                    viewBox="0 0 24 24"
                                                    fill={star <= Math.floor(selectedTestimonial.rate) ? "#facc15" : "none"}
                                                    stroke="#facc15"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                                </svg>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 italic">"{selectedTestimonial.comment}"</p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Status Change Modal */}
            <AnimatePresence>
                {statusModalOpen && selectedTestimonial && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md"
                        >
                            <h2 className="text-xl font-bold mb-2">Update Testimonial Status</h2>
                            <p className="text-gray-400 mb-6">Change the status of this testimonial.</p>

                            <div className="mb-6">
                                <div className="flex items-center mb-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                                        <Image
                                            src={selectedTestimonial.user?.image || "/placeholder.svg"}
                                            alt={selectedTestimonial.user?.name || "User"}
                                            width={40}
                                            height={40}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{selectedTestimonial.user?.name}</h3>
                                        <p className="text-sm text-gray-400">
                                            Current status:{" "}
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-xs ${
                                                    selectedTestimonial.status === "accepted"
                                                        ? "bg-green-500/20 text-green-400"
                                                        : selectedTestimonial.status === "rejected"
                                                            ? "bg-red-500/20 text-red-400"
                                                            : "bg-yellow-500/20 text-yellow-400"
                                                }`}
                                            >
                        {selectedTestimonial.status}
                      </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-6">
                                <button
                                    onClick={() => handleStatusChange("accepted")}
                                    className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                                        selectedTestimonial.status === "accepted"
                                            ? "bg-green-500 text-white"
                                            : "bg-[#2a2a2a] hover:bg-green-500/20 hover:text-green-400"
                                    }`}
                                >
                                    <CheckCircle size={20} />
                                    <span>Accept Testimonial</span>
                                </button>

                                <button
                                    onClick={() => handleStatusChange("pending")}
                                    className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                                        selectedTestimonial.status === "pending"
                                            ? "bg-yellow-500 text-white"
                                            : "bg-[#2a2a2a] hover:bg-yellow-500/20 hover:text-yellow-400"
                                    }`}
                                >
                                    <Clock size={20} />
                                    <span>Mark as Pending</span>
                                </button>

                                <button
                                    onClick={() => handleStatusChange("rejected")}
                                    className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                                        selectedTestimonial.status === "rejected"
                                            ? "bg-red-500 text-white"
                                            : "bg-[#2a2a2a] hover:bg-red-500/20 hover:text-red-400"
                                    }`}
                                >
                                    <AlertTriangle size={20} />
                                    <span>Reject Testimonial</span>
                                </button>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    onClick={() => setStatusModalOpen(false)}
                                    className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <AnimatePresence>
                {previewModalOpen && selectedTestimonial && (
                    <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-4xl"
                        >
                            <button
                                onClick={() => setPreviewModalOpen(false)}
                                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>

                            <div className="relative max-w-4xl mx-auto">
                                <motion.div
                                    key={activeTestimonial}
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ duration: 0.5 }}
                                    className="bg-[#1E1E1E] rounded-xl px-8 pt-6 md:pt-8 shadow-xl"
                                >
                                    <div className="w-full flex flex-col justify-center items-center gap-4 -translate-y-14">
                                        <div className="w-16 h-16 rounded-full overflow-hidden">
                                            <Image
                                                src={filteredTestimonials[activeTestimonial].user?.image || "/placeholder.svg"}
                                                alt={filteredTestimonials[activeTestimonial].user?.name}
                                                width={100}
                                                height={100}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-center">
                                                {filteredTestimonials[activeTestimonial].user?.name}
                                            </p>
                                            <div
                                                className={`mx-auto mt-1 ${getStatusColor(
                                                    filteredTestimonials[activeTestimonial].status,
                                                )} text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 justify-center w-fit`}
                                            >
                                                {getStatusIcon(filteredTestimonials[activeTestimonial].status)}
                                                <span className="capitalize">{filteredTestimonials[activeTestimonial].status}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Stars */}
                                    <div className="flex justify-center -translate-y-12 gap-1 mb-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <svg
                                                key={star}
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill={star <= Math.floor(filteredTestimonials[activeTestimonial].rate) ? "#facc15" : "none"}
                                                stroke="#facc15"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                            </svg>
                                        ))}
                                    </div>
                                    <h4 className="font-medium text-xl -translate-y-10 mb-4 text-center px-4">
                                        {filteredTestimonials[activeTestimonial].title}
                                    </h4>
                                    <p className="text-gray-400 text-lg -translate-y-12 mb-8 text-center px-4">
                                        "{filteredTestimonials[activeTestimonial].comment}"
                                    </p>
                                </motion.div>

                                <button
                                    onClick={() =>
                                        setActiveTestimonial((prev) => (prev === 0 ? filteredTestimonials.length - 1 : prev - 1))
                                    }
                                    className="absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-6 md:-left-8 bg-[#F05B29] rounded-full p-3 hover:bg-orange-500 transition-colors duration-300 z-10"
                                >
                                    <ChevronLeft size={24} />
                                </button>

                                <button
                                    onClick={() =>
                                        setActiveTestimonial((prev) => (prev === filteredTestimonials.length - 1 ? 0 : prev + 1))
                                    }
                                    className="absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-6 md:-right-8 bg-[#F05B29] rounded-full p-3 hover:bg-orange-500 transition-colors duration-300 z-10"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </div>

                            <div className="flex justify-center mt-8 gap-4">
                                <button
                                    onClick={() => {
                                        openStatusModal(filteredTestimonials[activeTestimonial])
                                        setPreviewModalOpen(false)
                                    }}
                                    className="bg-[#F05B29] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <MoreHorizontal size={18} />
                                    <span>Change Status</span>
                                </button>
                                <button
                                    onClick={() => {
                                        openDeleteModal(filteredTestimonials[activeTestimonial])
                                        setPreviewModalOpen(false)
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 size={18} />
                                    <span>Delete</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}