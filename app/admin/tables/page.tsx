"use client"

import { useState } from "react"
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    X,
    Users,
    Clock,
    DollarSign,
    ImageIcon,
    ToggleLeft,
    ToggleRight,
    Save,
    Upload,
} from "lucide-react"
import Image from "next/image"

// Mock data based on the schema
const mockTables = [
    {
        _id: "t1",
        tableNumber: "A1",
        name: "Window Table 1",
        capacity: 4,
        location: "indoor",
        description: "Elegant table with a view of the garden",
        position: { x: 10, y: 20 },
        isActive: true,
        amenities: ["window-view", "power-outlet"],
        pricePerHour: 20,
        minReservationDuration: 60,
        maxReservationDuration: 180,
        images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=500&auto=format&fit=crop"],
    },
    {
        _id: "t2",
        tableNumber: "B2",
        name: "Patio Table 2",
        capacity: 6,
        location: "outdoor",
        description: "Spacious outdoor table with umbrella",
        position: { x: 30, y: 40 },
        isActive: true,
        amenities: ["wheelchair-accessible"],
        pricePerHour: 25,
        minReservationDuration: 90,
        maxReservationDuration: 180,
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500&auto=format&fit=crop"],
    },
    {
        _id: "t3",
        tableNumber: "C3",
        name: "Bar Table 3",
        capacity: 2,
        location: "bar",
        description: "Intimate table at the bar",
        position: { x: 50, y: 60 },
        isActive: true,
        amenities: ["power-outlet"],
        pricePerHour: 15,
        minReservationDuration: 60,
        maxReservationDuration: 120,
        images: ["https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=500&auto=format&fit=crop"],
    },
    {
        _id: "t4",
        tableNumber: "D4",
        name: "Private Room Table",
        capacity: 8,
        location: "private-room",
        description: "Large table in private dining room",
        position: { x: 70, y: 80 },
        isActive: true,
        amenities: ["sofa", "high-chair"],
        pricePerHour: 40,
        minReservationDuration: 120,
        maxReservationDuration: 180,
        images: ["https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=500&auto=format&fit=crop"],
    },
    {
        _id: "t5",
        tableNumber: "E5",
        name: "Patio Corner Table",
        capacity: 4,
        location: "patio",
        description: "Cozy corner table on the patio",
        position: { x: 90, y: 100 },
        isActive: false,
        amenities: ["window-view"],
        pricePerHour: 22,
        minReservationDuration: 60,
        maxReservationDuration: 150,
        images: ["https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?q=80&w=500&auto=format&fit=crop"],
    },
    {
        _id: "t6",
        tableNumber: "F6",
        name: "Tatami Room",
        capacity: 10,
        location: "private-room",
        description: "Traditional Japanese tatami room for private dining",
        position: { x: 110, y: 120 },
        isActive: true,
        amenities: ["sofa", "wheelchair-accessible"],
        pricePerHour: 50,
        minReservationDuration: 120,
        maxReservationDuration: 180,
        images: ["https://images.unsplash.com/photo-1581414211938-e772a180e8e9?q=80&w=500&auto=format&fit=crop"],
    },
]

export default function TablesPage() {
    const [tables, setTables] = useState(mockTables)
    const [selectedLocation, setSelectedLocation] = useState("all")
    const [showTableDetails, setShowTableDetails] = useState(false)
    const [selectedTable, setSelectedTable] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showNewTableModal, setShowNewTableModal] = useState(false)
    const [showEditTableModal, setShowEditTableModal] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [showTableLayout, setShowTableLayout] = useState(false)
    const [editingTable, setEditingTable] = useState(null)
    const [newTable, setNewTable] = useState({
        tableNumber: "",
        name: "",
        capacity: 4,
        location: "indoor",
        description: "",
        position: { x: 0, y: 0 },
        isActive: true,
        amenities: [],
        pricePerHour: 20,
        minReservationDuration: 60,
        maxReservationDuration: 180,
        images: [],
    })

    // Filter tables based on location and search query
    const filteredTables = tables.filter((table) => {
        // Location filter
        if (selectedLocation !== "all" && table.location !== selectedLocation) {
            return false
        }

        // Search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
                table.tableNumber.toLowerCase().includes(query) ||
                table.name.toLowerCase().includes(query) ||
                table.description.toLowerCase().includes(query)
            )
        }

        return true
    })

    const viewTableDetails = (table) => {
        setSelectedTable(table)
        setShowTableDetails(true)
    }

    const handleEditTable = (table) => {
        setEditingTable({ ...table })
        setShowEditTableModal(true)
    }

    const handleDeleteTable = (table) => {
        setSelectedTable(table)
        setShowDeleteConfirmation(true)
    }

    const handleToggleStatus = (tableId) => {
        // Update the tables array with the toggled status
        setTables(
            tables.map((table) => {
                if (table._id === tableId) {
                    return { ...table, isActive: !table.isActive }
                }
                return table
            }),
        )
    }

    const getLocationLabel = (location) => {
        switch (location) {
            case "indoor":
                return "Indoor"
            case "outdoor":
                return "Outdoor"
            case "patio":
                return "Patio"
            case "bar":
                return "Bar"
            case "private-room":
                return "Private Room"
            default:
                return location
        }
    }

    const getAmenityLabel = (amenity) => {
        switch (amenity) {
            case "power-outlet":
                return "Power Outlet"
            case "window-view":
                return "Window View"
            case "sofa":
                return "Sofa"
            case "high-chair":
                return "High Chair"
            case "wheelchair-accessible":
                return "Wheelchair Accessible"
            default:
                return amenity
        }
    }

    const handleNewTableSubmit = (e) => {
        e.preventDefault()
        // Create a new table with a unique ID
        const newTableWithId = {
            ...newTable,
            _id: `t${tables.length + 1}`,
            images: ["/placeholder.svg?height=200&width=300"],
        }

        // Add the new table to the tables array
        setTables([...tables, newTableWithId])

        // Reset the form and close the modal
        setNewTable({
            tableNumber: "",
            name: "",
            capacity: 4,
            location: "indoor",
            description: "",
            position: { x: 0, y: 0 },
            isActive: true,
            amenities: [],
            pricePerHour: 20,
            minReservationDuration: 60,
            maxReservationDuration: 180,
            images: [],
        })
        setShowNewTableModal(false)
    }

    const handleEditTableSubmit = (e) => {
        e.preventDefault()
        // Update the table in the tables array
        setTables(
            tables.map((table) => {
                if (table._id === editingTable._id) {
                    return editingTable
                }
                return table
            }),
        )

        // Close the modal
        setShowEditTableModal(false)
    }

    const handleDeleteConfirm = () => {
        // Remove the table from the tables array
        setTables(tables.filter((table) => table._id !== selectedTable._id))

        // Close the modal
        setShowDeleteConfirmation(false)
    }

    const handleAmenityChange = (amenity, isChecked, isNewTable = false) => {
        if (isNewTable) {
            if (isChecked) {
                setNewTable({
                    ...newTable,
                    amenities: [...newTable.amenities, amenity],
                })
            } else {
                setNewTable({
                    ...newTable,
                    amenities: newTable.amenities.filter((a) => a !== amenity),
                })
            }
        } else {
            if (isChecked) {
                setEditingTable({
                    ...editingTable,
                    amenities: [...editingTable.amenities, amenity],
                })
            } else {
                setEditingTable({
                    ...editingTable,
                    amenities: editingTable.amenities.filter((a) => a !== amenity),
                })
            }
        }
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Tables</h1>
                    <p className="text-gray-400">Manage restaurant tables and seating</p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search tables..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    <button
                        onClick={() => setShowTableLayout(true)}
                        className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Eye size={18} />
                        <span>View Layout</span>
                    </button>

                    <button
                        onClick={() => setShowNewTableModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} />
                        <span>Add Table</span>
                    </button>
                </div>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4">
                    <button
                        onClick={() => setSelectedLocation("all")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedLocation === "all" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        All Locations
                    </button>
                    <button
                        onClick={() => setSelectedLocation("indoor")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedLocation === "indoor" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Indoor
                    </button>
                    <button
                        onClick={() => setSelectedLocation("outdoor")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedLocation === "outdoor" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Outdoor
                    </button>
                    <button
                        onClick={() => setSelectedLocation("patio")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedLocation === "patio" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Patio
                    </button>
                    <button
                        onClick={() => setSelectedLocation("bar")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedLocation === "bar" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Bar
                    </button>
                    <button
                        onClick={() => setSelectedLocation("private-room")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedLocation === "private-room"
                                ? "bg-orange-500 text-white"
                                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Private Room
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {filteredTables.map((table) => (
                        <div
                            key={table._id}
                            className={`bg-[#2a2a2a] rounded-xl overflow-hidden shadow-md ${!table.isActive ? "opacity-60" : ""}`}
                        >
                            <div className="h-40 relative">
                                <Image
                                    src={table.images[0] || "/placeholder.svg?height=160&width=320"}
                                    alt={table.name}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2 right-2">
                                    {!table.isActive && (
                                        <span className="px-2 py-1 bg-red-500/80 text-white text-xs rounded-full">Inactive</span>
                                    )}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg">{table.name}</h3>
                                        <p className="text-sm text-gray-400">{table.tableNumber}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-[#1E1E1E] text-xs rounded-full">
                    {getLocationLabel(table.location)}
                  </span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Users size={16} className="text-gray-400" />
                                    <span className="text-sm">{table.capacity} people</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <DollarSign size={16} className="text-gray-400" />
                                    <span className="text-sm">${table.pricePerHour}/hour</span>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Clock size={16} className="text-gray-400" />
                                    <span className="text-sm">
                    {table.minReservationDuration}-{table.maxReservationDuration} min
                  </span>
                                </div>

                                {table.amenities.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-2">
                                            {table.amenities.map((amenity) => (
                                                <span key={amenity} className="px-2 py-1 bg-[#1E1E1E] text-xs rounded-full">
                          {getAmenityLabel(amenity)}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => viewTableDetails(table)}
                                            className="p-2 bg-[#1E1E1E] hover:bg-[#333] rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEditTable(table)}
                                            className="p-2 bg-[#1E1E1E] hover:bg-[#333] rounded-lg transition-colors"
                                            title="Edit Table"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTable(table)}
                                            className="p-2 bg-[#1E1E1E] hover:bg-[#333] rounded-lg transition-colors text-red-400 hover:text-red-500"
                                            title="Delete Table"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => handleToggleStatus(table._id)}
                                        className={`p-2 ${table.isActive ? "text-green-500" : "text-gray-400"} hover:bg-[#333] rounded-lg transition-colors`}
                                        title={table.isActive ? "Set Inactive" : "Set Active"}
                                    >
                                        {table.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredTables.length === 0 && (
                    <div className="p-8 text-center">
                        <p className="text-gray-400">No tables found matching your filters.</p>
                    </div>
                )}
            </div>

            {/* Table Details Modal */}
            {showTableDetails && selectedTable && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
                            <h3 className="text-xl font-bold">Table Details - {selectedTable.name}</h3>
                            <button onClick={() => setShowTableDetails(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <div className="h-64 relative rounded-lg overflow-hidden mb-4">
                                        <Image
                                            src={selectedTable.images[0] || "/placeholder.svg?height=256&width=384"}
                                            alt={selectedTable.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-medium">{selectedTable.name}</h4>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs ${selectedTable.isActive ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}
                                        >
                      {selectedTable.isActive ? "Active" : "Inactive"}
                    </span>
                                    </div>

                                    <p className="text-gray-300 mb-6">{selectedTable.description}</p>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#2a2a2a] p-3 rounded-lg">
                                            <p className="text-sm text-gray-400">Table Number</p>
                                            <p className="font-medium">{selectedTable.tableNumber}</p>
                                        </div>
                                        <div className="bg-[#2a2a2a] p-3 rounded-lg">
                                            <p className="text-sm text-gray-400">Location</p>
                                            <p className="font-medium">{getLocationLabel(selectedTable.location)}</p>
                                        </div>
                                        <div className="bg-[#2a2a2a] p-3 rounded-lg">
                                            <p className="text-sm text-gray-400">Capacity</p>
                                            <p className="font-medium">{selectedTable.capacity} people</p>
                                        </div>
                                        <div className="bg-[#2a2a2a] p-3 rounded-lg">
                                            <p className="text-sm text-gray-400">Price</p>
                                            <p className="font-medium">${selectedTable.pricePerHour}/hour</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium mb-4">Reservation Settings</h4>
                                    <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Min Duration:</span>
                                                <span>{selectedTable.minReservationDuration} minutes</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Max Duration:</span>
                                                <span>{selectedTable.maxReservationDuration} minutes</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Position:</span>
                                                <span>
                          x: {selectedTable.position.x}, y: {selectedTable.position.y}
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    <h4 className="text-lg font-medium mb-4">Amenities</h4>
                                    {selectedTable.amenities.length > 0 ? (
                                        <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
                                            <div className="flex flex-wrap gap-2">
                                                {selectedTable.amenities.map((amenity) => (
                                                    <span key={amenity} className="px-3 py-1 bg-[#1E1E1E] rounded-full text-sm">
                            {getAmenityLabel(amenity)}
                          </span>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-[#2a2a2a] rounded-lg p-4 mb-6">
                                            <p className="text-gray-400 italic">No amenities</p>
                                        </div>
                                    )}

                                    <h4 className="text-lg font-medium mb-4">Images</h4>
                                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedTable.images.map((image, index) => (
                                                <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                                                    <Image
                                                        src={image || "/placeholder.svg"}
                                                        alt={`${selectedTable.name} - Image ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            ))}
                                            {selectedTable.images.length === 0 && (
                                                <div className="col-span-3 text-center py-8">
                                                    <p className="text-gray-400 italic">No images available</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-6 flex flex-wrap gap-4 justify-end">
                                <button
                                    onClick={() => {
                                        setShowTableDetails(false)
                                        handleEditTable(selectedTable)
                                    }}
                                    className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Edit size={18} className="inline mr-2" />
                                    Edit Table
                                </button>
                                <button
                                    onClick={() => {
                                        setShowTableDetails(false)
                                        handleDeleteTable(selectedTable)
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} className="inline mr-2" />
                                    Delete Table
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Table Modal */}
            {showNewTableModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
                            <h3 className="text-xl font-bold">Add New Table</h3>
                            <button onClick={() => setShowNewTableModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleNewTableSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-lg font-medium mb-4">Basic Information</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-400 mb-1">
                                                Table Number *
                                            </label>
                                            <input
                                                type="text"
                                                id="tableNumber"
                                                required
                                                value={newTable.tableNumber}
                                                onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                placeholder="e.g., A1"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-1">
                                                Table Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                required
                                                value={newTable.name}
                                                onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                placeholder="e.g., Window Table 1"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-400 mb-1">
                                                Location *
                                            </label>
                                            <select
                                                id="location"
                                                required
                                                value={newTable.location}
                                                onChange={(e) => setNewTable({ ...newTable, location: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="indoor">Indoor</option>
                                                <option value="outdoor">Outdoor</option>
                                                <option value="patio">Patio</option>
                                                <option value="bar">Bar</option>
                                                <option value="private-room">Private Room</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-400 mb-1">
                                                Capacity *
                                            </label>
                                            <input
                                                type="number"
                                                id="capacity"
                                                required
                                                min="1"
                                                value={newTable.capacity}
                                                onChange={(e) => setNewTable({ ...newTable, capacity: Number(e.target.value) })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                placeholder="e.g., 4"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="description" className="block text-sm font-medium text-gray-400 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                id="description"
                                                rows={3}
                                                value={newTable.description}
                                                onChange={(e) => setNewTable({ ...newTable, description: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                placeholder="Describe the table..."
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium mb-4">Reservation Settings</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="pricePerHour" className="block text-sm font-medium text-gray-400 mb-1">
                                                Price Per Hour ($) *
                                            </label>
                                            <input
                                                type="number"
                                                id="pricePerHour"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={newTable.pricePerHour}
                                                onChange={(e) => setNewTable({ ...newTable, pricePerHour: Number(e.target.value) })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                placeholder="e.g., 20.00"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="minReservationDuration" className="block text-sm font-medium text-gray-400 mb-1">
                                                Min Reservation Duration (minutes) *
                                            </label>
                                            <select
                                                id="minReservationDuration"
                                                required
                                                value={newTable.minReservationDuration}
                                                onChange={(e) => setNewTable({ ...newTable, minReservationDuration: Number(e.target.value) })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="60">60 minutes</option>
                                                <option value="90">90 minutes</option>
                                                <option value="120">120 minutes</option>
                                                <option value="150">150 minutes</option>
                                                <option value="180">180 minutes</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="maxReservationDuration" className="block text-sm font-medium text-gray-400 mb-1">
                                                Max Reservation Duration (minutes) *
                                            </label>
                                            <select
                                                id="maxReservationDuration"
                                                required
                                                value={newTable.maxReservationDuration}
                                                onChange={(e) => setNewTable({ ...newTable, maxReservationDuration: Number(e.target.value) })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="60">60 minutes</option>
                                                <option value="90">90 minutes</option>
                                                <option value="120">120 minutes</option>
                                                <option value="150">150 minutes</option>
                                                <option value="180">180 minutes</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="positionX" className="block text-xs text-gray-500 mb-1">
                                                        X Coordinate
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="positionX"
                                                        value={newTable.position.x}
                                                        onChange={(e) =>
                                                            setNewTable({
                                                                ...newTable,
                                                                position: { ...newTable.position, x: Number(e.target.value) },
                                                            })
                                                        }
                                                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                        placeholder="e.g., 10"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="positionY" className="block text-xs text-gray-500 mb-1">
                                                        Y Coordinate
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="positionY"
                                                        value={newTable.position.y}
                                                        onChange={(e) =>
                                                            setNewTable({
                                                                ...newTable,
                                                                position: { ...newTable.position, y: Number(e.target.value) },
                                                            })
                                                        }
                                                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                        placeholder="e.g., 20"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Amenities</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["power-outlet", "window-view", "sofa", "high-chair", "wheelchair-accessible"].map(
                                                    (amenity) => (
                                                        <div key={amenity} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`amenity-${amenity}`}
                                                                checked={newTable.amenities.includes(amenity)}
                                                                onChange={(e) => handleAmenityChange(amenity, e.target.checked, true)}
                                                                className="mr-2"
                                                            />
                                                            <label htmlFor={`amenity-${amenity}`} className="text-sm">
                                                                {getAmenityLabel(amenity)}
                                                            </label>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-lg font-medium mb-4">Images</h4>
                                <div className="bg-[#2a2a2a] p-6 rounded-lg border-2 border-dashed border-gray-700 text-center">
                                    <ImageIcon size={32} className="mx-auto text-gray-500 mb-2" />
                                    <p className="text-gray-400 mb-2">Drag and drop images here, or click to select files</p>
                                    <button
                                        type="button"
                                        className="bg-[#1E1E1E] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Upload size={16} className="inline mr-2" />
                                        Upload Images
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-6 flex justify-between">
                                <div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="isActive"
                                            checked={newTable.isActive}
                                            onChange={(e) => setNewTable({ ...newTable, isActive: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <label htmlFor="isActive" className="text-sm">
                                            Table is active and available for reservations
                                        </label>
                                    </div>
                                </div>
                                <div className="space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewTableModal(false)}
                                        className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                                    >
                                        <Save size={18} className="inline mr-2" />
                                        Save Table
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Table Modal */}
            {showEditTableModal && editingTable && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
                            <h3 className="text-xl font-bold">Edit Table - {editingTable.name}</h3>
                            <button onClick={() => setShowEditTableModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleEditTableSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-lg font-medium mb-4">Basic Information</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="edit-tableNumber" className="block text-sm font-medium text-gray-400 mb-1">
                                                Table Number *
                                            </label>
                                            <input
                                                type="text"
                                                id="edit-tableNumber"
                                                required
                                                value={editingTable.tableNumber}
                                                onChange={(e) => setEditingTable({ ...editingTable, tableNumber: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="edit-name" className="block text-sm font-medium text-gray-400 mb-1">
                                                Table Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="edit-name"
                                                required
                                                value={editingTable.name}
                                                onChange={(e) => setEditingTable({ ...editingTable, name: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="edit-location" className="block text-sm font-medium text-gray-400 mb-1">
                                                Location *
                                            </label>
                                            <select
                                                id="edit-location"
                                                required
                                                value={editingTable.location}
                                                onChange={(e) => setEditingTable({ ...editingTable, location: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="indoor">Indoor</option>
                                                <option value="outdoor">Outdoor</option>
                                                <option value="patio">Patio</option>
                                                <option value="bar">Bar</option>
                                                <option value="private-room">Private Room</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="edit-capacity" className="block text-sm font-medium text-gray-400 mb-1">
                                                Capacity *
                                            </label>
                                            <input
                                                type="number"
                                                id="edit-capacity"
                                                required
                                                min="1"
                                                value={editingTable.capacity}
                                                onChange={(e) => setEditingTable({ ...editingTable, capacity: Number(e.target.value) })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="edit-description" className="block text-sm font-medium text-gray-400 mb-1">
                                                Description
                                            </label>
                                            <textarea
                                                id="edit-description"
                                                rows={3}
                                                value={editingTable.description}
                                                onChange={(e) => setEditingTable({ ...editingTable, description: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium mb-4">Reservation Settings</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="edit-pricePerHour" className="block text-sm font-medium text-gray-400 mb-1">
                                                Price Per Hour ($) *
                                            </label>
                                            <input
                                                type="number"
                                                id="edit-pricePerHour"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={editingTable.pricePerHour}
                                                onChange={(e) => setEditingTable({ ...editingTable, pricePerHour: Number(e.target.value) })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="edit-minReservationDuration"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Min Reservation Duration (minutes) *
                                            </label>
                                            <select
                                                id="edit-minReservationDuration"
                                                required
                                                value={editingTable.minReservationDuration}
                                                onChange={(e) =>
                                                    setEditingTable({ ...editingTable, minReservationDuration: Number(e.target.value) })
                                                }
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="60">60 minutes</option>
                                                <option value="90">90 minutes</option>
                                                <option value="120">120 minutes</option>
                                                <option value="150">150 minutes</option>
                                                <option value="180">180 minutes</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="edit-maxReservationDuration"
                                                className="block text-sm font-medium text-gray-400 mb-1"
                                            >
                                                Max Reservation Duration (minutes) *
                                            </label>
                                            <select
                                                id="edit-maxReservationDuration"
                                                required
                                                value={editingTable.maxReservationDuration}
                                                onChange={(e) =>
                                                    setEditingTable({ ...editingTable, maxReservationDuration: Number(e.target.value) })
                                                }
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="60">60 minutes</option>
                                                <option value="90">90 minutes</option>
                                                <option value="120">120 minutes</option>
                                                <option value="150">150 minutes</option>
                                                <option value="180">180 minutes</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="edit-positionX" className="block text-xs text-gray-500 mb-1">
                                                        X Coordinate
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="edit-positionX"
                                                        value={editingTable.position.x}
                                                        onChange={(e) =>
                                                            setEditingTable({
                                                                ...editingTable,
                                                                position: { ...editingTable.position, x: Number(e.target.value) },
                                                            })
                                                        }
                                                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="edit-positionY" className="block text-xs text-gray-500 mb-1">
                                                        Y Coordinate
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="edit-positionY"
                                                        value={editingTable.position.y}
                                                        onChange={(e) =>
                                                            setEditingTable({
                                                                ...editingTable,
                                                                position: { ...editingTable.position, y: Number(e.target.value) },
                                                            })
                                                        }
                                                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Amenities</label>
                                            <div className="grid grid-cols-2 gap-2">
                                                {["power-outlet", "window-view", "sofa", "high-chair", "wheelchair-accessible"].map(
                                                    (amenity) => (
                                                        <div key={amenity} className="flex items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`edit-amenity-${amenity}`}
                                                                checked={editingTable.amenities.includes(amenity)}
                                                                onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                                                                className="mr-2"
                                                            />
                                                            <label htmlFor={`edit-amenity-${amenity}`} className="text-sm">
                                                                {getAmenityLabel(amenity)}
                                                            </label>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h4 className="text-lg font-medium mb-4">Images</h4>
                                <div className="grid grid-cols-4 gap-4 mb-4">
                                    {editingTable.images.map((image, index) => (
                                        <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                                            <Image
                                                src={image || "/placeholder.svg"}
                                                alt={`Table image ${index + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                            <button
                                                type="button"
                                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full"
                                                title="Remove image"
                                                onClick={() => {
                                                    setEditingTable({
                                                        ...editingTable,
                                                        images: editingTable.images.filter((_, i) => i !== index),
                                                    })
                                                }}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-[#2a2a2a] p-6 rounded-lg border-2 border-dashed border-gray-700 text-center">
                                    <ImageIcon size={32} className="mx-auto text-gray-500 mb-2" />
                                    <p className="text-gray-400 mb-2">Drag and drop images here, or click to select files</p>
                                    <button
                                        type="button"
                                        className="bg-[#1E1E1E] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Upload size={16} className="inline mr-2" />
                                        Upload Images
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-6 flex justify-between">
                                <div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="edit-isActive"
                                            checked={editingTable.isActive}
                                            onChange={(e) => setEditingTable({ ...editingTable, isActive: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <label htmlFor="edit-isActive" className="text-sm">
                                            Table is active and available for reservations
                                        </label>
                                    </div>
                                </div>
                                <div className="space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditTableModal(false)}
                                        className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                                    >
                                        <Save size={18} className="inline mr-2" />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && selectedTable && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E1E1E] rounded-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Delete Table</h3>
                        <p className="mb-6">
                            Are you sure you want to delete the table <span className="font-semibold">{selectedTable.name}</span> (
                            {selectedTable.tableNumber})? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirmation(false)}
                                className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Delete Table
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Table Layout Modal */}
            {showTableLayout && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
                            <h3 className="text-xl font-bold">Restaurant Table Layout</h3>
                            <button onClick={() => setShowTableLayout(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="relative w-full h-[600px] border border-gray-700 rounded-lg bg-[#2a2a2a] overflow-auto">
                                {/* Restaurant background elements */}
                                <div className="absolute top-10 left-10 w-40 h-20 bg-gray-700 rounded-md flex items-center justify-center text-gray-300">
                                    Entrance
                                </div>
                                <div className="absolute top-10 right-10 w-60 h-40 bg-gray-700 rounded-md flex items-center justify-center text-gray-300">
                                    Bar Area
                                </div>
                                <div className="absolute bottom-10 left-10 w-60 h-40 bg-gray-700 rounded-md flex items-center justify-center text-gray-300">
                                    Kitchen
                                </div>
                                <div className="absolute bottom-10 right-10 w-40 h-20 bg-gray-700 rounded-md flex items-center justify-center text-gray-300">
                                    Restrooms
                                </div>

                                {/* Tables */}
                                {tables.map((table) => (
                                    <div
                                        key={table._id}
                                        className={`absolute rounded-md border-2 flex flex-col items-center justify-center p-2 ${
                                            table.isActive ? "bg-green-900/30 border-green-500" : "bg-red-900/30 border-red-500"
                                        }`}
                                        style={{
                                            left: `${table.position.x}px`,
                                            top: `${table.position.y}px`,
                                            width: table.capacity <= 2 ? "60px" : table.capacity <= 4 ? "80px" : "100px",
                                            height: table.capacity <= 2 ? "60px" : table.capacity <= 4 ? "80px" : "100px",
                                        }}
                                    >
                                        <span className="font-bold text-xs">{table.tableNumber}</span>
                                        <span className="text-xs">{table.capacity} seats</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-green-900/30 border-2 border-green-500 rounded-sm"></div>
                                        <span className="text-sm">Active</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-red-900/30 border-2 border-red-500 rounded-sm"></div>
                                        <span className="text-sm">Inactive</span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400">Tables are positioned according to their X and Y coordinates.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
