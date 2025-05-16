"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Users,
  X,
  Check,
  Edit,
  ChevronLeft,
  ChevronRight,
  Eye,
  Save,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  CheckCheck,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { reservationAPI } from "@/utils/api";
import Loading from "./loading";

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
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=100&auto=format&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=100&auto=format&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=100&auto=format&fit=crop",
    ],
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
    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=100&auto=format&fit=crop",
    ],
  },
];


// Add more reservations for today and upcoming days
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [loading, setLoaning] = useState(true);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewReservationModal, setShowNewReservationModal] = useState(false);
  const [showEditReservationModal, setShowEditReservationModal] =
    useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

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
  });

  // Filter reservations based on status, date, and search query
  const filteredReservations = reservations.filter((reservation) => {
    // Status filter
    if (selectedStatus !== "all" && reservation.status !== selectedStatus) {
      return false;
    }

    // Date filter
    if (selectedDate === "today") {
      const today = new Date().toISOString().split("T")[0];
      const reservationDate = new Date(reservation.reservationDate)
        .toISOString()
        .split("T")[0];
      if (reservationDate !== today) {
        return false;
      }
    } else if (selectedDate === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      const reservationDate = new Date(reservation.reservationDate)
        .toISOString()
        .split("T")[0];
      if (reservationDate !== tomorrowStr) {
        return false;
      }
    } else if (selectedDate === "upcoming") {
      const today = new Date();
      const reservationDate = new Date(reservation.reservationDate);
      if (reservationDate < today) {
        return false;
      }
    } else if (selectedDate === "past") {
      const today = new Date();
      const reservationDate = new Date(reservation.reservationDate);
      if (reservationDate >= today) {
        return false;
      }
    }

    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        reservation.reservationNumber.toLowerCase().includes(query) ||
        reservation.customerDetails.name.toLowerCase().includes(query) ||
        reservation.customerDetails.email.toLowerCase().includes(query) ||
        reservation.customerDetails.phone.toLowerCase().includes(query) ||
        reservation.table.tableNumber.toLowerCase().includes(query) ||
        reservation.table.name.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const viewReservationDetails = (reservation) => {
    setSelectedReservation(reservation);
    setShowReservationDetails(true);
  };

  const handleEditReservation = (reservation) => {
    setSelectedReservation(reservation);
    setShowEditReservationModal(true);
  };

  const getReservations = async () => {
    setLoaning(true)
    try {
      const response = await reservationAPI.getReservations();
      setReservations(response.data);
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
        setLoaning(false)
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-500";
      case "pending":
        return "bg-yellow-500/20 text-yellow-500";
      case "seated":
        return "bg-blue-500/20 text-blue-500";
      case "completed":
        return "bg-purple-500/20 text-purple-500";
      case "cancelled":
        return "bg-red-500/20 text-red-500";
      case "no-show":
        return "bg-gray-500/20 text-gray-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const durationMinutes = durationMs / (1000 * 60);

    if (durationMinutes < 60) {
      return `${durationMinutes} min`;
    } else {
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
    }
  };

  const getLocationLabel = (location) => {
    switch (location) {
      case "indoor":
        return "Indoor";
      case "outdoor":
        return "Outdoor";
      case "patio":
        return "Patio";
      case "bar":
        return "Bar";
      case "private-room":
        return "Private Room";
      default:
        return location;
    }
  };

  const getAmenityLabel = (amenity) => {
    switch (amenity) {
      case "power-outlet":
        return "Power Outlet";
      case "window-view":
        return "Window View";
      case "sofa":
        return "Sofa";
      case "high-chair":
        return "High Chair";
      case "wheelchair-accessible":
        return "Wheelchair Accessible";
      default:
        return amenity;
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await reservationAPI.updateReservationStatus(
        selectedReservation._id,
        newStatus
      );
      if (response.success) {
        setReservations(
          reservations.map((res) => {
            if (res._id === selectedReservation._id) {
              return {
                ...res,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                ...(newStatus === "seated"
                  ? { checkedInAt: new Date().toISOString() }
                  : {}),
                ...(newStatus === "completed"
                  ? { completedAt: new Date().toISOString() }
                  : {}),
              };
            }
            return res;
          })
        );
        // Close the modal
        setShowEditReservationModal(false);
        setSelectedReservation(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewReservationSubmit = (e) => {
    e.preventDefault();

    // Find the selected table
    const selectedTable = mockTables.find(
      (table) => table._id === newReservation.table
    );

    // Create a new reservation with a unique ID and reservation number
    const reservationDate = new Date(newReservation.reservationDate);
    const dateStr = reservationDate
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    // Calculate duration and price
    const startTime = new Date(
      `${newReservation.reservationDate}T${newReservation.startTime}`
    );
    const endTime = new Date(
      `${newReservation.reservationDate}T${newReservation.endTime}`
    );
    const durationMs = endTime - startTime;
    const durationHours = durationMs / (1000 * 60 * 60);
    const totalPrice =
      Math.round(durationHours * selectedTable.pricePerHour * 100) / 100;

    const newReservationWithId = {
      ...newReservation,
      _id: `r${reservations.length + 1}`,
      reservationNumber: `RES-${dateStr}-${randomNum}`,
      table: selectedTable,
      reservationDate: reservationDate.toISOString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add the new reservation to the reservations array
    setReservations([...reservations, newReservationWithId]);

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
    });
    setShowNewReservationModal(false);
  };

  const handleDeleteConfirm = () => {
    // Remove the reservation from the reservations array
    setReservations(
      reservations.filter((res) => res._id !== selectedReservation._id)
    );

    // Close the modal
    setShowDeleteConfirmation(false);
  };

  useEffect(() => {
    getReservations();
  }, []);

    if (loading) return <Loading />;
  return (
    <div>
      {/* Header */}
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
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>

          {/* <button
            onClick={() => setShowNewReservationModal(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Calendar size={18} />
            <span>New Reservation</span>
          </button> */}
        </div>
      </div>

      <div className="bg-[#1E1E1E] rounded-xl shadow-md overflow-hidden mb-8">
        {/* Filteration Status Tabs */}
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedStatus("all")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "all"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            All Reservations
          </button>
          <button
            onClick={() => setSelectedStatus("pending")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "pending"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setSelectedStatus("confirmed")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "confirmed"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setSelectedStatus("seated")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "seated"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Seated
          </button>
          <button
            onClick={() => setSelectedStatus("completed")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "completed"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setSelectedStatus("cancelled")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "cancelled"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Cancelled
          </button>
          <button
            onClick={() => setSelectedStatus("no-show")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedStatus === "no-show"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            No-Show
          </button>
        </div>

        {/* Filteration Time Tabs */}
        <div className="p-4 border-b border-gray-800 flex flex-wrap gap-4">
          <button
            onClick={() => setSelectedDate("all")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedDate === "all"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            All Dates
          </button>
          <button
            onClick={() => setSelectedDate("today")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedDate === "today"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Today
          </button>
          <button
            onClick={() => setSelectedDate("tomorrow")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedDate === "tomorrow"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => setSelectedDate("upcoming")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedDate === "upcoming"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setSelectedDate("past")}
            className={`px-4 py-2 rounded-lg text-sm ${
              selectedDate === "past"
                ? "bg-orange-500 text-white"
                : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
            }`}
          >
            Past
          </button>
        </div>

        {/* Table of reservations */}
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
                <tr
                  key={reservation._id}
                  className="hover:bg-[#2a2a2a] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {reservation.reservationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      <p className="font-medium">
                        {reservation.customerDetails.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {reservation.customerDetails.email}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md overflow-hidden">
                        <Image
                          src={
                            reservation.table.images[0] || "/placeholder.svg"
                          }
                          alt={reservation.table.name}
                          width={32}
                          height={32}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{reservation.table.name}</p>
                        <p className="text-xs text-gray-400">
                          {getLocationLabel(reservation.table.location)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      <p>{formatDate(reservation.reservationDate)}</p>
                      <p className="text-xs text-gray-400">
                        {formatTime(reservation.startTime)} -{" "}
                        {formatTime(reservation.endTime)}
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
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                        reservation.status
                      )}`}
                    >
                      {reservation.status.charAt(0).toUpperCase() +
                        reservation.status.slice(1)}
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReservations.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-400">
              No reservations found matching your filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <p className="text-sm text-gray-400">
            Showing {filteredReservations.length} of {reservations.length}{" "}
            reservations
          </p>
          {/* <div className="flex gap-2">
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm disabled:opacity-50">
              <ChevronLeft size={16} />
            </button>
            <button className="px-3 py-1 bg-orange-500 rounded-md text-sm">
              1
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">
              2
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">
              3
            </button>
            <button className="px-3 py-1 bg-[#2a2a2a] rounded-md text-sm hover:bg-[#333]">
              <ChevronRight size={16} />
            </button>
          </div> */}
        </div>
      </div>

      {/* Reservation Details Modal */}
      {showReservationDetails && selectedReservation && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-[#1E1E1E] z-10">
              <h3 className="text-xl font-bold">
                Reservation Details - {selectedReservation.reservationNumber}
              </h3>
              <button onClick={() => setShowReservationDetails(false)}>
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Customer Information */}
                <div>
                  <h4 className="text-lg font-medium mb-4">
                    Customer Information
                  </h4>
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
                {/* Reservation Information */}
                <div>
                  <h4 className="text-lg font-medium mb-4">
                    Reservation Information
                  </h4>
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Date:</span>
                        <span>
                          {formatDate(selectedReservation.reservationDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span>
                          {formatTime(selectedReservation.startTime)} -{" "}
                          {formatTime(selectedReservation.endTime)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span>
                          {getDuration(
                            selectedReservation.startTime,
                            selectedReservation.endTime
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Party Size:</span>
                        <span>{selectedReservation.partySize} people</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                            selectedReservation.status
                          )}`}
                        >
                          {selectedReservation.status.charAt(0).toUpperCase() +
                            selectedReservation.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Source:</span>
                        <span>
                          {selectedReservation.source.charAt(0).toUpperCase() +
                            selectedReservation.source.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Price:</span>
                        <span className="font-bold">
                          ${selectedReservation.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Table Information */}
                <div>
                  <h4 className="text-lg font-medium mb-4">
                    Table Information
                  </h4>
                  <div className="bg-[#2a2a2a] rounded-lg p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={
                            selectedReservation.table.images[0] ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={selectedReservation.table.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium">
                          {selectedReservation.table.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {selectedReservation.table.tableNumber} •{" "}
                          {getLocationLabel(selectedReservation.table.location)}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-gray-400">Capacity: </span>
                        {selectedReservation.table.capacity} people
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400">Price: </span>$
                        {selectedReservation.table.pricePerHour}
                        /hour
                      </p>
                      <p className="text-sm">
                        <span className="text-gray-400">Description: </span>
                        {selectedReservation.table.description}
                      </p>
                      {selectedReservation.table.amenities.length > 0 && (
                        <div>
                          <span className="text-sm text-gray-400">
                            Amenities:{" "}
                          </span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedReservation.table.amenities.map(
                              (amenity) => (
                                <span
                                  key={amenity}
                                  className="px-2 py-1 bg-[#333] text-xs rounded-full"
                                >
                                  {getAmenityLabel(amenity)}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* Additional Information */}
                <div>
                  <h4 className="text-lg font-medium mb-4">
                    Additional Information
                  </h4>
                  <div className="bg-[#2a2a2a] rounded-lg p-4 mb-4">
                    <h5 className="text-sm font-medium mb-2">
                      Special Requests
                    </h5>
                    {selectedReservation.specialRequests ? (
                      <p className="text-sm">
                        {selectedReservation.specialRequests}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No special requests
                      </p>
                    )}
                  </div>

                  {selectedReservation.status === "cancelled" &&
                    selectedReservation.cancellationReason && (
                      <div className="bg-[#2a2a2a] rounded-lg p-4 mt-4">
                        <h5 className="text-sm font-medium mb-2">
                          Cancellation Reason
                        </h5>
                        <p className="text-sm">
                          {selectedReservation.cancellationReason}
                        </p>
                      </div>
                    )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="border-t border-gray-800 pt-6 flex flex-wrap gap-4 justify-between">
                <div />
                <button
                  className="bg-orange-500 px-3 py-2 rounded-sm hover:bg-orange-600 duration-200"
                  onClick={() => {
                    handleEditReservation(selectedReservation);
                    setShowReservationDetails(false);
                  }}
                >
                  Change Status
                </button>
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
                  <h4 className="text-lg font-medium mb-4">
                    Customer Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="customerName"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
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
                      <label
                        htmlFor="customerEmail"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
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
                      <label
                        htmlFor="customerPhone"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
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
                      <label
                        htmlFor="source"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Reservation Source
                      </label>
                      <select
                        id="source"
                        value={newReservation.source}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            source: e.target.value,
                          })
                        }
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
                  <h4 className="text-lg font-medium mb-4">
                    Reservation Details
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="table"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Table *
                      </label>
                      <select
                        id="table"
                        required
                        value={newReservation.table}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            table: e.target.value,
                          })
                        }
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="">Select a table</option>
                        {mockTables
                          .filter((table) => table.isActive)
                          .map((table) => (
                            <option key={table._id} value={table._id}>
                              {table.tableNumber} - {table.name} (
                              {table.capacity} people)
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="reservationDate"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Date *
                      </label>
                      <input
                        type="date"
                        id="reservationDate"
                        required
                        value={newReservation.reservationDate}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            reservationDate: e.target.value,
                          })
                        }
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="startTime"
                          className="block text-sm font-medium text-gray-400 mb-1"
                        >
                          Start Time *
                        </label>
                        <input
                          type="time"
                          id="startTime"
                          required
                          value={newReservation.startTime}
                          onChange={(e) =>
                            setNewReservation({
                              ...newReservation,
                              startTime: e.target.value,
                            })
                          }
                          className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="endTime"
                          className="block text-sm font-medium text-gray-400 mb-1"
                        >
                          End Time *
                        </label>
                        <input
                          type="time"
                          id="endTime"
                          required
                          value={newReservation.endTime}
                          onChange={(e) =>
                            setNewReservation({
                              ...newReservation,
                              endTime: e.target.value,
                            })
                          }
                          className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="partySize"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Party Size *
                      </label>
                      <input
                        type="number"
                        id="partySize"
                        required
                        min="1"
                        value={newReservation.partySize}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            partySize: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-400 mb-1"
                      >
                        Status
                      </label>
                      <select
                        id="status"
                        value={newReservation.status}
                        onChange={(e) =>
                          setNewReservation({
                            ...newReservation,
                            status: e.target.value,
                          })
                        }
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
                  <label
                    htmlFor="specialRequests"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Special Requests
                  </label>
                  <textarea
                    id="specialRequests"
                    rows={3}
                    value={newReservation.specialRequests}
                    onChange={(e) =>
                      setNewReservation({
                        ...newReservation,
                        specialRequests: e.target.value,
                      })
                    }
                    className="w-full bg-[#2a2a2a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
                    placeholder="Any special requests from the customer..."
                  ></textarea>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Staff Notes
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={newReservation.notes}
                    onChange={(e) =>
                      setNewReservation({
                        ...newReservation,
                        notes: e.target.value,
                      })
                    }
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

      {/* Status Change Modal */}
      {showEditReservationModal && selectedReservation && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">
              Update Reservation Status
            </h2>
            <p className="text-gray-400 mb-6">
              Change the status of this reservation.
            </p>

            <div className="mb-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-[#2a2a2a] flex items-center justify-center">
                  <Users size={20} className="text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium">
                    {selectedReservation.customerDetails.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Current status:{" "}
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(
                        selectedReservation.status
                      )}`}
                    >
                      {selectedReservation.status.charAt(0).toUpperCase() +
                        selectedReservation.status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6">
              <button
                onClick={() => handleStatusUpdate("pending")}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  selectedReservation.status === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-[#2a2a2a] hover:bg-yellow-500/20 hover:text-yellow-400"
                }`}
              >
                <Clock size={20} />
                <span>Mark as Pending</span>
              </button>

              <button
                onClick={() => handleStatusUpdate("confirmed")}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  selectedReservation.status === "confirmed"
                    ? "bg-green-500 text-white"
                    : "bg-[#2a2a2a] hover:bg-green-500/20 hover:text-green-400"
                }`}
              >
                <CheckCircle size={20} />
                <span>Confirm Reservation</span>
              </button>

              <button
                onClick={() => handleStatusUpdate("seated")}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  selectedReservation.status === "seated"
                    ? "bg-blue-500 text-white"
                    : "bg-[#2a2a2a] hover:bg-blue-500/20 hover:text-blue-400"
                }`}
              >
                <UserCheck size={20} />
                <span>Mark as Seated</span>
              </button>

              <button
                onClick={() => handleStatusUpdate("completed")}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  selectedReservation.status === "completed"
                    ? "bg-purple-500 text-white"
                    : "bg-[#2a2a2a] hover:bg-purple-500/20 hover:text-purple-400"
                }`}
              >
                <CheckCheck size={20} />
                <span>Mark as Completed</span>
              </button>

              <button
                onClick={() => handleStatusUpdate("cancelled")}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  selectedReservation.status === "cancelled"
                    ? "bg-red-500 text-white"
                    : "bg-[#2a2a2a] hover:bg-red-500/20 hover:text-red-400"
                }`}
              >
                <AlertTriangle size={20} />
                <span>Cancel Reservation</span>
              </button>

              <button
                onClick={() => handleStatusUpdate("no-show")}
                className={`flex items-center gap-2 p-3 rounded-lg transition-colors ${
                  selectedReservation.status === "no-show"
                    ? "bg-gray-500 text-white"
                    : "bg-[#2a2a2a] hover:bg-gray-500/20 hover:text-gray-400"
                }`}
              >
                <XCircle size={20} />
                <span>Mark as No-Show</span>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowEditReservationModal(false)}
                className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
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
              <span className="font-semibold">
                {selectedReservation.reservationNumber}
              </span>{" "}
              for {selectedReservation.customerDetails.name}?
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
    </div>
  );
}
