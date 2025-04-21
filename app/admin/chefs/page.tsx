"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search,
    Plus,
    Edit,
    Trash2,
    X,
    Award,
    ChefHat,
    Star,
    Filter,
    SortAsc,
    SortDesc,
    Upload,
    AlertCircle,
    CheckCircle2,
} from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for chefs
const SAMPLE_CHEFS = [
    {
        id: "1",
        name: "Marco Rossi",
        title: "Executive Chef",
        image:
            "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=3537&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        bio: "With over 20 years of experience in Italian cuisine, Chef Marco brings authentic flavors from his hometown in Naples to every dish he creates.",
        specialties: ["Italian Cuisine", "Pasta Making", "Wood-fired Pizza"],
        awards: ["Michelin Star 2019", "Best Chef Award 2021", "Culinary Excellence 2022"],
    },
    {
        id: "2",
        name: "Sophia Chen",
        title: "Head Chef",
        image:
            "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        bio: "Chef Sophia specializes in fusion cuisine, blending Asian techniques with Mediterranean ingredients to create unique culinary experiences.",
        specialties: ["Asian Fusion", "Seafood", "Molecular Gastronomy"],
        awards: ["Rising Star Chef 2020", "Innovation in Cuisine 2022"],
    },
    {
        id: "3",
        name: "James Wilson",
        title: "Pastry Chef",
        image:
            "https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        bio: "Specializing in French pastry techniques, Chef James creates desserts that are as visually stunning as they are delicious.",
        specialties: ["French Pastry", "Chocolate Work", "Wedding Cakes"],
        awards: ["Best Pastry Chef 2021", "Dessert Masters Champion 2019"],
    },
    {
        id: "4",
        name: "Amara Johnson",
        title: "Sous Chef",
        image:
            "https://images.unsplash.com/photo-1607631568010-a87245c0dbd8?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        bio: "Chef Amara brings a fresh perspective to traditional Southern cuisine, incorporating modern techniques while honoring classic flavors.",
        specialties: ["Southern Cuisine", "Farm-to-Table", "Barbecue"],
        awards: ["Southern Cuisine Innovator 2022", "Local Food Champion 2021"],
    },
]

export default function ChefsManagement() {
    const { toast } = useToast()
    const [chefs, setChefs] = useState(SAMPLE_CHEFS)
    const [showChef, setShowChef] = useState([])
    const [filteredChefs, setFilteredChefs] = useState(SAMPLE_CHEFS)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [selectedChef, setSelectedChef] = useState(null)
    const [sortOrder, setSortOrder] = useState("asc")
    const [sortField, setSortField] = useState("name")
    const [newChef, setNewChef] = useState({
        name: "",
        title: "",
        image: "",
        bio: "",
        specialties: [],
        awards: [],
    })
    const [newSpecialty, setNewSpecialty] = useState("")
    const [newAward, setNewAward] = useState("")
    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState("")
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef(null)
    const [activeInfo, setActiveInfo] = useState("basic")

    // Validation function
    const validateChef = (chef) => {
        const errors = {}

        if (!chef.name.trim()) {
            errors.name = "Chef name is required"
        } else if (chef.name.length < 2) {
            errors.name = "Name must be at least 2 characters"
        } else if (chef.name.length > 50) {
            errors.name = "Name cannot exceed 50 characters"
        }

        if (!chef.title.trim()) {
            errors.title = "Title is required"
        } else if (chef.title.length > 50) {
            errors.title = "Title cannot exceed 50 characters"
        }

        if (!chef.bio.trim()) {
            errors.bio = "Bio is required"
        } else if (chef.bio.length > 300) {
            errors.bio = "Bio cannot exceed 300 characters"
        }

        if (chef.specialties.length === 0) {
            errors.specialties = "At least one specialty is required"
        }

        return errors
    }

    // Filter chefs based on search query
    useEffect(() => {
        const filtered = chefs.filter(
            (chef) =>
                chef.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chef.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chef.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                chef.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
                chef.awards.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())),
        )

        // Sort the filtered chefs
        const sorted = [...filtered].sort((a, b) => {
            if (sortField === "name") {
                return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
            } else if (sortField === "title") {
                return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
            }
            return 0
        })

        setFilteredChefs(sorted)
    }, [chefs, searchQuery, sortOrder, sortField])

    // Handle adding a new chef
    const handleAddChef = () => {
        const validationErrors = validateChef(newChef)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const newId = (Math.max(...chefs.map((c) => Number.parseInt(c.id))) + 1).toString()
        const chefToAdd = { ...newChef, id: newId }

        setChefs([...chefs, chefToAdd])
        setIsAddModalOpen(false)
        setNewChef({
            name: "",
            title: "",
            image: "",
            bio: "",
            specialties: [],
            awards: [],
        })
        setErrors({})

        toast({
            title: "Chef Added Successfully",
            description: `${chefToAdd.name} has been added to the team.`,
            variant: "success",
        })
    }

    // Handle updating a chef
    const handleUpdateChef = () => {
        const validationErrors = validateChef(selectedChef)

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        const updatedChefs = chefs.map((chef) => (chef.id === selectedChef.id ? selectedChef : chef))

        setChefs(updatedChefs)
        setIsUpdateModalOpen(false)
        setSelectedChef(null)
        setErrors({})

        toast({
            title: "Chef Updated Successfully",
            description: `${selectedChef.name}'s information has been updated.`,
            variant: "success",
        })
    }

    // Handle deleting a chef
    const handleDeleteChef = () => {
        const updatedChefs = chefs.filter((chef) => chef.id !== selectedChef.id)
        const chefName = selectedChef.name

        setChefs(updatedChefs)
        setIsDeleteModalOpen(false)
        setSelectedChef(null)

        toast({
            title: "Chef Removed",
            description: `${chefName} has been removed from the team.`,
            variant: "destructive",
        })
    }

    // Handle adding a specialty
    const handleAddSpecialty = () => {
        if (!newSpecialty.trim()) return

        if (isUpdateModalOpen && selectedChef) {
            if (!selectedChef.specialties.includes(newSpecialty)) {
                setSelectedChef({
                    ...selectedChef,
                    specialties: [...selectedChef.specialties, newSpecialty],
                })
            }
        } else {
            if (!newChef.specialties.includes(newSpecialty)) {
                setNewChef({
                    ...newChef,
                    specialties: [...newChef.specialties, newSpecialty],
                })
            }
        }

        setNewSpecialty("")
    }

    // Handle removing a specialty
    const handleRemoveSpecialty = (specialty) => {
        if (isUpdateModalOpen && selectedChef) {
            setSelectedChef({
                ...selectedChef,
                specialties: selectedChef.specialties.filter((s) => s !== specialty),
            })
        } else {
            setNewChef({
                ...newChef,
                specialties: newChef.specialties.filter((s) => s !== specialty),
            })
        }
    }

    // Handle adding an award
    const handleAddAward = () => {
        if (!newAward.trim()) return

        if (isUpdateModalOpen && selectedChef) {
            if (!selectedChef.awards.includes(newAward)) {
                setSelectedChef({
                    ...selectedChef,
                    awards: [...selectedChef.awards, newAward],
                })
            }
        } else {
            if (!newChef.awards.includes(newAward)) {
                setNewChef({
                    ...newChef,
                    awards: [...newChef.awards, newAward],
                })
            }
        }

        setNewAward("")
    }

    // Handle removing an award
    const handleRemoveAward = (award) => {
        if (isUpdateModalOpen && selectedChef) {
            setSelectedChef({
                ...selectedChef,
                awards: selectedChef.awards.filter((a) => a !== award),
            })
        } else {
            setNewChef({
                ...newChef,
                awards: newChef.awards.filter((a) => a !== award),
            })
        }
    }

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file) return

        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
        if (!validTypes.includes(file.type)) {
            setErrors({
                ...errors,
                image: "Please upload a valid image file (JPG, PNG, or WEBP)",
            })
            return
        }

        setIsUploading(true)

        // Simulate upload delay
        setTimeout(() => {
            // Create a fake URL for demo purposes
            const fakeUrl = URL.createObjectURL(file)

            if (isUpdateModalOpen && selectedChef) {
                setSelectedChef({
                    ...selectedChef,
                    image: fakeUrl,
                })
            } else {
                setNewChef({
                    ...newChef,
                    image: fakeUrl,
                })
            }

            setIsUploading(false)
            setErrors({
                ...errors,
                image: null,
            })
        }, 1500)
    }

    // Reset form when closing modals
    const handleCloseAddModal = () => {
        setIsAddModalOpen(false)
        setActiveInfo("basic")
        setNewChef({
            name: "",
            title: "",
            image: "",
            bio: "",
            specialties: [],
            awards: [],
        })
        setErrors({})
    }

    const handleCloseUpdateModal = () => {
        setIsUpdateModalOpen(false)
        setSelectedChef(null)
        setActiveInfo("basic")
        setErrors({})
    }

    const getChef = async () => {
        const token = localStorage.getItem("token")
        try {
            const response = await fetch("https://aokaze-sushi.vercel.app/api/chefs", {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            })
            const data = await response.json()
            console.log(data)
            setShowChef(data.data)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getChef()
    }, []);

    return (
        <div className="p-6 space-y-6 bg-[#121212] text-white min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Chef Management</h1>
                    <p className="text-gray-400">Manage your culinary team</p>
                </div>

                <Button onClick={() => setIsAddModalOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Chef
                </Button>
            </div>

            {successMessage && (
                <Alert className="bg-green-900/20 border-green-500 text-green-300 mb-4">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                        <ChefHat className="mr-2 h-4 w-4 text-orange-500" />
                        Total Chefs
                    </h3>
                    <p className="text-3xl font-bold">{showChef.length}</p>
                </div>

                <div className="bg-[#1A1A1A] p-4 rounded-lg">
                    <h3 className="font-medium mb-2 flex items-center">
                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        Award-Winning Chefs
                    </h3>
                    <p className="text-3xl font-bold">{chefs.filter((chef) => chef.awards.length > 0).length}</p>
                </div>
            </div>

            <div className="bg-[#1A1A1A] rounded-lg p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search chefs by name, title, specialties..."
                            className="pl-10 bg-[#252525] border-[#333] text-white"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="border-[#333] text-gray-300 hover:bg-[#252525]"
                            onClick={() => {
                                setSortField("name")
                                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                            }}
                        >
                            {sortOrder === "asc" ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
                            {sortField === "name" ? "Name" : "Title"}
                        </Button>

                        <Button
                            variant="outline"
                            className="border-[#333] text-gray-300 hover:bg-[#252525]"
                            onClick={() => setSortField(sortField === "name" ? "title" : "name")}
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Sort by {sortField === "name" ? "Title" : "Name"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {showChef.map((chef, index) => (
                        <motion.div
                            key={chef._id}
                            className="bg-[#1E1E1E] rounded-xl overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <div className="relative h-80 overflow-hidden">
                                <Image
                                    src={chef.image || "/placeholder.svg?height=600&width=400"}
                                    alt={chef.name}
                                    width={400}
                                    height={600}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <h3 className="text-xl font-bold">{chef.name}</h3>
                                    <p className="text-orange-500">{chef.title}</p>
                                </div>
                            </div>

                            <div className="p-4">
                                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{chef.description}</p>

                                <div className="mb-4">
                                    <p className="text-sm font-medium mb-2">Specialties:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {chef.specialties.map((specialty, i) => (
                                            <span key={i} className="bg-[#2a2a2a] text-xs px-2 py-1 rounded-full">
                        {specialty}
                      </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium mb-2">Awards:</p>
                                    <div className="space-y-2">
                                        {chef.awards.map((award, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <Award size={14} className="text-yellow-400" />
                                                <span className="text-xs">{award}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#333]">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-[#333] hover:bg-[#252525] transition-colors"
                                        onClick={() => {
                                            setSelectedChef(chef)
                                            setIsUpdateModalOpen(true)
                                        }}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            setSelectedChef(chef)
                                            setIsDeleteModalOpen(true)
                                        }}
                                        className="hover:none transition-colors border-[#333]"
                                    >
                                        <Trash2 className="h-4 w-4 text-[#EF4444]" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredChefs.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                        <ChefHat className="h-16 w-16 text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium mb-2">No chefs found</h3>
                        <p className="text-gray-400 mb-4">
                            {searchQuery ? "Try a different search term" : "Add your first chef to get started"}
                        </p>
                        {searchQuery && (
                            <Button variant="outline" onClick={() => setSearchQuery("")} className="border-[#333] hover:bg-[#252525]">
                                Clear Search
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Add Chef Modal */}
            <Dialog open={isAddModalOpen} onOpenChange={handleCloseAddModal}>
                <DialogContent className="bg-[#1A1A1A] text-white border-[#333] max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center">
                            <ChefHat className="mr-2 h-5 w-5 text-orange-500" />
                            Add New Chef
                        </DialogTitle>
                    </DialogHeader>

                    <Tabs defaultValue={activeInfo} onValueChange={setActiveInfo} className="mt-4">
                        <TabsList className="bg-[#252525]">
                            <TabsTrigger className={`${activeInfo === 'basic' ? '!bg-white !text-black' : ''}`} value="basic">Basic Info</TabsTrigger>
                            <TabsTrigger className={`${activeInfo === 'specialties' ? '!bg-white !text-black' : ''}`} value="specialties">Specialties</TabsTrigger>
                            <TabsTrigger className={`${activeInfo === 'awards' ? '!bg-white !text-black' : ''}`} value="awards">Awards</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Chef Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Enter chef name"
                                    className={`bg-[#252525] border-[#333] ${errors.name ? "border-red-500" : ""}`}
                                    value={newChef.name}
                                    onChange={(e) => {
                                        setNewChef({ ...newChef, name: e.target.value })
                                        if (errors.name) {
                                            const { name, ...rest } = errors
                                            setErrors(rest)
                                        }x
                                    }}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm flex items-center mt-1">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Title <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Executive Chef, Pastry Chef"
                                    className={`bg-[#252525] border-[#333] ${errors.title ? "border-red-500" : ""}`}
                                    value={newChef.title}
                                    onChange={(e) => {
                                        setNewChef({ ...newChef, title: e.target.value })
                                        if (errors.title) {
                                            const { title, ...rest } = errors
                                            setErrors(rest)
                                        }
                                    }}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-sm flex items-center mt-1">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.title}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">
                                    Biography <span className="text-red-500">*</span>
                                </Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Write a short bio about the chef"
                                    className={`bg-[#252525] border-[#333] min-h-[100px] ${errors.bio ? "border-red-500" : ""}`}
                                    value={newChef.bio}
                                    onChange={(e) => {
                                        setNewChef({ ...newChef, bio: e.target.value })
                                        if (errors.bio) {
                                            const { bio, ...rest } = errors
                                            setErrors(rest)
                                        }
                                    }}
                                />
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>{newChef.bio.length} characters</span>
                                    <span>Max 300 characters</span>
                                </div>
                                {errors.bio && (
                                    <p className="text-red-500 text-sm flex items-center mt-1">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.bio}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Chef Image</Label>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-20 w-20 rounded-md overflow-hidden bg-[#252525] border border-[#333]">
                                        {newChef.image ? (
                                            <Image
                                                src={newChef.image || "/placeholder.svg"}
                                                alt="Chef preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full">
                                                <ChefHat className="h-8 w-8 text-gray-500" />
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
                                                    {newChef.image ? "Change Image" : "Upload Image"}
                                                </>
                                            )}
                                        </Button>
                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP (max. 2MB)</p>
                                    </div>
                                </div>
                                {errors.image && (
                                    <p className="text-red-500 text-sm flex items-center mt-1">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.image}
                                    </p>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="specialties" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="specialties">
                                    Specialties <span className="text-red-500">*</span>
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="specialties"
                                        placeholder="e.g. Italian Cuisine, Pasta Making"
                                        className="bg-[#252525] border-[#333]"
                                        value={newSpecialty}
                                        onChange={(e) => setNewSpecialty(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddSpecialty()
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={handleAddSpecialty} className="bg-orange-600 hover:bg-orange-700">
                                        Add
                                    </Button>
                                </div>

                                {errors.specialties && (
                                    <p className="text-red-500 text-sm flex items-center mt-1">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {errors.specialties}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-2 mt-3">
                                    {newChef.specialties.map((specialty, index) => (
                                        <Badge key={index} className="bg-[#252525] hover:bg-[#303030] text-white">
                                            {specialty}
                                            <button
                                                type="button"
                                                className="ml-1 text-gray-400 hover:text-white"
                                                onClick={() => handleRemoveSpecialty(specialty)}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}

                                    {newChef.specialties.length === 0 && (
                                        <p className="text-sm text-gray-400 italic">
                                            No specialties added yet. Add at least one specialty.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="awards" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="awards">Awards & Recognitions</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="awards"
                                        placeholder="e.g. Michelin Star 2022"
                                        className="bg-[#252525] border-[#333]"
                                        value={newAward}
                                        onChange={(e) => setNewAward(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleAddAward()
                                            }
                                        }}
                                    />
                                    <Button type="button" onClick={handleAddAward} className="bg-orange-600 hover:bg-orange-700">
                                        Add
                                    </Button>
                                </div>

                                <div className="flex flex-col gap-2 mt-3">
                                    {newChef.awards.map((award, index) => (
                                        <div key={index} className="flex items-center justify-between bg-[#252525] p-2 rounded-md">
                                            <div className="flex items-center">
                                                <Award className="h-4 w-4 text-yellow-400 mr-2" />
                                                <span>{award}</span>
                                            </div>
                                            <button
                                                type="button"
                                                className="text-gray-400 hover:text-white"
                                                onClick={() => handleRemoveAward(award)}
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}

                                    {newChef.awards.length === 0 && <p className="text-sm text-gray-400 italic">No awards added yet.</p>}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    <div className="bg-[#151515] -mx-6 -mb-6 px-6 py-4 mt-6 flex justify-between items-center">
                        <div>
                            {Object.keys(errors).length > 0 && (
                                <p className="text-red-500 text-sm flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Please fix the errors before submitting
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
                                onClick={handleAddChef}
                                className="bg-orange-600 hover:bg-orange-700"
                                disabled={Object.keys(errors).length > 0}
                            >
                                Add Chef
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Update Chef Modal */}
            <Dialog open={isUpdateModalOpen} onOpenChange={handleCloseUpdateModal}>
                <DialogContent className="bg-[#1A1A1A] text-white border-[#333] max-w-2xl">
                    {selectedChef && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold flex items-center">
                                    <Edit className="mr-2 h-5 w-5 text-orange-500" />
                                    Edit Chef: {selectedChef.name}
                                </DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue={activeInfo} onValueChange={setActiveInfo} className="mt-4">
                                <TabsList className="bg-[#252525]">
                                    <TabsTrigger className={`${activeInfo === 'basic' ? '!bg-white !text-black' : ''}`}  value="basic">Basic Info</TabsTrigger>
                                    <TabsTrigger className={`${activeInfo === 'specialties' ? '!bg-white !text-black' : ''}`} value="specialties">Specialties</TabsTrigger>
                                    <TabsTrigger className={`${activeInfo === 'awards' ? '!bg-white !text-black' : ''}`} value="awards">Awards</TabsTrigger>
                                </TabsList>

                                <TabsContent value="basic" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="update-name">
                                            Chef Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="update-name"
                                            placeholder="Enter chef name"
                                            className={`bg-[#252525] border-[#333] ${errors.name ? "border-red-500" : ""}`}
                                            value={selectedChef.name}
                                            onChange={(e) => {
                                                setSelectedChef({ ...selectedChef, name: e.target.value })
                                                if (errors.name) {
                                                    const { name, ...rest } = errors
                                                    setErrors(rest)
                                                }
                                            }}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="update-title">
                                            Title <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="update-title"
                                            placeholder="e.g. Executive Chef, Pastry Chef"
                                            className={`bg-[#252525] border-[#333] ${errors.title ? "border-red-500" : ""}`}
                                            value={selectedChef.title}
                                            onChange={(e) => {
                                                setSelectedChef({ ...selectedChef, title: e.target.value })
                                                if (errors.title) {
                                                    const { title, ...rest } = errors
                                                    setErrors(rest)
                                                }
                                            }}
                                        />
                                        {errors.title && (
                                            <p className="text-red-500 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="update-bio">
                                            Biography <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="update-bio"
                                            placeholder="Write a short bio about the chef"
                                            className={`bg-[#252525] border-[#333] min-h-[100px] ${errors.bio ? "border-red-500" : ""}`}
                                            value={selectedChef.bio}
                                            onChange={(e) => {
                                                setSelectedChef({ ...selectedChef, bio: e.target.value })
                                                if (errors.bio) {
                                                    const { bio, ...rest } = errors
                                                    setErrors(rest)
                                                }
                                            }}
                                        />
                                        <div className="flex justify-between text-xs text-gray-400">
                                            <span>{selectedChef.bio.length} characters</span>
                                            <span>Max 300 characters</span>
                                        </div>
                                        {errors.bio && (
                                            <p className="text-red-500 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.bio}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="update-image">Chef Image</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-20 w-20 rounded-md overflow-hidden bg-[#252525] border border-[#333]">
                                                {selectedChef.image ? (
                                                    <Image
                                                        src={selectedChef.image || "/placeholder.svg"}
                                                        alt="Chef preview"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <ChefHat className="h-8 w-8 text-gray-500" />
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
                                                            {selectedChef.image ? "Change Image" : "Upload Image"}
                                                        </>
                                                    )}
                                                </Button>
                                                <p className="text-xs text-gray-400 mt-1">JPG, PNG or WEBP (max. 2MB)</p>
                                            </div>
                                        </div>
                                        {errors.image && (
                                            <p className="text-red-500 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.image}
                                            </p>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="specialties" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="update-specialties">
                                            Specialties <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="update-specialties"
                                                placeholder="e.g. Italian Cuisine, Pasta Making"
                                                className="bg-[#252525] border-[#333]"
                                                value={newSpecialty}
                                                onChange={(e) => setNewSpecialty(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault()
                                                        handleAddSpecialty()
                                                    }
                                                }}
                                            />
                                            <Button type="button" onClick={handleAddSpecialty} className="bg-orange-600 hover:bg-orange-700">
                                                Add
                                            </Button>
                                        </div>

                                        {errors.specialties && (
                                            <p className="text-red-500 text-sm flex items-center mt-1">
                                                <AlertCircle className="h-3 w-3 mr-1" />
                                                {errors.specialties}
                                            </p>
                                        )}

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {selectedChef.specialties.map((specialty, index) => (
                                                <Badge key={index} className="bg-[#252525] hover:bg-[#303030] text-white">
                                                    {specialty}
                                                    <button
                                                        type="button"
                                                        className="ml-1 text-gray-400 hover:text-white"
                                                        onClick={() => handleRemoveSpecialty(specialty)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            ))}

                                            {selectedChef.specialties.length === 0 && (
                                                <p className="text-sm text-gray-400 italic">
                                                    No specialties added yet. Add at least one specialty.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="awards" className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="update-awards">Awards & Recognitions</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="update-awards"
                                                placeholder="e.g. Michelin Star 2022"
                                                className="bg-[#252525] border-[#333]"
                                                value={newAward}
                                                onChange={(e) => setNewAward(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault()
                                                        handleAddAward()
                                                    }
                                                }}
                                            />
                                            <Button type="button" onClick={handleAddAward} className="bg-orange-600 hover:bg-orange-700">
                                                Add
                                            </Button>
                                        </div>

                                        <div className="flex flex-col gap-2 mt-3">
                                            {selectedChef.awards.map((award, index) => (
                                                <div key={index} className="flex items-center justify-between bg-[#252525] p-2 rounded-md">
                                                    <div className="flex items-center">
                                                        <Award className="h-4 w-4 text-yellow-400 mr-2" />
                                                        <span>{award}</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        className="text-gray-400 hover:text-white"
                                                        onClick={() => handleRemoveAward(award)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}

                                            {selectedChef.awards.length === 0 && (
                                                <p className="text-sm text-gray-400 italic">No awards added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>

                            <div className="bg-[#151515] -mx-6 -mb-6 px-6 py-4 mt-6 flex justify-between items-center">
                                <div>
                                    {Object.keys(errors).length > 0 && (
                                        <p className="text-red-500 text-sm flex items-center">
                                            <AlertCircle className="h-4 w-4 mr-1" />
                                            Please fix the errors before submitting
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
                                        onClick={handleUpdateChef}
                                        className="bg-orange-600 hover:bg-orange-700"
                                        disabled={Object.keys(errors).length > 0}
                                    >
                                        Update Chef
                                    </Button>
                                </DialogFooter>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={isDeleteModalOpen} onOpenChange={(open) => !open && setIsDeleteModalOpen(false)}>
                <DialogContent className="bg-[#1A1A1A] text-white border-[#333] max-w-md">
                    {selectedChef && (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-bold text-red-500 flex items-center">
                                    <Trash2 className="mr-2 h-5 w-5" />
                                    Delete Chef
                                </DialogTitle>
                            </DialogHeader>

                            <div className="py-4">
                                <p className="mb-4">
                                    Are you sure you want to delete <span className="font-bold">{selectedChef.name}</span>? This action
                                    cannot be undone.
                                </p>

                                <div className="bg-[#252525] p-3 rounded-md flex items-center gap-3 border border-[#333]">
                                    {selectedChef.image ? (
                                        <Image
                                            src={selectedChef.image || "/placeholder.svg"}
                                            alt={selectedChef.name}
                                            width={50}
                                            height={50}
                                            className="rounded-md object-cover h-12 w-12"
                                        />
                                    ) : (
                                        <div className="h-12 w-12 bg-[#303030] rounded-md flex items-center justify-center">
                                            <ChefHat className="h-6 w-6 text-gray-500" />
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="font-medium">{selectedChef.name}</h4>
                                        <p className="text-sm text-orange-500">{selectedChef.title}</p>
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
                                <Button type="button" variant="destructive" onClick={handleDeleteChef}>
                                    Delete Chef
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
