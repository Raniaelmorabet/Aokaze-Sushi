"use client"

import { useState } from "react"
import {
    Search,
    ChevronDown,
    Download,
    Calendar,
    Users,
    X,
    Check,
    Edit,
    ChevronLeft,
    ChevronRight,
    CalendarDays,
    Eye,
    Save,
    ChevronUp,
    Clock,
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
        images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=100&auto=format&fit=crop"],
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
        images: ["https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=100&auto=format&fit=crop"],
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
        images: ["https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=100&auto=format&fit=crop"],
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
        images: ["https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=100&auto=format&fit=crop"],
    },
]

const mockReservations = [
    {
        _id: "r1",
        reservationNumber: "RES-20230515-1234",
        customer: "u1",
        customerDetails: {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 (123) 456-7890",
        },
        table: "t1",
        tableDetails: mockTables[0],
        reservationDate: "2023-05-15T00:00:00.000Z",
        startTime: "2023-05-15T18:00:00.000Z",
        endTime: "2023-05-15T20:00:00.000Z",
        partySize: 3,
        status: "confirmed",
        totalPrice: 40,
        specialRequests: "Window seat preferred",
        source: "website",
        notes: "",
        createdAt: "2023-05-10T14:30:00.000Z",
        updatedAt: "2023-05-10T14:30:00.000Z",
    },
    {
        _id: "r2",
        reservationNumber: "RES-20230516-5678",
        customer: "u2",
        customerDetails: {
            name: "Sarah Johnson",
            email: "sarah.j@example.com",
            phone: "+1 (234) 567-8901",
        },
        table: "t2",
        tableDetails: mockTables[1],
        reservationDate: "2023-05-16T00:00:00.000Z",
        startTime: "2023-05-16T19:00:00.000Z",
        endTime: "2023-05-16T21:30:00.000Z",
        partySize: 5,
        status: "pending",
        totalPrice: 62.5,
        specialRequests: "Celebrating anniversary",
        source: "phone",
        notes: "First time customers",
        createdAt: "2023-05-11T10:15:00.000Z",
        updatedAt: "2023-05-11T10:15:00.000Z",
    },
    {
        _id: "r3",
        reservationNumber: "RES-20230517-9012",
        customer: "u3",
        customerDetails: {
            name: "Michael Chen",
            email: "michael.c@example.com",
            phone: "+1 (345) 678-9012",
        },
        table: "t3",
        tableDetails: mockTables[2],
        reservationDate: "2023-05-17T00:00:00.000Z",
        startTime: "2023-05-17T17:30:00.000Z",
        endTime: "2023-05-17T18:30:00.000Z",
        partySize: 2,
        status: "seated",
        totalPrice: 15,
        specialRequests: "",
        source: "website",
        notes: "",
        createdAt: "2023-05-12T09:45:00.000Z",
        updatedAt: "2023-05-17T17:35:00.000Z",
        checkedInAt: "2023-05-17T17:35:00.000Z",
    },
    {
        _id: "r4",
        reservationNumber: "RES-20230518-3456",
        customer: "u4",
        customerDetails: {
            name: "Emily Wilson",
            email: "emily.w@example.com",
            phone: "+1 (456) 789-0123",
        },
        table: "t4",
        tableDetails: mockTables[3],
        reservationDate: "2023-05-18T00:00:00.000Z",
        startTime: "2023-05-18T18:00:00.000Z",
        endTime: "2023-05-18T20:00:00.000Z",
        partySize: 7,
        status: "cancelled",
        totalPrice: 80,
        specialRequests: "Need high chair for toddler",
        source: "mobile-app",
        notes: "",
        cancellationReason: "Customer called to cancel due to illness",
        createdAt: "2023-05-13T16:20:00.000Z",
        updatedAt: "2023-05-17T12:10:00.000Z",
    },
    {
        _id: "r5",
        reservationNumber: "RES-20230519-7890",
        customer: "u5",
        customerDetails: {
            name: "David Kim",
            email: "david.k@example.com",
            phone: "+1 (567) 890-1234",
        },
        table: "t1",
        tableDetails: mockTables[0],
        reservationDate: "2023-05-19T00:00:00.000Z",
        startTime: "2023-05-19T19:30:00.000Z",
        endTime: "2023-05-19T21:30:00.000Z",
        partySize: 4,
        status: "completed",
        totalPrice: 40,
        specialRequests: "",
        source: "website",
        notes: "Repeat customers",
        createdAt: "2023-05-14T11:30:00.000Z",
        updatedAt: "2023-05-19T21:45:00.000Z",
        checkedInAt: "2023-05-19T19:25:00.000Z",
        completedAt: "2023-05-19T21:45:00.000Z",
    },
    {
        _id: "r6",
        reservationNumber: "RES-20230520-1234",
        customer: "u6",
        customerDetails: {
            name: "Jessica Brown",
            email: "jessica.b@example.com",
            phone: "+1 (678) 901-2345",
        },
        table: "t2",
        tableDetails: mockTables[1],
        reservationDate: "2023-05-20T00:00:00.000Z",
        startTime: "2023-05-20T18:30:00.000Z",
        endTime: "2023-05-20T20:00:00.000Z",
        partySize: 4,
        status: "no-show",
        totalPrice: 37.5,
        specialRequests: "",
        source: "phone",
        notes: "Did not arrive by 19:00, marked as no-show",
        createdAt: "2023-05-15T14:00:00.000Z",
        updatedAt: "2023-05-20T19:00:00.000Z",
    },
]

// Add more reservations for today and upcoming days
const today = new Date()
const tomorrow = new Date(today)
tomorrow.setDate(tomorrow.getDate() + 1)
const dayAfterTomorrow = new Date(today)
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

const upcomingReservations = [
    {
        _id: "r7",
        reservationNumber: `RES-${today.toISOString().slice(0, 10).replace(/-/g, "")}-1111`,
        customer: "u7",
        customerDetails: {
            name: "Alex Thompson",
            email: "alex.t@example.com",
            phone: "+1 (789) 012-3456",
        },
        table: "t3",
        tableDetails: mockTables[2],
        reservationDate: today.toISOString().split("T")[0] + "T00:00:00.000Z",
        startTime: today.toISOString().split("T")[0] + "T19:00:00.000Z",
        endTime: today.toISOString().split("T")[0] + "T20:00:00.000Z",
        partySize: 2,
        status: "confirmed",
        totalPrice: 15,
        specialRequests: "",
        source: "website",
        notes: "",
        createdAt: "2023-05-16T09:30:00.000Z",
        updatedAt: "2023-05-16T09:30:00.000Z",
    },
    {
        _id: "r8",
        reservationNumber: `RES-${tomorrow.toISOString().slice(0, 10).replace(/-/g, "")}-2222`,
        customer: "u8",
        customerDetails: {
            name: "Olivia Martinez",
            email: "olivia.m@example.com",
            phone: "+1 (890) 123-4567",
        },
        table: "t4",
        tableDetails: mockTables[3],
        reservationDate: tomorrow.toISOString().split("T")[0] + "T00:00:00.000Z",
        startTime: tomorrow.toISOString().split("T")[0] + "T18:00:00.000Z",
        endTime: tomorrow.toISOString().split("T")[0] + "T20:00:00.000Z",
        partySize: 6,
        status: "confirmed",
        totalPrice: 80,
        specialRequests: "Birthday celebration",
        source: "mobile-app",
        notes: "Requested birthday cake",
        createdAt: "2023-05-17T15:45:00.000Z",
        updatedAt: "2023-05-17T15:45:00.000Z",
    },
    {
        _id: "r9",
        reservationNumber: `RES-${dayAfterTomorrow.toISOString().slice(0, 10).replace(/-/g, "")}-3333`,
        customer: "u9",
        customerDetails: {
            name: "William Garcia",
            email: "william.g@example.com",
            phone: "+1 (901) 234-5678",
        },
        table: "t1",
        tableDetails: mockTables[0],
        reservationDate: dayAfterTomorrow.toISOString().split("T")[0] + "T00:00:00.000Z",
        startTime: dayAfterTomorrow.toISOString().split("T")[0] + "T19:30:00.000Z",
        endTime: dayAfterTomorrow.toISOString().split("T")[0] + "T21:30:00.000Z",
        partySize: 3,
        status: "pending",
        totalPrice: 40,
        specialRequests: "Prefer quiet area",
        source: "website",
        notes: "",
        createdAt: "2023-05-18T11:20:00.000Z",
        updatedAt: "2023-05-18T11:20:00.000Z",
    },
]

// Combine all reservations
const allReservations = [...mockReservations, ...upcomingReservations]

// Table layout data
type TableStatus = "available" | "reserved" | "filled" | "availableSoon"
type TableShape = "round" | "oval" | "rectangular"

interface TableLayout {
    id: string
    name: string
    status: TableStatus
    shape: TableShape
    timeRemaining?: string
    selected?: boolean
    position: {
        row: number
        col: number
        colSpan?: number
    }
    capacity: number
}

const initialTables: TableLayout[] = [
    { id: "t12", name: "T12", status: "available", shape: "round", position: { row: 0, col: 0 }, capacity: 4 },
    { id: "t13", name: "T13", status: "filled", shape: "rectangular", position: { row: 0, col: 1 }, capacity: 4 },
    {
        id: "t14",
        name: "T14",
        status: "availableSoon",
        shape: "oval",
        timeRemaining: "5m 30s",
        position: { row: 0, col: 2, colSpan: 2 },
        capacity: 8,
    },
    { id: "t15", name: "T15", status: "reserved", shape: "rectangular", position: { row: 0, col: 4 }, capacity: 4 },
    { id: "t16", name: "T16", status: "available", shape: "rectangular", position: { row: 0, col: 5 }, capacity: 4 },
    {
        id: "t17",
        name: "T17",
        status: "available",
        shape: "oval",
        position: { row: 1, col: 0, colSpan: 2 },
        capacity: 8,
    },
    {
        id: "t18",
        name: "T18",
        status: "availableSoon",
        shape: "oval",
        timeRemaining: "5m 30s",
        position: { row: 1, col: 2, colSpan: 2 },
        capacity: 8,
    },
    {
        id: "t19",
        name: "T19",
        status: "available",
        shape: "oval",
        position: { row: 1, col: 4, colSpan: 2 },
        capacity: 8,
    },
    { id: "t20", name: "T20", status: "available", shape: "round", position: { row: 2, col: 0 }, capacity: 4 },
    { id: "t21", name: "T21", status: "reserved", shape: "round", position: { row: 2, col: 1 }, capacity: 4 },
    {
        id: "t22",
        name: "T22",
        status: "available",
        shape: "oval",
        position: { row: 2, col: 2, colSpan: 2 },
        capacity: 8,
    },
    { id: "t23", name: "T23", status: "filled", shape: "round", position: { row: 2, col: 4 }, capacity: 4 },
    { id: "t24", name: "T24", status: "reserved", shape: "round", position: { row: 2, col: 5 }, capacity: 4 },
    { id: "t25", name: "T25", status: "available", shape: "round", position: { row: 3, col: 0 }, capacity: 4 },
    { id: "t26", name: "T26", status: "filled", shape: "round", position: { row: 3, col: 1 }, capacity: 4 },
    { id: "t27", name: "T27", status: "filled", shape: "rectangular", position: { row: 3, col: 2 }, capacity: 4 },
    {
        id: "t28",
        name: "T28",
        status: "availableSoon",
        shape: "round",
        timeRemaining: "5m 30s",
        position: { row: 3, col: 3 },
        capacity: 4,
    },
    {
        id: "t29",
        name: "T29",
        status: "availableSoon",
        shape: "round",
        timeRemaining: "5m 30s",
        position: { row: 3, col: 4 },
        capacity: 4,
    },
]

export default function ReservationsPage() {
    const [reservations, setReservations] = useState(allReservations)
    const [selectedStatus, setSelectedStatus] = useState("all")
    const [selectedDate, setSelectedDate] = useState("all")
    const [showReservationDetails, setShowReservationDetails] = useState(false)
    const [selectedReservation, setSelectedReservation] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [showNewReservationModal, setShowNewReservationModal] = useState(false)
    const [showEditReservationModal, setShowEditReservationModal] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [editingReservation, setEditingReservation] = useState(null)
    const [showTableLayout, setShowTableLayout] = useState(false)
    const [layoutTables, setLayoutTables] = useState<TableLayout[]>(initialTables)
    const [peopleCount, setPeopleCount] = useState(2)

    // New reservation form state
    const [newReservation, setNewReservation] = useState({
        customerDetails: {
            name: "",
            email: "",
            phone: "",
        },
        table: "",
        reservationDate: new Date().toISOString().split("T")[0],
        startTime: "",
        endTime: "",
        partySize: 2,
        status: "pending",
        specialRequests: "",
        source: "website",
        notes: "",
    })

    // Filter reservations based on status, date, and search query
    const filteredReservations = reservations.filter((reservation) => {
        // Status filter
        if (selectedStatus !== "all" && reservation.status !== selectedStatus) {
            return false
        }

        // Date filter
        if (selectedDate === "today") {
            const today = new Date().toISOString().split("T")[0]
            const reservationDate = new Date(reservation.reservationDate).toISOString().split("T")[0]
            if (reservationDate !== today) {
                return false
            }
        } else if (selectedDate === "tomorrow") {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            const tomorrowStr = tomorrow.toISOString().split("T")[0]
            const reservationDate = new Date(reservation.reservationDate).toISOString().split("T")[0]
            if (reservationDate !== tomorrowStr) {
                return false
            }
        } else if (selectedDate === "upcoming") {
            const today = new Date()
            const reservationDate = new Date(reservation.reservationDate)
            if (reservationDate < today) {
                return false
            }
        } else if (selectedDate === "past") {
            const today = new Date()
            const reservationDate = new Date(reservation.reservationDate)
            if (reservationDate >= today) {
                return false
            }
        }

        // Search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            return (
                reservation.reservationNumber.toLowerCase().includes(query) ||
                reservation.customerDetails.name.toLowerCase().includes(query) ||
                reservation.customerDetails.email.toLowerCase().includes(query) ||
                reservation.customerDetails.phone.toLowerCase().includes(query) ||
                reservation.tableDetails.tableNumber.toLowerCase().includes(query) ||
                reservation.tableDetails.name.toLowerCase().includes(query)
            )
        }

        return true
    })

    const viewReservationDetails = (reservation) => {
        setSelectedReservation(reservation)
        setShowReservationDetails(true)
    }

    const handleEditReservation = (reservation) => {
        setEditingReservation({ ...reservation })
        setShowEditReservationModal(true)
    }

    const handleDeleteReservation = (reservation) => {
        setSelectedReservation(reservation)
        setShowDeleteConfirmation(true)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-500/20 text-green-500"
            case "pending":
                return "bg-yellow-500/20 text-yellow-500"
            case "seated":
                return "bg-blue-500/20 text-blue-500"
            case "completed":
                return "bg-purple-500/20 text-purple-500"
            case "cancelled":
                return "bg-red-500/20 text-red-500"
            case "no-show":
                return "bg-gray-500/20 text-gray-500"
            default:
                return "bg-gray-500/20 text-gray-500"
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const getDuration = (startTime, endTime) => {
        const start = new Date(startTime)
        const end = new Date(endTime)
        const durationMs = end - start
        const durationMinutes = durationMs / (1000 * 60)

        if (durationMinutes < 60) {
            return `${durationMinutes} min`
        } else {
            const hours = Math.floor(durationMinutes / 60)
            const minutes = durationMinutes % 60
            return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
        }
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

    const handleStatusChange = (reservationId, newStatus) => {
        // Update the reservations array with the new status
        setReservations(
            reservations.map((res) => {
                if (res._id === reservationId) {
                    return {
                        ...res,
                        status: newStatus,
                        updatedAt: new Date().toISOString(),
                        ...(newStatus === "seated" ? { checkedInAt: new Date().toISOString() } : {}),
                        ...(newStatus === "completed" ? { completedAt: new Date().toISOString() } : {}),
                    }
                }
                return res
            }),
        )

        // Close the modal
        setShowReservationDetails(false)
    }

    const handleNewReservationSubmit = (e) => {
        e.preventDefault()

        // Find the selected table
        const selectedTable = mockTables.find((table) => table._id === newReservation.table)

        // Create a new reservation with a unique ID and reservation number
        const reservationDate = new Date(newReservation.reservationDate)
        const dateStr = reservationDate.toISOString().slice(0, 10).replace(/-/g, "")
        const randomNum = Math.floor(1000 + Math.random() * 9000)

        // Calculate duration and price
        const startTime = new Date(`${newReservation.reservationDate}T${newReservation.startTime}`)
        const endTime = new Date(`${newReservation.reservationDate}T${newReservation.endTime}`)
        const durationMs = endTime - startTime
        const durationHours = durationMs / (1000 * 60 * 60)
        const totalPrice = Math.round(durationHours * selectedTable.pricePerHour * 100) / 100

        const newReservationWithId = {
            ...newReservation,
            _id: `r${reservations.length + 1}`,
            reservationNumber: `RES-${dateStr}-${randomNum}`,
            tableDetails: selectedTable,
            reservationDate: reservationDate.toISOString(),
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            totalPrice,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        // Add the new reservation to the reservations array
        setReservations([...reservations, newReservationWithId])

        // Reset the form and close the modal
        setNewReservation({
            customerDetails: {
                name: "",
                email: "",
                phone: "",
            },
            table: "",
            reservationDate: new Date().toISOString().split("T")[0],
            startTime: "",
            endTime: "",
            partySize: 2,
            status: "pending",
            specialRequests: "",
            source: "website",
            notes: "",
        })
        setShowNewReservationModal(false)
    }

    const handleEditReservationSubmit = (e) => {
        e.preventDefault()

        // Find the selected table
        const selectedTable = mockTables.find((table) => table._id === editingReservation.table)

        // Calculate duration and price
        const startTime = new Date(editingReservation.startTime)
        const endTime = new Date(editingReservation.endTime)
        const durationMs = endTime - startTime
        const durationHours = durationMs / (1000 * 60 * 60)
        const totalPrice = Math.round(durationHours * selectedTable.pricePerHour * 100) / 100

        // Update the reservation in the reservations array
        setReservations(
            reservations.map((res) => {
                if (res._id === editingReservation._id) {
                    return {
                        ...editingReservation,
                        tableDetails: selectedTable,
                        totalPrice,
                        updatedAt: new Date().toISOString(),
                    }
                }
                return res
            }),
        )

        // Close the modal
        setShowEditReservationModal(false)
    }

    const handleDeleteConfirm = () => {
        // Remove the reservation from the reservations array
        setReservations(reservations.filter((res) => res._id !== selectedReservation._id))

        // Close the modal
        setShowDeleteConfirmation(false)
    }

    // Table layout functions
    const getTableStatusColor = (status: TableStatus) => {
        switch (status) {
            case "available":
                return "bg-green-200"
            case "reserved":
                return "bg-red-200"
            case "filled":
                return "bg-gray-200"
            case "availableSoon":
                return "bg-amber-200"
            default:
                return "bg-[#1E1E1E]"
        }
    }

    const toggleTableSelection = (id: string) => {
        setLayoutTables(
            layoutTables.map((table) => {
                if (table.status !== "available") return table
                return table.id === id ? { ...table, selected: !table.selected } : { ...table, selected: false }
            }),
        )
    }

    const renderChairs = (shape: TableShape, colSpan?: number, selected?: boolean) => {
        const chairColor = selected
            ? "border border-[#F05A28] ring-2 ring-[#F05A28]/30"
            : "bg-[#1E1E1E] border-[0.5px] border-white/30"

        if (shape === "round") {
            return (
                <>
                    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`} />
                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`} />
                    <div className={`absolute top-1/2 -left-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`} />
                    <div className={`absolute top-1/2 -right-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`} />
                </>
            )
        }
        if (shape === "oval" && colSpan === 2) {
            return (
                <>
                    <div className={`absolute -top-6 left-1/4 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`} />
                    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`} />
                    <div className={`absolute -top-6 left-3/4 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`} />
                    <div className={`absolute -bottom-6 left-1/4 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`} />
                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`} />
                    <div className={`absolute -bottom-6 left-3/4 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`} />
                    <div className={`absolute top-1/2 -left-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`} />
                    <div className={`absolute top-1/2 -right-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`} />
                </>
            )
        }
        if (shape === "rectangular") {
            return (
                <>
                    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`} />
                    <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`} />
                    <div className={`absolute top-1/2 -left-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`} />
                    <div className={`absolute top-1/2 -right-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`} />
                </>
            )
        }
        return null
    }

    const renderTable = (table: TableLayout) => {
        const tableSizeClasses = {
            round: "w-28 h-28", // Fixed size for all screen sizes
            oval: table.position.colSpan === 2 ? "w-64 h-28" : "w-28 h-28", // Fixed size for all screen sizes
            rectangular: "w-28 h-28", // Fixed size for all screen sizes
        }

        const borderRadiusClasses = {
            round: "rounded-full",
            oval: "rounded-full",
            rectangular: "rounded-md",
        }

        const isSelectable = table.status === "available" && table.capacity >= peopleCount
        const cursorClass = isSelectable ? "cursor-pointer" : "cursor-not-allowed opacity-70"

        return (
            <div className="relative flex items-center justify-center h-full w-full">
                <div className="relative">
                    {renderChairs(table.shape, table.position.colSpan, table.selected)}
                    <div
                        className={`relative flex items-center justify-center bg-[#1E1E1E] border-[0.5px] border-white/30
              ${tableSizeClasses[table.shape]}
              ${borderRadiusClasses[table.shape]}
              ${cursorClass} shadow-sm
              ${table.selected ? "border border-[#F05A28] ring-2 ring-[#F05A28]/30" : ""}`}
                        onClick={() => isSelectable && toggleTableSelection(table.id)}
                    >
            <span
                className={`flex justify-center items-center font-medium text-gray-700 z-10 relative rounded-full w-12 h-12 ${getTableStatusColor(table.status)}`}
            >
              {table.name}
            </span>
                    </div>

                    {table.status === "reserved" && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="text-xs px-2 py-0.5 bg-red-500 text-white rounded-full">Booked</div>
                        </div>
                    )}
                    {table.status === "availableSoon" && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="text-xs px-2 py-0.5 bg-amber-500 text-white rounded-full flex items-center">
                                <Clock className="w-3 h-3 mr-1" /> {table.timeRemaining}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    const tablesByRow = layoutTables.reduce(
        (acc, table) => {
            const { row } = table.position
            if (!acc[row]) acc[row] = []
            acc[row].push(table)
            return acc
        },
        {} as Record<number, TableLayout[]>,
    )

    const incrementPeople = () => {
        if (peopleCount < 8) {
            setPeopleCount(peopleCount + 1)
        }
    }

    const decrementPeople = () => {
        if (peopleCount > 1) {
            setPeopleCount(peopleCount - 1)
        }
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Reservations</h1>
                    <p className="text-gray-400">Manage and track table reservations</p>
                </div>

                <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search reservations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-[#1E1E1E] text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 w-full md:w-64"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    {/*<div className="relative">*/}
                    {/*    <button className="bg-[#1E1E1E] text-white px-4 py-2 rounded-lg flex items-center gap-2">*/}
                    {/*        <CalendarDays size={18} />*/}
                    {/*        <span>Date</span>*/}
                    {/*        <ChevronDown size={16} />*/}
                    {/*    </button>*/}
                    {/*</div>*/}

                    {/*<button*/}
                    {/*    onClick={() => setShowTableLayout(true)}*/}
                    {/*    className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"*/}
                    {/*>*/}
                    {/*    <Eye size={18} />*/}
                    {/*    <span>View Layout</span>*/}
                    {/*</button>*/}

                    <button
                        onClick={() => setShowNewReservationModal(true)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Calendar size={18} />
                        <span>New Reservation</span>
                    </button>
                </div>
            </div>

            <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden mb-8">
                <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4">
                    <button
                        onClick={() => setSelectedStatus("all")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedStatus === "all" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        All Reservations
                    </button>
                    <button
                        onClick={() => setSelectedStatus("pending")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedStatus === "pending" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setSelectedStatus("confirmed")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedStatus === "confirmed" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Confirmed
                    </button>
                    <button
                        onClick={() => setSelectedStatus("seated")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedStatus === "seated" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Seated
                    </button>
                    <button
                        onClick={() => setSelectedStatus("completed")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedStatus === "completed" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => setSelectedStatus("cancelled")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedStatus === "cancelled" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Cancelled
                    </button>
                    <button
                        onClick={() => setSelectedStatus("no-show")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedStatus === "no-show" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        No-Show
                    </button>
                </div>

                <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4">
                    <button
                        onClick={() => setSelectedDate("all")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedDate === "all" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        All Dates
                    </button>
                    <button
                        onClick={() => setSelectedDate("today")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedDate === "today" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Today
                    </button>
                    <button
                        onClick={() => setSelectedDate("tomorrow")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedDate === "tomorrow" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Tomorrow
                    </button>
                    <button
                        onClick={() => setSelectedDate("upcoming")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedDate === "upcoming" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setSelectedDate("past")}
                        className={`px-4 py-2 rounded-lg text-sm ${
                            selectedDate === "past" ? "bg-orange-500 text-white" : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                        Past
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="bg-[#2a2a2a]">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Reservation
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Table
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Date & Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Party Size
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                        {filteredReservations.map((reservation) => (
                            <tr key={reservation._id} className="hover:bg-[#2a2a2a] transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{reservation.reservationNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div>
                                        <p className="font-medium">{reservation.customerDetails.name}</p>
                                        <p className="text-xs text-gray-400">{reservation.customerDetails.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-md overflow-hidden">
                                            <Image
                                                src={reservation.tableDetails.images[0] || "/placeholder.svg"}
                                                alt={reservation.tableDetails.name}
                                                width={32}
                                                height={32}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{reservation.tableDetails.name}</p>
                                            <p className="text-xs text-gray-400">
                                                {reservation.tableDetails.tableNumber} • {getLocationLabel(reservation.tableDetails.location)}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div>
                                        <p>{formatDate(reservation.reservationDate)}</p>
                                        <p className="text-xs text-gray-400">
                                            {formatTime(reservation.startTime)} - {formatTime(reservation.endTime)}
                                        </p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex items-center gap-1">
                                        <Users size={16} className="text-gray-400" />
                                        <span>{reservation.partySize}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(reservation.status)}`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => viewReservationDetails(reservation)}
                                            className="p-1 hover:bg-[#333] rounded-md transition-colors"
                                            title="View Details"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="p-1 hover:bg-[#333] rounded-md transition-colors"
                                            title="Edit Reservation"
                                            onClick={() => handleEditReservation(reservation)}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="p-1 hover:bg-[#333] rounded-md transition-colors text-red-400 hover:text-red-500"
                                            title="Cancel Reservation"
                                            onClick={() => handleDeleteReservation(reservation)}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {filteredReservations.length === 0 && (
                    <div className="p-8 text-center">
                        <p className="text-gray-400">No reservations found matching your filters.</p>
                    </div>
                )}

                <div className="p-4 border-t border-gray-800 flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                        Showing {filteredReservations.length} of {reservations.length} reservations
                    </p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm disabled:opacity-50">
                            <ChevronLeft size={16} />
                        </button>
                        <button className="px-3 py-1 bg-orange-500 rounded-md text-sm">1</button>
                        <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">2</button>
                        <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">3</button>
                        <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Reservation Details Modal */}
            {showReservationDetails && selectedReservation && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
                            <h3 className="text-xl font-bold">Reservation Details - {selectedReservation.reservationNumber}</h3>
                            <button onClick={() => setShowReservationDetails(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-lg font-medium mb-4">Customer Information</h4>
                                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="text-gray-400">Name: </span>
                                                {selectedReservation.customerDetails.name}
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-gray-400">Email: </span>
                                                {selectedReservation.customerDetails.email}
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-gray-400">Phone: </span>
                                                {selectedReservation.customerDetails.phone}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium mb-4">Reservation Information</h4>
                                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Date:</span>
                                                <span>{formatDate(selectedReservation.reservationDate)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Time:</span>
                                                <span>
                          {formatTime(selectedReservation.startTime)} - {formatTime(selectedReservation.endTime)}
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Duration:</span>
                                                <span>{getDuration(selectedReservation.startTime, selectedReservation.endTime)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Party Size:</span>
                                                <span>{selectedReservation.partySize} people</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Status:</span>
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedReservation.status)}`}
                                                >
                          {selectedReservation.status.charAt(0).toUpperCase() + selectedReservation.status.slice(1)}
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Source:</span>
                                                <span>
                          {selectedReservation.source.charAt(0).toUpperCase() + selectedReservation.source.slice(1)}
                        </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-400">Total Price:</span>
                                                <span className="font-bold">${selectedReservation.totalPrice.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-lg font-medium mb-4">Table Information</h4>
                                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                                                <Image
                                                    src={selectedReservation.tableDetails.images[0] || "/placeholder.svg"}
                                                    alt={selectedReservation.tableDetails.name}
                                                    width={64}
                                                    height={64}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-medium">{selectedReservation.tableDetails.name}</p>
                                                <p className="text-sm text-gray-400">
                                                    {selectedReservation.tableDetails.tableNumber} •{" "}
                                                    {getLocationLabel(selectedReservation.tableDetails.location)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="text-gray-400">Capacity: </span>
                                                {selectedReservation.tableDetails.capacity} people
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-gray-400">Price: </span>${selectedReservation.tableDetails.pricePerHour}
                                                /hour
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-gray-400">Description: </span>
                                                {selectedReservation.tableDetails.description}
                                            </p>
                                            {selectedReservation.tableDetails.amenities.length > 0 && (
                                                <div>
                                                    <span className="text-sm text-gray-400">Amenities: </span>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {selectedReservation.tableDetails.amenities.map((amenity) => (
                                                            <span key={amenity} className="px-2 py-1 bg-[#333] text-xs rounded-full">
                                {getAmenityLabel(amenity)}
                              </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium mb-4">Additional Information</h4>
                                    <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                                        <h5 className="text-sm font-medium mb-2">Special Requests</h5>
                                        {selectedReservation.specialRequests ? (
                                            <p className="text-sm">{selectedReservation.specialRequests}</p>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No special requests</p>
                                        )}
                                    </div>

                                    <div className="bg-[#2a2a2a] rounded-lg p-4">
                                        <h5 className="text-sm font-medium mb-2">Staff Notes</h5>
                                        {selectedReservation.notes ? (
                                            <p className="text-sm">{selectedReservation.notes}</p>
                                        ) : (
                                            <p className="text-sm text-gray-400 italic">No notes</p>
                                        )}
                                    </div>

                                    {selectedReservation.status === "cancelled" && selectedReservation.cancellationReason && (
                                        <div className="bg-[#2a2a2a] rounded-lg p-4 mt-4">
                                            <h5 className="text-sm font-medium mb-2">Cancellation Reason</h5>
                                            <p className="text-sm">{selectedReservation.cancellationReason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-6 flex flex-wrap gap-4 justify-between">
                                <div className="space-x-2">
                                    <button className="bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-lg transition-colors">
                                        <Download size={18} className="inline mr-2" />
                                        Export Details
                                    </button>
                                </div>

                                <div className="space-x-2">
                                    {selectedReservation.status === "pending" && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(selectedReservation._id, "cancelled")}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <X size={18} className="inline mr-2" />
                                                Cancel Reservation
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(selectedReservation._id, "confirmed")}
                                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                <Check size={18} className="inline mr-2" />
                                                Confirm Reservation
                                            </button>
                                        </>
                                    )}

                                    {selectedReservation.status === "confirmed" && (
                                        <button
                                            onClick={() => handleStatusChange(selectedReservation._id, "seated")}
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <Check size={18} className="inline mr-2" />
                                            Mark as Seated
                                        </button>
                                    )}

                                    {selectedReservation.status === "seated" && (
                                        <button
                                            onClick={() => handleStatusChange(selectedReservation._id, "completed")}
                                            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <Check size={18} className="inline mr-2" />
                                            Mark as Completed
                                        </button>
                                    )}

                                    {(selectedReservation.status === "confirmed" || selectedReservation.status === "pending") && (
                                        <button
                                            onClick={() => handleStatusChange(selectedReservation._id, "no-show")}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                                        >
                                            <X size={18} className="inline mr-2" />
                                            Mark as No-Show
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* New Reservation Modal */}
            {showNewReservationModal && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
                            <h3 className="text-xl font-bold">New Reservation</h3>
                            <button onClick={() => setShowNewReservationModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleNewReservationSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-lg font-medium mb-4">Customer Information</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="customerName" className="block text-sm font-medium text-gray-400 mb-1">
                                                Customer Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="customerName"
                                                required
                                                value={newReservation.customerDetails.name}
                                                onChange={(e) =>
                                                    setNewReservation({
                                                        ...newReservation,
                                                        customerDetails: {
                                                            ...newReservation.customerDetails,
                                                            name: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                placeholder="e.g., John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-400 mb-1">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="customerEmail"
                                                required
                                                value={newReservation.customerDetails.email}
                                                onChange={(e) =>
                                                    setNewReservation({
                                                        ...newReservation,
                                                        customerDetails: {
                                                            ...newReservation.customerDetails,
                                                            email: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                placeholder="e.g., john.doe@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-400 mb-1">
                                                Phone *
                                            </label>
                                            <input
                                                type="tel"
                                                id="customerPhone"
                                                required
                                                value={newReservation.customerDetails.phone}
                                                onChange={(e) =>
                                                    setNewReservation({
                                                        ...newReservation,
                                                        customerDetails: {
                                                            ...newReservation.customerDetails,
                                                            phone: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                placeholder="e.g., +1 (123) 456-7890"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="source" className="block text-sm font-medium text-gray-400 mb-1">
                                                Reservation Source
                                            </label>
                                            <select
                                                id="source"
                                                value={newReservation.source}
                                                onChange={(e) => setNewReservation({ ...newReservation, source: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="website">Website</option>
                                                <option value="phone">Phone</option>
                                                <option value="in-person">In Person</option>
                                                <option value="mobile-app">Mobile App</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium mb-4">Reservation Details</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="table" className="block text-sm font-medium text-gray-400 mb-1">
                                                Table *
                                            </label>
                                            <select
                                                id="table"
                                                required
                                                value={newReservation.table}
                                                onChange={(e) => setNewReservation({ ...newReservation, table: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="">Select a table</option>
                                                {mockTables
                                                    .filter((table) => table.isActive)
                                                    .map((table) => (
                                                        <option key={table._id} value={table._id}>
                                                            {table.tableNumber} - {table.name} ({table.capacity} people)
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="reservationDate" className="block text-sm font-medium text-gray-400 mb-1">
                                                Date *
                                            </label>
                                            <input
                                                type="date"
                                                id="reservationDate"
                                                required
                                                value={newReservation.reservationDate}
                                                onChange={(e) => setNewReservation({ ...newReservation, reservationDate: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-400 mb-1">
                                                    Start Time *
                                                </label>
                                                <input
                                                    type="time"
                                                    id="startTime"
                                                    required
                                                    value={newReservation.startTime}
                                                    onChange={(e) => setNewReservation({ ...newReservation, startTime: e.target.value })}
                                                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-400 mb-1">
                                                    End Time *
                                                </label>
                                                <input
                                                    type="time"
                                                    id="endTime"
                                                    required
                                                    value={newReservation.endTime}
                                                    onChange={(e) => setNewReservation({ ...newReservation, endTime: e.target.value })}
                                                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="partySize" className="block text-sm font-medium text-gray-400 mb-1">
                                                Party Size *
                                            </label>
                                            <input
                                                type="number"
                                                id="partySize"
                                                required
                                                min="1"
                                                value={newReservation.partySize}
                                                onChange={(e) => setNewReservation({ ...newReservation, partySize: Number(e.target.value) })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="status" className="block text-sm font-medium text-gray-400 mb-1">
                                                Status
                                            </label>
                                            <select
                                                id="status"
                                                value={newReservation.status}
                                                onChange={(e) => setNewReservation({ ...newReservation, status: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-400 mb-1">
                                        Special Requests
                                    </label>
                                    <textarea
                                        id="specialRequests"
                                        rows={3}
                                        value={newReservation.specialRequests}
                                        onChange={(e) => setNewReservation({ ...newReservation, specialRequests: e.target.value })}
                                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        placeholder="Any special requests from the customer..."
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-400 mb-1">
                                        Staff Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        rows={3}
                                        value={newReservation.notes}
                                        onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}
                                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        placeholder="Internal notes for staff..."
                                    ></textarea>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowNewReservationModal(false)}
                                    className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                                >
                                    <Save size={18} className="inline mr-2" />
                                    Create Reservation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Reservation Modal */}
            {showEditReservationModal && editingReservation && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
                            <h3 className="text-xl font-bold">Edit Reservation - {editingReservation.reservationNumber}</h3>
                            <button onClick={() => setShowEditReservationModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleEditReservationSubmit} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <h4 className="text-lg font-medium mb-4">Customer Information</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="edit-customerName" className="block text-sm font-medium text-gray-400 mb-1">
                                                Customer Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="edit-customerName"
                                                required
                                                value={editingReservation.customerDetails.name}
                                                onChange={(e) =>
                                                    setEditingReservation({
                                                        ...editingReservation,
                                                        customerDetails: {
                                                            ...editingReservation.customerDetails,
                                                            name: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="edit-customerEmail" className="block text-sm font-medium text-gray-400 mb-1">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                id="edit-customerEmail"
                                                required
                                                value={editingReservation.customerDetails.email}
                                                onChange={(e) =>
                                                    setEditingReservation({
                                                        ...editingReservation,
                                                        customerDetails: {
                                                            ...editingReservation.customerDetails,
                                                            email: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="edit-customerPhone" className="block text-sm font-medium text-gray-400 mb-1">
                                                Phone *
                                            </label>
                                            <input
                                                type="tel"
                                                id="edit-customerPhone"
                                                required
                                                value={editingReservation.customerDetails.phone}
                                                onChange={(e) =>
                                                    setEditingReservation({
                                                        ...editingReservation,
                                                        customerDetails: {
                                                            ...editingReservation.customerDetails,
                                                            phone: e.target.value,
                                                        },
                                                    })
                                                }
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="edit-source" className="block text-sm font-medium text-gray-400 mb-1">
                                                Reservation Source
                                            </label>
                                            <select
                                                id="edit-source"
                                                value={editingReservation.source}
                                                onChange={(e) => setEditingReservation({ ...editingReservation, source: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="website">Website</option>
                                                <option value="phone">Phone</option>
                                                <option value="in-person">In Person</option>
                                                <option value="mobile-app">Mobile App</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-medium mb-4">Reservation Details</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="edit-table" className="block text-sm font-medium text-gray-400 mb-1">
                                                Table *
                                            </label>
                                            <select
                                                id="edit-table"
                                                required
                                                value={editingReservation.table}
                                                onChange={(e) => setEditingReservation({ ...editingReservation, table: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                {mockTables
                                                    .filter((table) => table.isActive)
                                                    .map((table) => (
                                                        <option key={table._id} value={table._id}>
                                                            {table.tableNumber} - {table.name} ({table.capacity} people)
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="edit-partySize" className="block text-sm font-medium text-gray-400 mb-1">
                                                Party Size *
                                            </label>
                                            <input
                                                type="number"
                                                id="edit-partySize"
                                                required
                                                min="1"
                                                value={editingReservation.partySize}
                                                onChange={(e) =>
                                                    setEditingReservation({ ...editingReservation, partySize: Number(e.target.value) })
                                                }
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="edit-status" className="block text-sm font-medium text-gray-400 mb-1">
                                                Status
                                            </label>
                                            <select
                                                id="edit-status"
                                                value={editingReservation.status}
                                                onChange={(e) => setEditingReservation({ ...editingReservation, status: e.target.value })}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="seated">Seated</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="no-show">No-Show</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label htmlFor="edit-specialRequests" className="block text-sm font-medium text-gray-400 mb-1">
                                        Special Requests
                                    </label>
                                    <textarea
                                        id="edit-specialRequests"
                                        rows={3}
                                        value={editingReservation.specialRequests}
                                        onChange={(e) => setEditingReservation({ ...editingReservation, specialRequests: e.target.value })}
                                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    ></textarea>
                                </div>

                                <div>
                                    <label htmlFor="edit-notes" className="block text-sm font-medium text-gray-400 mb-1">
                                        Staff Notes
                                    </label>
                                    <textarea
                                        id="edit-notes"
                                        rows={3}
                                        value={editingReservation.notes}
                                        onChange={(e) => setEditingReservation({ ...editingReservation, notes: e.target.value })}
                                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="border-t border-gray-800 pt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditReservationModal(false)}
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
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirmation && selectedReservation && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1E1E1E] rounded-xl w-full max-w-md p-6">
                        <h3 className="text-xl font-bold mb-4">Cancel Reservation</h3>
                        <p className="mb-6">
                            Are you sure you want to cancel the reservation{" "}
                            <span className="font-semibold">{selectedReservation.reservationNumber}</span> for{" "}
                            {selectedReservation.customerDetails.name}?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteConfirmation(false)}
                                className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] rounded-lg transition-colors"
                            >
                                No, Keep It
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/*/!* Table Layout Modal *!/*/}
            {/*{showTableLayout && (*/}
            {/*    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">*/}
            {/*        <div className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">*/}
            {/*            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">*/}
            {/*                <h3 className="text-xl font-bold">Restaurant Table Layout</h3>*/}
            {/*                <button onClick={() => setShowTableLayout(false)}>*/}
            {/*                    <X size={24} />*/}
            {/*                </button>*/}
            {/*            </div>*/}

            {/*            <div className="p-6">*/}
            {/*                <div className="flex justify-between items-center mb-6">*/}
            {/*                    <h2 className="text-xl font-bold">Table Status</h2>*/}
            {/*                    <div className="flex flex-wrap gap-4">*/}
            {/*                        <div className="flex items-center gap-2">*/}
            {/*                            <div className="w-3 h-3 rounded-full bg-green-500" />*/}
            {/*                            <span className="text-xs">Available</span>*/}
            {/*                        </div>*/}
            {/*                        <div className="flex items-center gap-2">*/}
            {/*                            <div className="w-3 h-3 rounded-full bg-red-500" />*/}
            {/*                            <span className="text-xs">Reserved</span>*/}
            {/*                        </div>*/}
            {/*                        <div className="flex items-center gap-2">*/}
            {/*                            <div className="w-3 h-3 rounded-full bg-gray-400" />*/}
            {/*                            <span className="text-xs">Filled</span>*/}
            {/*                        </div>*/}
            {/*                        <div className="flex items-center gap-2">*/}
            {/*                            <div className="w-3 h-3 rounded-full bg-amber-500" />*/}
            {/*                            <span className="text-xs">Available Soon</span>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                </div>*/}

            {/*                <div className="flex items-center gap-4 mb-6">*/}
            {/*                    <div className="flex items-center">*/}
            {/*                        <div className="relative flex items-center bg-[#2a2a2a] text-white rounded-lg py-3 px-4">*/}
            {/*                            <Users size={18} className="mr-2 text-gray-400" />*/}
            {/*                            <span>*/}
            {/*          {peopleCount} {peopleCount === 1 ? "person" : "people"}*/}
            {/*        </span>*/}
            {/*                            <div className="ml-4 flex flex-col">*/}
            {/*                                <button*/}
            {/*                                    type="button"*/}
            {/*                                    onClick={incrementPeople}*/}
            {/*                                    className="px-2 text-gray-400 hover:text-white focus:outline-none"*/}
            {/*                                >*/}
            {/*                                    <ChevronUp size={16} />*/}
            {/*                                </button>*/}
            {/*                                <button*/}
            {/*                                    type="button"*/}
            {/*                                    onClick={decrementPeople}*/}
            {/*                                    className="px-2 text-gray-400 hover:text-white focus:outline-none"*/}
            {/*                                >*/}
            {/*                                    <ChevronDown size={16} />*/}
            {/*                                </button>*/}
            {/*                            </div>*/}
            {/*                        </div>*/}
            {/*                    </div>*/}
            {/*                    <p className="text-sm text-gray-400">Select a table that can accommodate your party size</p>*/}
            {/*                </div>*/}

            {/*                <div className="overflow-auto px-28" style={{ maxHeight: "600px", maxWidth: "100%" }}>*/}
            {/*                    <div style={{ width: "1200px", height: "auto", minHeight: "800px" }}>*/}
            {/*                        {Object.entries(tablesByRow).map(([rowIndex, rowTables]) => {*/}
            {/*                            const rowNumber = Number.parseInt(rowIndex)*/}
            {/*                            return (*/}
            {/*                                <div key={rowIndex} className="relative" style={{ height: "200px", marginBottom: "24px" }}>*/}
            {/*                                    {rowTables.map((table) => {*/}
            {/*                                        // Calculate absolute positioning based on grid*/}
            {/*                                        const colWidth = 170 // Fixed column width*/}
            {/*                                        const colGap = 32 // Fixed gap between columns (16px on each side)*/}
            {/*                                        const totalColWidth = colWidth + colGap*/}

            {/*                                        // Calculate left position based on column*/}
            {/*                                        const leftPos = table.position.col * totalColWidth*/}

            {/*                                        // Adjust width for tables that span multiple columns*/}
            {/*                                        const width = table.position.colSpan === 2 ? colWidth * 2 + colGap : colWidth*/}

            {/*                                        return (*/}
            {/*                                            <div*/}
            {/*                                                key={table.id}*/}
            {/*                                                className="absolute"*/}
            {/*                                                style={{*/}
            {/*                                                    left: `${leftPos}px`,*/}
            {/*                                                    top: "0",*/}
            {/*                                                    width: `${width}px`,*/}
            {/*                                                    height: "170px",*/}
            {/*                                                }}*/}
            {/*                                            >*/}
            {/*                                                {renderTable(table)}*/}
            {/*                                            </div>*/}
            {/*                                        )*/}
            {/*                                    })}*/}
            {/*                                </div>*/}
            {/*                            )*/}
            {/*                        })}*/}
            {/*                    </div>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    )
}