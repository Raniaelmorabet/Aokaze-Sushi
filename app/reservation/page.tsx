"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, Users, Check, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react"
import { useLanguage } from "@/context/language-context"

type TableStatus = "available" | "reserved" | "filled" | "availableSoon"
type TableShape = "round" | "oval" | "rectangular"

interface Table {
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

export default function ReservationPage() {
    const { t } = useLanguage()
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        guests: "2",
        name: "",
        email: "",
        phone: "",
        specialRequests: "",
        tableId: null,
    })

    const initialTables: Table[] = [
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

    const [tables, setTables] = useState<Table[]>(initialTables)
    const [peopleCount, setPeopleCount] = useState(2)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setStep(3)
    }

    const nextStep = () => {
        setStep(step + 1)
        window.scrollTo(0, 0)
    }

    const prevStep = () => {
        setStep(step - 1)
        window.scrollTo(0, 0)
    }

    const getStatusColor = (status: TableStatus) => {
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
        setTables(
            tables.map((table) => {
                if (table.status !== "available") return table
                return table.id === id ? { ...table, selected: !table.selected } : { ...table, selected: false }
            }),
        )

        const selectedTable = tables.find((t) => t.id === id)
        if (selectedTable && selectedTable.status === "available") {
            setFormData({ ...formData, tableId: id })
        }
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

    const renderTable = (table: Table) => {
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
                className={`flex justify-center items-center font-medium text-gray-700 z-10 relative rounded-full w-12 h-12 ${getStatusColor(table.status)}`}
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

    const tablesByRow = tables.reduce(
        (acc, table) => {
            const { row } = table.position
            if (!acc[row]) acc[row] = []
            acc[row].push(table)
            return acc
        },
        {} as Record<number, Table[]>,
    )

    const selectedTable = tables.find((table) => table.selected)

    const incrementPeople = () => {
        if (peopleCount < 8) {
            setPeopleCount(peopleCount + 1)
            setFormData({ ...formData, guests: String(peopleCount + 1) })
            // Deselect table if it doesn't have enough capacity
            if (selectedTable && selectedTable.capacity < peopleCount + 1) {
                setTables(tables.map((table) => ({ ...table, selected: false })))
                setFormData({ ...formData, tableId: null, guests: String(peopleCount + 1) })
            }
        }
    }

    const decrementPeople = () => {
        if (peopleCount > 1) {
            setPeopleCount(peopleCount - 1)
            setFormData({ ...formData, guests: String(peopleCount - 1) })
        }
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white">
            {/* Header */}
            <header className="bg-[#1a1a1a] shadow-md py-4">
                <div className="container mx-auto px-4 flex items-center">
                    <Link href="/" className="flex items-center gap-2 text-white hover:text-orange-500 transition-colors">
                        <ArrowLeft size={20} />
                        <span>Back to Home</span>
                    </Link>
                    <h1 className="text-2xl font-bold mx-auto">Table Reservation</h1>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {/* Progress Steps */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex justify-between">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"}`}
                            >
                                1
                            </div>
                            <span className={`mt-2 text-sm ${step >= 1 ? "text-white" : "text-gray-400"}`}>
                {t("reservation.steps.dateTime")}
              </span>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className={`h-1 w-full ${step >= 2 ? "bg-orange-500" : "bg-gray-700"}`}></div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"}`}
                            >
                                2
                            </div>
                            <span className={`mt-2 text-sm ${step >= 2 ? "text-white" : "text-gray-400"}`}>
                {t("reservation.steps.info")}
              </span>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className={`h-1 w-full ${step >= 3 ? "bg-orange-500" : "bg-gray-700"}`}></div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? "bg-orange-500 text-white" : "bg-gray-700 text-gray-400"}`}
                            >
                                3
                            </div>
                            <span className={`mt-2 text-sm ${step >= 3 ? "text-white" : "text-gray-400"}`}>Confirmation</span>
                        </div>
                    </div>
                </div>

                {step === 1 && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <div className="flex flex-col gap-8">
                            {/* Top - Date, Time, People */}
                            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl">
                                <h2 className="text-xl font-bold mb-6">Reservation Details</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">{t("reservation.date")}</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 pl-10"
                                                required
                                            />
                                            <Calendar
                                                size={18}
                                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">{t("reservation.time")}</label>
                                        <div className="relative">
                                            <select
                                                name="time"
                                                value={formData.time}
                                                onChange={handleChange}
                                                className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 pl-10 appearance-none"
                                                required
                                            >
                                                <option value="">{t("reservation.selectTime")}</option>
                                                <option value="11:00">11:00 AM</option>
                                                <option value="12:00">12:00 PM</option>
                                                <option value="13:00">1:00 PM</option>
                                                <option value="14:00">2:00 PM</option>
                                                <option value="18:00">6:00 PM</option>
                                                <option value="19:00">7:00 PM</option>
                                                <option value="20:00">8:00 PM</option>
                                                <option value="21:00">9:00 PM</option>
                                            </select>
                                            <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <ChevronDown
                                                size={18}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">{t("reservation.guests")}</label>
                                        <div className="flex items-center">
                                            <div className="relative flex items-center bg-[#2a2a2a] text-white rounded-lg w-full py-3">
                                                <Users size={18} className="absolute left-3 text-gray-400" />
                                                <span className="pl-10">
                          {peopleCount} {peopleCount === 1 ? t("reservation.person") : t("reservation.people")}
                        </span>
                                                <div className="ml-auto flex flex-col mr-3">
                                                    <button
                                                        type="button"
                                                        onClick={incrementPeople}
                                                        className="px-2 text-gray-400 hover:text-white focus:outline-none"
                                                    >
                                                        <ChevronUp size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={decrementPeople}
                                                        className="px-2 text-gray-400 hover:text-white focus:outline-none"
                                                    >
                                                        <ChevronDown size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom - Table Selection */}
                            <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Select a Table</h2>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500" />
                                            <span className="text-xs">Available</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500" />
                                            <span className="text-xs">Reserved</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-gray-400" />
                                            <span className="text-xs">Filled</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                                            <span className="text-xs">Available Soon</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-auto p-4" style={{ maxHeight: "600px", maxWidth: "100%" }}>
                                    <div style={{ width: "1200px", height: "auto", minHeight: "800px" }}>
                                        {Object.entries(tablesByRow).map(([rowIndex, rowTables]) => {
                                            const rowNumber = Number.parseInt(rowIndex)
                                            return (
                                                <div key={rowIndex} className="relative" style={{ height: "200px", marginBottom: "24px" }}>
                                                    {rowTables.map((table) => {
                                                        // Calculate absolute positioning based on grid
                                                        const colWidth = 170 // Fixed column width
                                                        const colGap = 32 // Fixed gap between columns (16px on each side)
                                                        const totalColWidth = colWidth + colGap

                                                        // Calculate left position based on column
                                                        const leftPos = table.position.col * totalColWidth

                                                        // Adjust width for tables that span multiple columns
                                                        const width = table.position.colSpan === 2 ? colWidth * 2 + colGap : colWidth

                                                        return (
                                                            <div
                                                                key={table.id}
                                                                className="absolute"
                                                                style={{
                                                                    left: `${leftPos}px`,
                                                                    top: "0",
                                                                    width: `${width}px`,
                                                                    height: "170px",
                                                                }}
                                                            >
                                                                {renderTable(table)}
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <div>
                                        {selectedTable ? (
                                            <div className="bg-[#2a2a2a] p-3 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full ${getStatusColor(selectedTable.status)}`}></div>
                                                    <div>
                                                        <p className="font-medium">Table {selectedTable.name}</p>
                                                        <p className="text-sm text-gray-400">Capacity: {selectedTable.capacity} people</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-gray-400 text-sm">Please select a table from the layout</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={nextStep}
                                        disabled={!formData.date || !formData.time || !formData.tableId}
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {t("reservation.next")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        className="max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold mb-6">{t("reservation.steps.info")}</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">{t("reservation.name")}</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm text-gray-400 mb-2">{t("reservation.email")}</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm text-gray-400 mb-2">{t("reservation.phone")}</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm text-gray-400 mb-2">{t("reservation.specialRequests")}</label>
                                    <textarea
                                        name="specialRequests"
                                        value={formData.specialRequests}
                                        onChange={handleChange}
                                        className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 min-h-[120px]"
                                        placeholder="Any special requirements or notes..."
                                    ></textarea>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="bg-[#2a2a2a] hover:bg-[#333] text-white px-6 py-3 rounded-lg transition-colors"
                                    >
                                        {t("reservation.back")}
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
                                    >
                                        {t("reservation.reserve")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        className="max-w-2xl mx-auto"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="bg-[#1E1E1E] rounded-xl p-8 shadow-xl text-center">
                            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6">
                                <Check size={36} />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">{t("reservation.steps.confirmation")}</h2>
                            <p className="text-gray-400 mb-8 max-w-md mx-auto">{t("reservation.success")}</p>

                            <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8 max-w-md mx-auto">
                                <div className="flex justify-between mb-3">
                                    <span className="text-gray-400">{t("reservation.details.date")}</span>
                                    <span>{formData.date}</span>
                                </div>
                                <div className="flex justify-between mb-3">
                                    <span className="text-gray-400">{t("reservation.details.time")}</span>
                                    <span>{formData.time}</span>
                                </div>
                                <div className="flex justify-between mb-3">
                                    <span className="text-gray-400">{t("reservation.details.guests")}</span>
                                    <span>{formData.guests}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Table:</span>
                                    <span>{selectedTable?.name || "Not selected"}</span>
                                </div>
                            </div>

                            <Link
                                href="/"
                                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-colors inline-block"
                            >
                                {t("reservation.done")}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}