"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  Check,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  X,
  Info,
  XCircle,
} from "lucide-react";

import { useLanguage } from "@/context/language-context";
import { useRouter } from "next/navigation";
import { API_BASE_URL, reservationAPI } from "@/utils/api";
import Loading from "./loading";

type TableStatus = "available" | "reserved" | "filled" | "availableSoon";
type TableShape = "round" | "oval" | "rectangular";
type TableLocation = "indoor" | "outdoor" | "patio" | "bar" | "private-room";
type TableAmenity =
  | "power-outlet"
  | "window-view"
  | "sofa"
  | "high-chair"
  | "wheelchair-accessible";

interface TableMeeting {
  id: string;
  customerName: string;
  startTime: string;
  endTime: string;
  guestCount: number;
  status: "confirmed" | "pending" | "cancelled";
}

interface Table {
  id: string;
  tableNumber: string;
  name: string;
  status: TableStatus;
  shape: TableShape;
  timeRemaining?: string;
  selected?: boolean;
  position: {
    x: number;
    y: number;
    row: number;
    col: number;
    colSpan?: number;
  };
  capacity: number;
  location: TableLocation;
  description?: string;
  isActive: boolean;
  amenities: TableAmenity[];
  pricePerHour: number;
  minReservationDuration: number;
  maxReservationDuration: number;
  images?: string[];
  meetings?: TableMeeting[];
}

export default function ReservationPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [showSearchModal, setShowSearchModal] = useState(true);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    endTime: "",
    guests: "2",
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
    tableId: null,
  });
  const [hoveredTable, setHoveredTable] = useState<Table | null>(null);

  const initialTables: Table[] = [
    {
      id: "t12",
      tableNumber: "T12",
      name: "T12",
      status: "available",
      shape: "round",
      position: { row: 0, col: 0, x: 100, y: 100 },
      capacity: 4,
      location: "indoor",
      isActive: true,
      amenities: ["power-outlet", "window-view"],
      pricePerHour: 20,
      minReservationDuration: 60,
      maxReservationDuration: 180,
      meetings: [
        {
          id: "m1",
          customerName: "John Doe",
          startTime: "17:00",
          endTime: "19:00",
          guestCount: 3,
          status: "confirmed",
        },
      ],
    },
    {
      id: "t13",
      tableNumber: "T13",
      name: "T13",
      status: "filled",
      shape: "rectangular",
      position: { row: 0, col: 1, x: 300, y: 100 },
      capacity: 4,
      location: "indoor",
      isActive: true,
      amenities: ["power-outlet"],
      pricePerHour: 20,
      minReservationDuration: 60,
      maxReservationDuration: 180,
      meetings: [
        {
          id: "m2",
          customerName: "Jane Smith",
          startTime: "12:00",
          endTime: "14:00",
          guestCount: 4,
          status: "confirmed",
        },
      ],
    },
    {
      id: "t14",
      tableNumber: "T14",
      name: "T14",
      status: "availableSoon",
      shape: "oval",
      timeRemaining: "5m 30s",
      position: { row: 0, col: 2, colSpan: 2, x: 500, y: 100 },
      capacity: 8,
      location: "patio",
      isActive: true,
      amenities: ["window-view", "sofa"],
      pricePerHour: 30,
      minReservationDuration: 90,
      maxReservationDuration: 180,
      meetings: [
        {
          id: "m3",
          customerName: "Robert Johnson",
          startTime: "14:30",
          endTime: "16:30",
          guestCount: 6,
          status: "confirmed",
        },
      ],
    },
    {
      id: "t15",
      name: "T15",
      status: "reserved",
      shape: "rectangular",
      position: { row: 0, col: 4 },
      capacity: 4,
    },
    {
      id: "t16",
      name: "T16",
      status: "available",
      shape: "rectangular",
      position: { row: 0, col: 5 },
      capacity: 4,
    },
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
    {
      id: "t20",
      name: "T20",
      status: "available",
      shape: "round",
      position: { row: 2, col: 0 },
      capacity: 4,
    },
    {
      id: "t21",
      name: "T21",
      status: "reserved",
      shape: "round",
      position: { row: 2, col: 1 },
      capacity: 4,
    },
    {
      id: "t22",
      name: "T22",
      status: "available",
      shape: "oval",
      position: { row: 2, col: 2, colSpan: 2 },
      capacity: 8,
    },
    {
      id: "t23",
      name: "T23",
      status: "filled",
      shape: "round",
      position: { row: 2, col: 4 },
      capacity: 4,
    },
    {
      id: "t24",
      name: "T24",
      status: "reserved",
      shape: "round",
      position: { row: 2, col: 5 },
      capacity: 4,
    },
    {
      id: "t25",
      name: "T25",
      status: "available",
      shape: "round",
      position: { row: 3, col: 0 },
      capacity: 4,
    },
    {
      id: "t26",
      name: "T26",
      status: "filled",
      shape: "round",
      position: { row: 3, col: 1 },
      capacity: 4,
    },
    {
      id: "t27",
      name: "T27",
      status: "filled",
      shape: "rectangular",
      position: { row: 3, col: 2 },
      capacity: 4,
    },
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
  ].map((table) => ({
    ...table,
    tableNumber: table.name,
    location: "indoor" as TableLocation,
    isActive: true,
    amenities: [] as TableAmenity[],
    pricePerHour: 20,
    minReservationDuration: 60,
    maxReservationDuration: 180,
    position: {
      ...table.position,
      x: table.position.col * 200,
      y: table.position.row * 200,
    },
    meetings: [] as TableMeeting[],
  }));

  const [allTables, setAllTables] = useState<Table[]>([...initialTables]);
  const [loading, setLoading] = useState<boolean>(false);
  const [tables, setTables] = useState<Table[]>();
  const [filteredTables, setFilteredTables] = useState<Table[]>([]);
  const [peopleCount, setPeopleCount] = useState(2);
  const [selectedTablee, setSelectedTablee] = useState<Table>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const filterTables = () => {
    handleGetTables();
    setShowSearchModal(false);
    setStep(1);
  };

  const handleGetTables = async () => {
    setLoading(true);
    try {
      let formattedDate;

      if (typeof formData.date === "object" && formData.date !== null) {
        formattedDate = formData.date.toISOString().split("T")[0];
      } else if (typeof formData.date === "string") {
        const parsedDate = new Date(formData.date);
        if (!isNaN(parsedDate.getTime())) {
          formattedDate = parsedDate.toISOString().split("T")[0];
        } else {
          formattedDate = formData.date;
        }
      }

      if (!formattedDate || !/^\d{4}-\d{2}-\d{2}$/.test(formattedDate)) {
        throw new Error("Invalid date format");
      }

      const response = await reservationAPI.getAvailableTables({
        date: formattedDate,
        capacity: formData.guests,
        startTime: formData.time,
      });

      console.log("API Response:", response);
      if (response.success) {
        // Map API response to your Table interface
        const mappedTables = response.data.map((table: any) => ({
          id: table._id,
          tableNumber: table.tableNumber,
          name: table.name,
          status: table.available ? "available" : "reserved", // Convert available to status
          shape: "rectangular", // Default shape or get from API if available
          position: {
            x: table.position.x,
            y: table.position.y,
            row: Math.floor(table.position.y / 200), // Calculate based on your grid
            col: Math.floor(table.position.x / 200), // Calculate based on your grid
          },
          capacity: table.capacity,
          location: table.location,
          description: table.description,
          isActive: table.isActive,
          amenities: table.amenities,
          pricePerHour: table.pricePerHour,
          minReservationDuration: table.minReservationDuration,
          maxReservationDuration: table.maxReservationDuration,
          images: table.images,
          meetings: [], // Add if available from API
        }));

        setTables(mappedTables);

        // Filter the tables immediately after setting them
        const filtered = mappedTables.filter(
          (table) =>
            table.capacity >= peopleCount &&
            (table.status === "available" || table.status === "availableSoon")
        );
        setFilteredTables(filtered);
      }
    } catch (error) {
      console.error("Error in handleGetTables:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   setStep(3);
  // };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    if (step === 1) {
      setShowSearchModal(true);
      setStep(0);
    } else {
      setStep(step - 1);
    }
    window.scrollTo(0, 0);
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case "available":
        return "bg-green-200";
      case "reserved":
        return "bg-red-200";
      case "filled":
        return "bg-gray-200";
      case "availableSoon":
        return "bg-amber-200";
      default:
        return "bg-[#1E1E1E]";
    }
  };

  const toggleTableSelection = (id: string) => {
    setFilteredTables(
      filteredTables.map((table) => {
        if (table.status !== "available" && table.status !== "availableSoon")
          return table;
        return table.id === id
          ? { ...table, selected: !table.selected }
          : { ...table, selected: false };
      })
    );

    const selectedTable = filteredTables.find((t) => t.id === id);
    if (
      selectedTable &&
      (selectedTable.status === "available" ||
        selectedTable.status === "availableSoon")
    ) {
      setFormData({ ...formData, tableId: id });
    }
  };

  const renderChairs = (
    shape: TableShape,
    colSpan?: number,
    selected?: boolean
  ) => {
    const chairColor = selected
      ? "border border-[#F05A28] ring-2 ring-[#F05A28]/30"
      : "bg-[#1E1E1E] border-[0.5px] border-white/30";

    if (shape === "round") {
      return (
        <>
          <div
            className={`absolute -top-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute top-1/2 -left-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute top-1/2 -right-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`}
          />
        </>
      );
    }
    if (shape === "oval" && colSpan === 2) {
      return (
        <>
          <div
            className={`absolute -top-6 left-1/4 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute -top-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute -top-6 left-3/4 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute -bottom-6 left-1/4 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute -bottom-6 left-3/4 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute top-1/2 -left-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute top-1/2 -right-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`}
          />
        </>
      );
    }
    if (shape === "rectangular") {
      return (
        <>
          <div
            className={`absolute -top-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute -bottom-6 left-1/2 -translate-x-1/2 w-11 h-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute top-1/2 -left-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`}
          />
          <div
            className={`absolute top-1/2 -right-6 -translate-y-1/2 h-8 w-4 ${chairColor} rounded-full`}
          />
        </>
      );
    }
    return null;
  };

  const renderTable = (table: Table) => {
    const tableSizeClasses = {
      round: "w-28 h-28", // Fixed size for all screen sizes
      oval: table.position.colSpan === 2 ? "w-64 h-28" : "w-28 h-28", // Fixed size for all screen sizes
      rectangular: "w-28 h-28", // Fixed size for all screen sizes
    };

    const borderRadiusClasses = {
      round: "rounded-full",
      oval: "rounded-full",
      rectangular: "rounded-md",
    };

    const isSelectable =
      (table.status === "available" || table.status === "availableSoon") &&
      table.capacity >= peopleCount;
    const cursorClass = isSelectable
      ? "cursor-pointer"
      : "cursor-not-allowed opacity-70";

    return (
      <div className="relative flex items-center justify-center h-full w-full">
        <div
          className="relative"
          onMouseEnter={() => setHoveredTable(table)}
          onMouseLeave={() => setHoveredTable(null)}
        >
          {renderChairs(table.shape, table.position.colSpan, table.selected)}
          <div
            className={`relative flex items-center justify-center bg-[#1E1E1E] border-[0.5px] border-white/30
              ${tableSizeClasses[table.shape]}
              ${borderRadiusClasses[table.shape]}
              ${cursorClass} shadow-sm
              ${
                table.selected
                  ? "border border-[#F05A28] ring-2 ring-[#F05A28]/30"
                  : ""
              }`}
            onClick={() => isSelectable && toggleTableSelection(table.id)}
          >
            <span
              className={`flex justify-center items-center font-medium text-gray-700 z-10 relative rounded-full w-12 h-12 ${getStatusColor(
                table.status
              )}`}
            >
              {table.tableNumber}
            </span>
          </div>

          {table.status === "reserved" && (
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
              <div className="text-xs px-2 py-0.5 bg-red-500 text-white rounded-full">
                Booked
              </div>
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
    );
  };

  const tablesByRow = (filteredTables || []).reduce((acc, table) => {
    const row = table.position.x;
    if (!acc[row]) acc[row] = [];
    acc[row].push(table);
    return acc;
  }, {} as Record<number, Table[]>);

  const selectedTable = filteredTables.find((table) => table.selected);

  const incrementPeople = () => {
    if (peopleCount < 8) {
      setPeopleCount(peopleCount + 1);
      setFormData({ ...formData, guests: String(peopleCount + 1) });
      // Deselect table if it doesn't have enough capacity
      if (selectedTable && selectedTable.capacity < peopleCount + 1) {
        setFilteredTables(
          filteredTables.map((table) => ({ ...table, selected: false }))
        );
        setFormData({
          ...formData,
          tableId: null,
          guests: String(peopleCount + 1),
        });
      }
    }
  };

  const decrementPeople = () => {
    if (peopleCount > 1) {
      setPeopleCount(peopleCount - 1);
      setFormData({ ...formData, guests: String(peopleCount - 1) });
    }
  };

  const generateTimeOptions = (startTime, minDuration, maxDuration) => {
    if (!startTime) return [];

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);

    const options = [];

    // Calculate possible end times based on min/max duration
    const minEndDate = new Date(startDate.getTime() + minDuration * 60000);
    const maxEndDate = new Date(startDate.getTime() + maxDuration * 60000);

    // Add 1 hour increments between min and max duration
    const minHour = minEndDate.getHours();
    const maxHour = maxEndDate.getHours();

    for (let hour = minHour; hour <= maxHour; hour++) {
      // Skip if the duration would be less than minimum
      if (hour === minHour && minEndDate.getMinutes() > 0) continue;

      // Skip if the duration would be more than maximum
      if (hour === maxHour && maxEndDate.getMinutes() === 0) continue;

      const timeValue = `${hour.toString().padStart(2, "0")}:00`;
      const durationMinutes = (hour - startHour) * 60;
      const durationText =
        durationMinutes >= 60
          ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`
          : `${durationMinutes}m`;

      options.push({
        value: timeValue,
        label: `${timeValue} (${durationText})`,
      });
    }

    return options;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (
        !selectedTablee ||
        !formData.date ||
        !formData.time ||
        !formData.endTime
      ) {
        throw new Error("Please fill in all required fields");
      }

      const formatDateForAPI = (dateString: string): string => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date format");
        }
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; // DD-MM-YYYY format
      };

      const formatTimeForAPI = (timeString: string): string => {
        const [hours, minutes] = timeString.split(":").map(Number);
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
      };

      // Format the date and time values for the API
      const formattedReservationDate = formatDateForAPI(formData.date);
      const formattedStartTime = formatTimeForAPI(formData.time, formData.date);
      const formattedEndTime = formatTimeForAPI(
        formData.endTime,
        formData.date
      );

      // Calculate duration in hours
      const start = new Date(formattedStartTime);
      const end = new Date(formattedEndTime);
      const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      const durationHours = durationMinutes / 60;

      // Calculate total price based on table's pricePerHour and duration
      const totalPrice = durationHours * selectedTablee.pricePerHour;

      const reservationData = {
        tableId: selectedTablee.id,
        reservationDate: formattedReservationDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        partySize: parseInt(formData.guests) || 1,
        specialRequests: formData.specialRequests,
        totalPrice: parseFloat(totalPrice.toFixed(2)), // Round to 2 decimal places
      };

      console.log("Sending reservation data:", reservationData);
      const token = localStorage.getItem("token");
      // const response = await reservationAPI.createReservation(reservationData);
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tableId: selectedTablee.id,
          reservationDate: formattedReservationDate,
          startTime: formattedStartTime,
          endTime: formattedEndTime,
          partySize: parseInt(formData.guests) || 1, // Make sure this is called partySize
          specialRequests: formData.specialRequests,
          totalPrice: parseFloat(totalPrice.toFixed(2)),
        }),
      });

      // Handle successful reservation
      console.log("Reservation created:", response);
      const res = await response.json()
      console.log(res);
      
      if (response.ok) nextStep();
    } catch (error) {
      console.error("Reservation error:", error);
      // Handle error (show toast, etc.)
    }
  };

  // Helper functions for date/time formatting
  const formatDateForAPI = (dateString: string): string => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    return date.toISOString().split("T")[0]; // Returns YYYY-MM-DD
  };

  const formatTimeForAPI = (timeString: string, dateString: string): string => {
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }

    date.setHours(hours, minutes, 0, 0);
    return date.toISOString(); // Returns full ISO datetime string
  };

  // Format amenities for display
  const formatAmenity = (amenity: TableAmenity) => {
    return amenity
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchAvailableTimeSlots = async () => {
    if (!selectedTablee || !formData.date) {
      setAvailableTimeSlots([]);
      return;
    }

    setIsLoadingSlots(true);
    try {
      const response = await reservationAPI.getAvailableSlots(
        selectedTablee.id,
        formatDateForAPI(formData.date),
        {
          partySize: parseInt(formData.guests) || 2,
        }
      );

      if (response.success) {
        setAvailableTimeSlots(response.rawResponse.data.availableSlots);
      } else {
        console.error("Failed to fetch time slots:", response.message);
        setAvailableTimeSlots([]);
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setAvailableTimeSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  // Call this when date or table changes
  useEffect(() => {
    fetchAvailableTimeSlots();
  }, [selectedTablee, formData.date, formData.guests]);

  // Helper function to extract time in HH:MM format from ISO string
  const getTimeFromISO = (isoString) => {
    const date = new Date(isoString);
    return date.toTimeString().substring(0, 5); // Returns "HH:MM"
  };

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Header */}
      <header className="bg-[#1a1a1a] shadow-md py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold mx-auto">Table Reservation</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps - Only show when not in search modal */}
        {!showSearchModal && (
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  1
                </div>
                <span
                  className={`mt-2 text-sm ${
                    step >= 1 ? "text-white" : "text-gray-400"
                  }`}
                >
                  {t("reservation.steps.dateTime")}
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
                  2
                </div>
                <span
                  className={`mt-2 text-sm ${
                    step >= 2 ? "text-white" : "text-gray-400"
                  }`}
                >
                  {t("reservation.steps.info")}
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
                  3
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
        )}

        {/* Search Modal */}
        <AnimatePresence>
          {showSearchModal && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl max-w-md w-full"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Find a Table</h2>
                  <button
                    className="text-gray-400 hover:text-white"
                    onClick={() => {
                      setShowSearchModal(false);
                      //   handleNavigate("/");
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      {t("reservation.date")}
                    </label>
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
                    <label className="block text-sm text-gray-400 mb-2">
                      {t("reservation.guests")}
                    </label>
                    <div className="flex items-center">
                      <div className="relative flex items-center bg-[#2a2a2a] text-white rounded-lg w-full py-3">
                        <Users
                          size={18}
                          className="absolute left-3 text-gray-400"
                        />
                        <span className="pl-10">
                          {peopleCount}{" "}
                          {peopleCount === 1
                            ? t("reservation.person")
                            : t("reservation.people")}
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

                  <button
                    onClick={filterTables}
                    disabled={!formData.date}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Search Tables
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Hover Details Modal */}
        <AnimatePresence>
          {hoveredTable && cursorPosition && (
            <motion.div
              className="fixed z-40 bg-[#1E1E1E] border border-gray-700 rounded-lg shadow-xl p-4 max-w-xs"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{
                left: `${Math.min(
                  window.innerWidth - 320,
                  cursorPosition.x + 20
                )}px`,
                top: `${Math.min(
                  window.innerHeight - 400,
                  cursorPosition.y + 20
                )}px`,
              }}
            >
              <img
                src={hoveredTable.images[0]}
                alt={hoveredTable.name}
                className="rounded-md w-full bg-cover mb-3"
              />
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg">Table {hoveredTable.name}</h3>
                <div
                  className={`w-3 h-3 rounded-full ${getStatusColor(
                    hoveredTable.status
                  )}`}
                ></div>
              </div>
              <p className="text-gray-300 mb-2">{hoveredTable.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Capacity:</span>
                  <span>{hoveredTable.capacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="capitalize">
                    {hoveredTable.location.replace("-", " ")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price:</span>
                  <span>${hoveredTable.pricePerHour}/hour</span>
                </div>

                {hoveredTable.amenities.length > 0 && (
                  <div>
                    <span className="text-gray-400 block mb-1">Amenities:</span>
                    <div className="flex flex-wrap gap-1">
                      {hoveredTable.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="text-xs bg-[#2a2a2a] px-2 py-1 rounded"
                        >
                          {formatAmenity(amenity)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex flex-col gap-8">
              {/* Top - Date, Time, People Summary */}
              <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl">
                <div className="flex flex-wrap justify-between items-center">
                  <h2 className="text-xl font-bold mb-4 md:mb-0">
                    Your Search
                  </h2>

                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setShowSearchModal(true)}
                      className="bg-[#2a2a2a] px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Calendar size={16} className="text-orange-500" />
                      <span>{formData.date}</span>
                    </button>
                    <button
                      onClick={() => setShowSearchModal(true)}
                      className="bg-[#2a2a2a] px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Clock size={16} className="text-orange-500" />
                      <span>{formData.time}</span>
                    </button>
                    <button
                      onClick={() => setShowSearchModal(true)}
                      className="bg-[#2a2a2a] px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <Users size={16} className="text-orange-500" />
                      <span>
                        {peopleCount} {peopleCount === 1 ? "person" : "people"}
                      </span>
                    </button>
                    <button
                      onClick={() => setShowSearchModal(true)}
                      className="bg-[#2a2a2a] hover:bg-[#333] px-4 py-2 rounded-lg text-sm"
                    >
                      Modify Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom - Table Selection */}
              <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Select a Table</h2>
                  <div className="flex flex-wrap gap-4">
                    {/* <div className="flex items-center gap-2">
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
                    </div> */}
                  </div>
                </div>

                {filteredTables.length > 0 ? (
                  <div
                    className="overflow-auto px-28 flex justify-center"
                    style={{ maxHeight: "600px", maxWidth: "100%" }}
                  >
                    <div
                      // style={{
                      //   width: "1200px",
                      //   height: "auto",
                      //   minHeight: "800px",
                      // }}
                      className="flex gap-x-24 flex-wrap "
                    >
                      {Object.entries(tablesByRow).map(
                        ([rowIndex, rowTables]) => {
                          const rowNumber = Number.parseInt(rowIndex);
                          return (
                            <div
                              key={rowIndex}
                              className="relative"
                              style={{ height: "200px", marginBottom: "24px" }}
                            >
                              {rowTables.map((table) => {
                                const colWidth = 170;
                                const colGap = 32;
                                const totalColWidth = colWidth + colGap;

                                const leftPos =
                                  table.position.col * totalColWidth;

                                const width =
                                  table.position.colSpan === 2
                                    ? colWidth * 2 + colGap
                                    : colWidth;

                                return (
                                  <div
                                    key={table.id}
                                    className=""
                                    style={{
                                      left: `${leftPos}px`,
                                      top: "0",
                                      width: `${width}px`,
                                      height: "170px",
                                    }}
                                    onClick={() => {
                                      if (selectedTablee?.id === table.id) {
                                        setSelectedTablee(null);
                                      } else {
                                        setSelectedTablee(table);
                                        console.log(table);
                                      }
                                    }}
                                  >
                                    {renderTable(table)}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Info size={48} className="text-gray-500 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No Tables Available
                    </h3>
                    <p className="text-gray-400 text-center max-w-md">
                      There are no tables available that match your search
                      criteria. Please try a different time or adjust the number
                      of guests.
                    </p>
                    <button
                      onClick={() => setShowSearchModal(true)}
                      className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
                    >
                      Modify Search
                    </button>
                  </div>
                )}

                <div className="flex justify-between items-center mt-6">
                  <div>
                    {selectedTable ? (
                      <div className="bg-[#2a2a2a] p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full ${getStatusColor(
                              selectedTable.status
                            )}`}
                          ></div>
                          <div>
                            <p className="font-medium">
                              Table {selectedTable.name}
                            </p>
                            <p className="text-sm text-gray-400">
                              Capacity: {selectedTable.capacity} people
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        Please select a table from the layout
                      </p>
                    )}
                  </div>
                  <div className="relative inline-block group">
                    {" "}
                    {/* Add group here */}
                    <button
                      onClick={nextStep}
                      disabled={
                        !selectedTablee || !formData.date || !formData.guests
                      }
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t("reservation.next")}
                    </button>
                    {/* Tooltip */}
                    {(!selectedTablee ||
                      !formData.date ||
                      !formData.guests) && (
                      <div className="absolute z-10 hidden group-hover:block w-max max-w-xs px-3 py-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg -bottom-12 left-1/2 transform -translate-x-1/2">
                        <div className="flex flex-col space-y-1">
                          {!selectedTablee && (
                            <span className="flex items-center">
                              <XCircle className="w-4 h-4 mr-1 text-red-400" />
                              Please select a table
                            </span>
                          )}
                          {!formData.date && (
                            <span className="flex items-center">
                              <XCircle className="w-4 h-4 mr-1 text-red-400" />
                              Please select a date
                            </span>
                          )}
                          {!formData.time && (
                            <span className="flex items-center">
                              <XCircle className="w-4 h-4 mr-1 text-red-400" />
                              Please select a time
                            </span>
                          )}
                          {!formData.guests && (
                            <span className="flex items-center">
                              <XCircle className="w-4 h-4 mr-1 text-red-400" />
                              Please select number of guests
                            </span>
                          )}
                        </div>
                        <div className="absolute w-3 h-3 -top-1.5 left-1/2 transform -translate-x-1/2 rotate-45 bg-gray-800"></div>
                      </div>
                    )}
                  </div>
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
              <h2 className="text-xl font-bold mb-6">
                {t("reservation.steps.info")}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="block text-sm text-gray-400 mb-2">
                    {t("reservation.time")}
                  </label>
                  <div className="relative">
                    <select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 pl-10 appearance-none"
                      required
                      disabled={isLoadingSlots || !availableTimeSlots.length}
                    >
                      <option value="">{t("reservation.selectTime")}</option>
                      {availableTimeSlots.map((slot) => (
                        <option
                          key={slot.startTime}
                          value={getTimeFromISO(slot.startTime)}
                        >
                          {slot.startTimeFormatted}
                        </option>
                      ))}
                    </select>
                    <Clock
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <ChevronDown
                      size={18}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                  {isLoadingSlots && (
                    <p className="text-sm text-orange-500 mt-1">
                      Loading available time slots...
                    </p>
                  )}
                  {!isLoadingSlots &&
                    !availableTimeSlots.length &&
                    selectedTablee &&
                    formData.date && (
                      <p className="text-sm text-orange-500 mt-1">
                        No available time slots for this date
                      </p>
                    )}
                </div>

                <label className="block text-sm text-gray-400 mb-2">
                  {t("reservation.endTime")}
                </label>
                <div className="relative mb-5">
                  <select
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full bg-[#2a2a2a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 pl-10 appearance-none"
                    required
                    disabled={!formData.time}
                  >
                    <option value="">{t("reservation.selectTime")}</option>
                    {formData.time &&
                      availableTimeSlots
                        .filter(
                          (slot) =>
                            getTimeFromISO(slot.startTime) === formData.time
                        )
                        .map((slot) => (
                          <option
                            key={slot.endTime}
                            value={getTimeFromISO(slot.endTime)}
                          >
                            {slot.endTimeFormatted}
                          </option>
                        ))}
                  </select>
                  <Clock
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <ChevronDown
                    size={18}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>

                {/* Rest of your form remains the same */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">
                    {t("reservation.specialRequests")}
                  </label>
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
                    disabled={!formData.time || !formData.endTime}
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
              <h2 className="text-2xl font-bold mb-4">
                {t("reservation.steps.confirmation")}
              </h2>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {t("reservation.success")}
              </p>

              <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8 max-w-md mx-auto">
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">
                    {t("reservation.details.date")}
                  </span>
                  <span>{formData.date}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">
                    {t("reservation.details.time")}
                  </span>
                  <span>{formData.time}</span>
                </div>
                <div className="flex justify-between mb-3">
                  <span className="text-gray-400">
                    {t("reservation.details.guests")}
                  </span>
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
  );
}
