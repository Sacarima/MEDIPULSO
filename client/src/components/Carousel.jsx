
import { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { MdKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css"
import { useNavigate } from "react-router-dom"
import { useDoctor } from "./context/DoctorContext"
import { io } from "socket.io-client";


// Function to normalize time strings to "HH:MM" format
// This function ensures that time strings are in a consistent "HH:MM" format
// It pads single-digit hours and minutes with leading zeros
// Example: "9:5" becomes "09:05", "10:30" becomes "10:30"
// It can be used to ensure that time strings are always in a consistent
const normalizeTime = (t) => {
  if (!t) return t;
  const [h, m] = String(t).trim().split(":");
  const hh = String(parseInt(h, 10)).padStart(2, "0");
  const mm = String(parseInt(m ?? "0", 10)).padStart(2, "0");
  return `${hh}:${mm}`;
};

// Function to sort time strings in "HH:MM" format
// This function sorts time strings lexicographically, which works for "HH:MM" format
// It can be used to sort available times for a specific date
// Example: ["09:00", "10:30", "08:15"] will
const timeSort = (a, b) => a.localeCompare(b); // "09:00" sorts fine lexicographically

// Custom hook to fetch doctor's availability
// This hook fetches the doctor's availability data and returns it
// Map backend doc -> { 'YYYY-MM-DD': ['HH:mm', ...] }
const mapAvailabilityDocToMap = (availabilityDoc) => {
  const map = {};
  if (!availabilityDoc?.monthlyAvailability) return map;

  availabilityDoc.monthlyAvailability.forEach((entry) => {
    (entry.dates || []).forEach((d) => {
      const key = new Date(d.date).toISOString().split("T")[0];
      const rawTimes = Array.isArray(d.times) ? d.times : [];
      const cleaned = [...new Set(rawTimes.map(normalizeTime).filter(Boolean))].sort(timeSort);
      map[key] = cleaned.length ? cleaned : ["-"];
    });
  });

  return map;
};


// Remove a single slot (normalize first)
// Function to block a specific time slot for a given date
// This function updates the available times for a specific date by removing a time slot
// If the date has no more available times, it removes the date from the available times object
const blockSlot = (setAvailableTimes, dateStr, time) => {
  if (!dateStr || !time) return;
  const norm = normalizeTime(time);

  setAvailableTimes((prev) => {
    const next = { ...prev };
    // Treat "-" as no slots
    const current = Array.isArray(next[dateStr]) ? next[dateStr] : [];
    const normalized = current
      .filter((t) => t !== "-")
      .map(normalizeTime);

    const filtered = normalized.filter((t) => t !== norm);

    if (filtered.length === 0) {
      // no slots left for this day -> remove key so UI falls back to ["-"]
      delete next[dateStr];
    } else {
      next[dateStr] = [...new Set(filtered)].sort(timeSort);
    }
    return next;
  });
};

// Add a single slot (normalize first)
// Function to free a specific time slot for a given date
// This function updates the available times for a specific date by adding a time slot back
// If the time slot is already present, it does nothing
// It ensures the times are sorted after adding
const freeSlot = (setAvailableTimes, dateStr, time) => {
  if (!dateStr || !time) return;
  const norm = normalizeTime(time);

  setAvailableTimes((prev) => {
    const next = { ...prev };
    // Treat "-" as no slots
    const current = Array.isArray(next[dateStr]) ? next[dateStr] : [];
    const normalized = current
      .filter((t) => t !== "-")
      .map(normalizeTime);

    if (!normalized.includes(norm)) {
      normalized.push(norm);
    }
    next[dateStr] = normalized.length ? normalized.sort(timeSort) : ["-"];
    return next;
  });
};


// Helper functions
const generateDates = (startDate, numberOfDays = 60) => {
  const dates = [];
  for (let i = 0; i < numberOfDays; i++) {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() + i);
    dates.push(newDate);
  }
  return dates;
};

const formatDay = (date) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

  return date.toLocaleString("en-us", { weekday: "short" });
};

const formatDate = (date) => {
  return date.toLocaleDateString("en-us", { day: "numeric", month: "short" });
};

const CustomArrow = ({ onClick, direction }) => (
  <div
    onClick={onClick}
    className={`absolute ${
      direction === "left" ? "left-[-20px] z-10 top-[10px]" : "right-[-20px] top-[10px]"
    } cursor-pointer bg-blue-100 text-blue-500 p-2 rounded-full`}
  >
    {direction === "left" ? (
      <MdKeyboardArrowLeft className="text-xl" />
    ) : (
      <MdOutlineKeyboardArrowRight className="text-xl" />
    )}
  </div>
);

const Carousel = ({ doctorId }) => {
  const today = new Date();
  const [dates, setDates] = useState(generateDates(today, 60)); // Extend to 60 days (2 months)
  const [availableTimes, setAvailableTimes] = useState({});
  const [visibleRows, setVisibleRows] = useState(5); // Control visible rows
  const [startIndex, setStartIndex] = useState(0); // Control visible days
  const sliderRef = useRef(null); // Reference for the slider
  const doctorData = useDoctor()
  const navigate = useNavigate()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

  

const fetchMonthlyAvailability = async (doctorId) => {
  try {
    // 1) Fetch base availability + booked slots in parallel
    const [availRes, bookedRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/doctor-availability/${doctorId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      }),
      // booked endpoint is public; no creds needed
      fetch(`${API_BASE_URL}/api/appointments/doctor/${doctorId}/slots/public`).catch(() => null),
    ]);

    // Handle availability 404 (no doc yet)
    if (availRes.status === 404) {
      console.warn(`No availability found for doctor ${doctorId}.`);
      setAvailableTimes({});
      return;
    }
    if (!availRes.ok) {
      throw new Error(`Availability HTTP error ${availRes.status}`);
    }

    // 2) Map availability -> { 'YYYY-MM-DD': ['HH:mm', ...] } (already normalizes)
    const availData = await availRes.json();
    const mapped = mapAvailabilityDocToMap(availData?.availability);

    // 3) Parse booked slots (pending/confirmed) -> same shape
    let booked = {};
    if (bookedRes && bookedRes.ok) {
      const bookedData = await bookedRes.json();
      booked = bookedData?.booked || {};
    } else if (bookedRes && !bookedRes.ok) {
      console.warn("Booked slots endpoint returned", bookedRes.status);
    }

    // 4) Subtract booked from availability
    const next = { ...mapped };
    Object.entries(booked).forEach(([day, times]) => {
      if (!next[day]) return;
      const remaining = next[day]
        .filter((t) => t !== "-")
        .map(normalizeTime)
        .filter((t) => !times.map(normalizeTime).includes(t));
      next[day] = remaining.length ? remaining.sort(timeSort) : ["-"];
    });

    setAvailableTimes(next);
  } catch (error) {
    console.error("Failed to fetch monthly availability:", error);
    setAvailableTimes({});
  }
};


  useEffect(() => {
  if (!doctorId) return;

  const SOCKET_URL = `${API_BASE_URL}`.trim().replace(/\/$/, "");
  const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    socket.emit("joinDoctor", doctorId);
  });

  // availability:changed
  socket.on("availability:changed", (payload) => {
    const { doctorId: dId, action, availability, removeDate, removeTime } = payload || {};
    if (!dId || dId !== doctorId) return;

    // Full doc → rebuild (mapAvailabilityDocToMap normalizes times)
    if ((action === "created" || action === "updated") && availability) {
      setAvailableTimes(mapAvailabilityDocToMap(availability));
      return;
    }

    // Deleted → clear
    if (action === "deleted") {
      setAvailableTimes({});
      return;
    }

    // Removed specific day/time
    if (action === "removed" && removeDate) {
      const dayKey = new Date(removeDate).toISOString().split("T")[0];
      const removeTimeNorm = removeTime ? normalizeTime(removeTime) : null;

      setAvailableTimes((prev) => {
        const next = { ...prev };
        const current = Array.isArray(next[dayKey]) ? next[dayKey] : [];

        if (removeTimeNorm) {
          const filtered = current
            .filter((t) => t !== "-")
            .map(normalizeTime)
            .filter((t) => t !== removeTimeNorm);

          if (filtered.length === 0) delete next[dayKey];
          else next[dayKey] = [...new Set(filtered)].sort(timeSort);
        } else {
          // remove whole day
          delete next[dayKey];
        }
        return next;
      });
    }
  });

  // appointment:changed
  socket.on("appointment:changed", (payload) => {
    const { doctorId: dId, action, appointment, newDate, newTime, previousDate, previousTime } = payload || {};
    if (!dId || dId !== doctorId || !appointment) return;

    // Dates normalized to "YYYY-MM-DD"
    const apptDateStr = appointment?.date
      ? new Date(appointment.date).toISOString().split("T")[0]
      : null;

    const newDateStr = newDate
      ? new Date(newDate).toISOString().split("T")[0]
      : apptDateStr;

    const prevDateStr = previousDate
      ? new Date(previousDate).toISOString().split("T")[0]
      : null;

    // Times normalized to "HH:mm"
    const apptTimeNorm = normalizeTime(appointment?.time);
    const newTimeNorm = normalizeTime(newTime || apptTimeNorm);
    const prevTimeNorm = previousTime ? normalizeTime(previousTime) : null;

    if (action === "created") {
      // Hide slot immediately for pending/confirmed
      if (["pending", "confirmed"].includes(appointment.status)) {
        blockSlot(setAvailableTimes, apptDateStr, apptTimeNorm);
      }
      return;
    }

    if (action === "statusUpdated") {
      if (["pending", "confirmed"].includes(appointment.status)) {
        blockSlot(setAvailableTimes, apptDateStr, apptTimeNorm);
      } else if (appointment.status === "canceled") {
        freeSlot(setAvailableTimes, apptDateStr, apptTimeNorm);
      }
      return;
    }

    if (action === "canceled") {
      freeSlot(setAvailableTimes, apptDateStr, apptTimeNorm);
      return;
    }

    if (action === "rescheduled") {
      // Free old slot if provided; otherwise fallback to refetch
      if (prevDateStr && prevTimeNorm) {
        freeSlot(setAvailableTimes, prevDateStr, prevTimeNorm);
      } else {
        fetchMonthlyAvailability(doctorId);
      }

      // Block new slot for pending/confirmed
      if (["pending", "confirmed"].includes(appointment.status)) {
        blockSlot(setAvailableTimes, newDateStr, newTimeNorm);
      }
      return;
    }
  });

  return () => {
    socket.emit("leaveDoctor", doctorId);
    socket.disconnect();
  };
}, [doctorId, API_BASE_URL, fetchMonthlyAvailability]);



  useEffect(() => {
    fetchMonthlyAvailability(doctorId);
  }, [doctorId]);

  const handleNext = () => {
    if (startIndex + 4 < dates.length) {
      setStartIndex((prev) => prev + 4);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex((prev) => prev - 4);
    }
  }

  const handleTimeSlotClick = (date, timeSlot) => {
    // Format the date, time, and year
    const formattedDate = date.toLocaleDateString("en-us", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const slot = `${formattedDate} ${timeSlot}`; 

    // Save selected slot to localStorage
    localStorage.setItem("selectedSlot", slot)

    // Debugging: Check if slot is stored
    console.log("Saved to LocalStorage:", localStorage.getItem("selectedSlot"));
  
    // Redirect to the doctor-appointment page
    navigate(`/doctor-appointment/${doctorId}`, { state: { slot } });
  };
 

  const visibleDates = dates.slice(startIndex, startIndex + 4);
  

  return (
    <div className="relative flex flex-col gap-4 items-center">
      {/* Navigation Arrows */}
      <div className="relative w-full flex justify-between items-center">
        {/* Left Arrow */}
        <CustomArrow
          onClick={handlePrev}
          direction="left"
          className={startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}
        />

        {/* Dates */}
        <div className="flex  gap-4 mx-auto">
          {visibleDates.map((date, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer rounded-md w-32 text-center  text-gray-700"
            >
              <p className="text-sm">{formatDay(date)}</p>
              <p>{formatDate(date)}</p>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <CustomArrow
          onClick={handleNext}
          direction="right"
          className={startIndex + 4 >= dates.length ? "opacity-50 cursor-not-allowed" : ""}
        />
      </div>

      {/* Time Slots */}
      <div className="grid grid-cols-4 gap-4 text-center mt-4">
        {visibleDates.map((date, colIndex) => {
          const formattedDate = date.toISOString().split("T")[0];
          const timeSlots = availableTimes[formattedDate] || ["-"];
          const displayedSlots = [
            ...timeSlots.slice(0, visibleRows),
            ...(visibleRows > timeSlots.length ? Array(visibleRows - timeSlots.length).fill("-") : []),
          ];

          return (
            <div key={colIndex} className="flex  gap-2 flex-col">
              {displayedSlots.map((timeSlot, rowIndex) => (
                <div
                  key={`${colIndex}-${rowIndex}`}
                  className={`p-2 ${
                    timeSlot !== "-"
                      ? "bg-blue-50 w-32 hover:border-[1px] h-10  border-blue-500 text-blue-500 font-medium rounded-md cursor-pointer "
                      : "text-gray-400 w-32"
                  }`}
                  
                  onClick={() => {
                    if (timeSlot !== "-") {
                      handleTimeSlotClick(date, timeSlot); // Call the handler with date and time
                    }
                  }}
                >
                  {timeSlot}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Show More Hours */}
      <button
        onClick={() => setVisibleRows((prev) => prev + 5)}
        className="text-blue-500 py-2 flex m-auto items-center gap-2"
      >
        <p>Show more hours</p>
      </button>
    </div>
  );
};

export default Carousel;






