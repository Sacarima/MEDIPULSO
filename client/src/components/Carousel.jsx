
import { useState, useEffect, useRef, useCallback } from "react";
import { MdKeyboardArrowLeft, MdOutlineKeyboardArrowRight, MdSchedule } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDoctor } from "./context/DoctorContext";
import { io } from "socket.io-client";

const normalizeTime = (t) => {
  if (!t) return t;
  const [h, m] = String(t).trim().split(":");
  const hh = String(parseInt(h, 10)).padStart(2, "0");
  const mm = String(parseInt(m ?? "0", 10)).padStart(2, "0");
  return `${hh}:${mm}`;
};

const timeSort = (a, b) => a.localeCompare(b);

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

const blockSlot = (setAvailableTimes, dateStr, time) => {
  if (!dateStr || !time) return;
  const norm = normalizeTime(time);

  setAvailableTimes((prev) => {
    const next = { ...prev };
    const current = Array.isArray(next[dateStr]) ? next[dateStr] : [];
    const normalized = current.filter((t) => t !== "-").map(normalizeTime);
    const filtered = normalized.filter((t) => t !== norm);

    if (filtered.length === 0) {
      delete next[dateStr];
    } else {
      next[dateStr] = [...new Set(filtered)].sort(timeSort);
    }
    return next;
  });
};

const freeSlot = (setAvailableTimes, dateStr, time) => {
  if (!dateStr || !time) return;
  const norm = normalizeTime(time);

  setAvailableTimes((prev) => {
    const next = { ...prev };
    const current = Array.isArray(next[dateStr]) ? next[dateStr] : [];
    const normalized = current.filter((t) => t !== "-").map(normalizeTime);

    if (!normalized.includes(norm)) normalized.push(norm);
    next[dateStr] = normalized.length ? normalized.sort(timeSort) : ["-"];
    return next;
  });
};

// --- Helpers --- //
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

const formatDate = (date) => date.toLocaleDateString("en-us", { day: "numeric", month: "short" });

// --- UI: Arrows (accessible & theme-colored) --- //
function NavArrow({ onClick, disabled, direction }) {
  const isLeft = direction === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isLeft ? "Previous days" : "Next days"}
      className={`group inline-flex items-center justify-center rounded-full border transition-all duration-200 h-10 w-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      ${disabled
        ? "opacity-40 cursor-not-allowed border-gray-200"
        : "cursor-pointer border-[#00c3a5]/30 hover:border-[#00c3a5] hover:shadow"}`}
      style={{
        boxShadow: disabled ? "none" : "0 4px 16px rgba(0, 195, 165, 0.15)",
      }}
    >
      {isLeft ? (
        <MdKeyboardArrowLeft className="text-2xl text-gray-600 group-hover:text-[#00c3a5]" />
      ) : (
        <MdOutlineKeyboardArrowRight className="text-2xl text-gray-600 group-hover:text-[#00c3a5]" />
      )}
    </button>
  );
}

// --- Skeleton loaders for a pleasant perceived performance --- //
function SlotsSkeleton({ columns = 4, rows = 5 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {Array.from({ length: columns }).map((_, col) => (
        <div key={col} className="flex flex-col gap-2">
          {Array.from({ length: rows }).map((__, row) => (
            <div
              key={`${col}-${row}`}
              className="h-10 rounded-xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// --- Main Component --- //
const Carousel = ({ doctorId }) => {
  const today = new Date();
  const [dates, setDates] = useState(generateDates(today, 60));
  const [availableTimes, setAvailableTimes] = useState({});
  const [visibleRows, setVisibleRows] = useState(5); // base rows
  const [startIndex, setStartIndex] = useState(0); // visible day window
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  // context / routing
  const doctorData = useDoctor();
  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const DAYS_PER_PAGE = 4; // keep logic intact, UI is responsive
  const BASE_ROWS = 5;

  const fetchMonthlyAvailability = useCallback(async (id) => {
    if (!id) return;
    try {
      setIsLoading(true);
      const [availRes, bookedRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/doctor-availability/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }),
        fetch(`${API_BASE_URL}/api/appointments/doctor/${id}/slots/public`).catch(() => null),
      ]);

      if (availRes.status === 404) {
        console.warn(`No availability found for doctor ${id}.`);
        setAvailableTimes({});
        return;
      }
      if (!availRes.ok) throw new Error(`Availability HTTP error ${availRes.status}`);

      const availData = await availRes.json();
      const mapped = mapAvailabilityDocToMap(availData?.availability);

      let booked = {};
      if (bookedRes && bookedRes.ok) {
        const bookedData = await bookedRes.json();
        booked = bookedData?.booked || {};
      } else if (bookedRes && !bookedRes.ok) {
        console.warn("Booked slots endpoint returned", bookedRes.status);
      }

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
    } catch (err) {
      console.error("Failed to fetch monthly availability:", err);
      setAvailableTimes({});
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  // sockets (unchanged logic, slightly organized)
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

    socket.on("availability:changed", (payload) => {
      const { doctorId: dId, action, availability, removeDate, removeTime } = payload || {};
      if (!dId || dId !== doctorId) return;

      if ((action === "created" || action === "updated") && availability) {
        setAvailableTimes(mapAvailabilityDocToMap(availability));
        return;
      }

      if (action === "deleted") {
        setAvailableTimes({});
        return;
      }

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
            delete next[dayKey];
          }
          return next;
        });
      }
    });

    socket.on("appointment:changed", (payload) => {
      const { doctorId: dId, action, appointment, newDate, newTime, previousDate, previousTime } = payload || {};
      if (!dId || dId !== doctorId || !appointment) return;

      const apptDateStr = appointment?.date ? new Date(appointment.date).toISOString().split("T")[0] : null;
      const newDateStr = newDate ? new Date(newDate).toISOString().split("T")[0] : apptDateStr;
      const prevDateStr = previousDate ? new Date(previousDate).toISOString().split("T")[0] : null;

      const apptTimeNorm = normalizeTime(appointment?.time);
      const newTimeNorm = normalizeTime(newTime || apptTimeNorm);
      const prevTimeNorm = previousTime ? normalizeTime(previousTime) : null;

      if (action === "created") {
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
        if (prevDateStr && prevTimeNorm) {
          freeSlot(setAvailableTimes, prevDateStr, prevTimeNorm);
        } else {
          fetchMonthlyAvailability(doctorId);
        }

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
  }, [doctorId, fetchMonthlyAvailability]);

  const handleNext = () => {
    if (startIndex + DAYS_PER_PAGE < dates.length) setStartIndex((prev) => prev + DAYS_PER_PAGE);
  };
  const handlePrev = () => {
    if (startIndex > 0) setStartIndex((prev) => prev - DAYS_PER_PAGE);
  };

  const handleTimeSlotClick = (date, timeSlot) => {
    const formattedDate = date.toLocaleDateString("en-us", { day: "numeric", month: "short", year: "numeric" });
    const slot = `${formattedDate} ${timeSlot}`;
    localStorage.setItem("selectedSlot", slot);
    navigate(`/doctor-appointment/${doctorId}`, { state: { slot } });
  };

  const visibleDates = dates.slice(startIndex, startIndex + DAYS_PER_PAGE);

  // any visible column has more than currently shown rows?
  const hasMoreToShow = visibleDates.some((d) => {
    const formattedDate = d.toISOString().split("T")[0];
    const timeSlots = availableTimes[formattedDate] || ["-"];
    return timeSlots.filter((t) => t !== "-").length > visibleRows;
  });

  // keyboard navigation (left/right arrows)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onKey = (e) => {
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [handleNext, handlePrev]);

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      aria-label="Doctor availability"
      className="relative w-full outline-none"
    >
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 sm:p-6">
        {/* Header: Title + timezone hint */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800">Choose a time</h3>
          <p className="text-xs text-gray-500">Times shown are in your local timezone.</p>
        </div>

        {/* Day navigation (dates shown on each column header below) */}
        <div className="flex items-center justify-between mb-3">
          <NavArrow direction="left" onClick={handlePrev} disabled={startIndex === 0} />
          <span className="text-xs text-gray-500">Swipe or use arrows</span>
          <NavArrow
            direction="right"
            onClick={handleNext}
            disabled={startIndex + DAYS_PER_PAGE >= dates.length}
          />
        </div>

        {/* Slots grid */}
        {isLoading ? (
          <SlotsSkeleton columns={DAYS_PER_PAGE} rows={visibleRows} />
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {visibleDates.map((date, colIndex) => {
              const formattedDate = date.toISOString().split("T")[0];
              const timeSlots = availableTimes[formattedDate] || ["-"];
              const sanitized = timeSlots.filter(Boolean);
              const displayedSlots = [
                ...sanitized.slice(0, visibleRows),
                ...(visibleRows > sanitized.length ? Array(Math.max(visibleRows - sanitized.length, 0)).fill("-") : []),
              ];

              const allBooked = sanitized.every((t) => t === "-" || !t);

              return (
                <div key={colIndex} className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-3">
                  <div className="flex flex-col items-center gap-0.5 mb-2 text-center">
                    <span className="text-[11px] font-medium tracking-wide text-[#00c3a5] uppercase">{formatDay(date)}</span>
                    <span className="text-sm text-gray-700">{formatDate(date)}</span>
                  </div>
                  {displayedSlots.map((timeSlot, rowIndex) => (
                    <button
                      type="button"
                      key={`${colIndex}-${rowIndex}`}
                      disabled={timeSlot === "-"}
                      onClick={() => timeSlot !== "-" && handleTimeSlotClick(date, timeSlot)}
                      className={`h-10 w-full rounded-xl border text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3a5] focus-visible:ring-offset-1
                        ${timeSlot !== "-" 
                          ? "border-[#00c3a5]/30 text-[#00c3a5] hover:bg-[#00c3a5]/5 active:scale-[.99]"
                          : "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"}
                      `}
                      aria-label={timeSlot !== "-" ? `Book ${formatDate(date)} at ${timeSlot}` : "Unavailable"}
                    >
                      {timeSlot !== "-" ? timeSlot : "—"}
                    </button>
                  ))}

                  {/* Empty/All booked friendly note */}
                  {allBooked && (
                    <div className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
                      <MdSchedule className="text-base" />
                      <span className="">No availability</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Show more / less controls */}
        {!isLoading && (
          <div className="mt-4 flex items-center justify-center gap-3">
            {hasMoreToShow && (
              <button
                type="button"
                onClick={() => setVisibleRows((prev) => prev + 5)}
                className="px-4 h-10 rounded-full border border-[#00c3a5]/30 text-[#00c3a5] hover:bg-[#00c3a5]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3a5]"
              >
                Show more hours
              </button>
            )}
            {visibleRows > BASE_ROWS && (
              <button
                type="button"
                onClick={() => setVisibleRows(BASE_ROWS)}
                className="px-4 h-10 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00c3a5]"
              >
                Show less
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Carousel;




