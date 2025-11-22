import { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import "react-big-calendar/lib/css/react-big-calendar.css"
import Modal from "react-modal"
import { io } from "socket.io-client";
import toast from "react-hot-toast";




// Build calendar events from a DoctorAvailability doc
function buildAvailabilityEventsFromDoc(doc) {
  if (!doc?.monthlyAvailability) return [];
  return doc.monthlyAvailability.flatMap((m) =>
    m.dates.flatMap((d) =>
      (d.times || []).map((time) => ({
        id: `available-${new Date(d.date).toISOString()}-${time}`,
        title: `Available at ${time}`,
        start: moment(`${moment(d.date).format("YYYY-MM-DD")} ${time}`, "YYYY-MM-DD HH:mm").toDate(),
        end: moment(`${moment(d.date).format("YYYY-MM-DD")} ${time}`, "YYYY-MM-DD HH:mm").add(30, "minutes").toDate(),
        allDay: false,
        type: "availability",
      }))
    )
  );
}

function makeAppointmentEvent(appt) {
  const dateStr = appt?.date ? moment(appt.date).format("YYYY-MM-DD") : "";
  const start = moment(`${dateStr} ${appt.time}`, "YYYY-MM-DD HH:mm");
  return {
    id: appt._id,
    title: `Appointment with ${appt?.patient?.firstName || "Patient"}`,
    start: start.toDate(),
    end: start.clone().add(30, "minutes").toDate(),
    allDay: false,
    type: "appointment",
    status: appt.status || "pending",
    reason: appt.reason,
    specialNotes: appt.specialNotes,
  };
}

function recomputeCountsFromEvents(allEvents) {
  const appts = allEvents.filter((e) => e.type === "appointment");
  const by = (s) => appts.filter((a) => a.status === s).length;
  return {
    pending: by("pending"),
    confirmed: by("confirmed"),
    canceled: by("canceled"),
    completed: by("completed"),
  };
}



  Modal.setAppElement("#root"); 



const localizer = momentLocalizer(moment);


const DoctorCalendar = ({doctorIdProp}) => {
  const { currentDoctor } = useSelector((state) => state.doctor);
  const doctorId = doctorIdProp ??  currentDoctor?._id

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [showCanceled, setShowCanceled] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  

  // Modal state for rescheduling an appointment
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedAvailability, setSelectedAvailability] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  

  //appointment status
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  // cancel flow
const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
const [cancelReason, setCancelReason] = useState("");



  // create availability
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [selectedAvailabilityDate, setSelectedAvailabilityDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([])

  const filteredEvents = events.filter((event) =>
    (filterStatus === "all" || event.status === filterStatus) && // Keep the status filter
    (event.title.toLowerCase().includes(searchQuery.toLowerCase()) || // Keep the search filter
      moment(event.start).format("YYYY-MM-DD").includes(searchQuery))
  )

const fetchCalendarData = useCallback(async () => {
  if (!doctorId) return;

  setLoading(true);
  setError(null);

  try {
    const timestamp = Date.now();

    const [availabilityRes, appointmentsRes] = await Promise.all([
      axios
        .get(`${API_BASE_URL}/api/doctor-availability/${doctorId}?t=${timestamp}`, { withCredentials: true })
        .catch((error) => {
          if (error.response?.status === 404) {
            console.warn("No availability found for this doctor.");
            return { data: { availability: { monthlyAvailability: [] } } };
          }
          throw error;
        }),
      axios
        .get(`${API_BASE_URL}/api/appointments/doctor/${doctorId}`, { withCredentials: true })
        .catch((error) => {
          if (error.response?.status === 500) {
            console.warn("No appointments found or server error.");
            return { data: { appointments: [] } };
          }
          throw error;
        }),
    ]);

    //Availability → events
    const availabilityEvents =
      availabilityRes.data.availability?.monthlyAvailability.flatMap((month) =>
        month.dates.flatMap((day) =>
          (day.times || []).map((time) => {
            const dayStr = moment(day.date).format("YYYY-MM-DD"); // robust
            const start = moment(`${dayStr} ${time}`, "YYYY-MM-DD HH:mm");
            return {
              id: `available-${dayStr}-${time}`,
              title: `Available at ${time}`,
              start: start.toDate(),
              end: start.clone().add(30, "minutes").toDate(),
              allDay: false,
              type: "availability",
            };
          })
        )
      ) || [];

    


    // Appointments → events
    const appointments = appointmentsRes.data.appointments || [];

    setPendingCount(appointments.filter((a) => a.status === "pending").length);
    setConfirmedCount(appointments.filter((a) => a.status === "confirmed").length);
    setCanceledCount(appointments.filter((a) => a.status === "canceled").length);
    setCompletedCount(appointments.filter((a) => a.status === "completed").length);

    const appointmentEvents = appointments.map((appt) => {
      const dateStr = moment(appt.date).format("YYYY-MM-DD"); // handles ISO/Date
      const start = moment(`${dateStr} ${appt.time}`, "YYYY-MM-DD HH:mm");
      return {
        id: appt._id,
        title: `Appointment with ${appt?.patient?.firstName || "Patient"}`,
        start: start.toDate(),
        end: start.clone().add(30, "minutes").toDate(),
        allDay: false,
        type: "appointment",
        status: appt.status || "pending",
        reason: appt.reason,
        specialNotes: appt.specialNotes,
      };
    });

    setEvents([...availabilityEvents, ...appointmentEvents]);
  } catch (error) {
    console.error(error);
    toast.error("Error fetching calendar data. Please try again.");
    setError("Error fetching calendar data. Please try again.");
  } finally {
    setLoading(false);
  }
}, [doctorId, API_BASE_URL]);




useEffect(() => {
  fetchCalendarData(); // Initial load

  const interval = setInterval(() => {
    fetchCalendarData();
  }, 5 * 60 * 1000); // Refresh every 5 minutes

  return () => clearInterval(interval); // Cleanup on unmount
}, [fetchCalendarData])

  const handleSelectSlot = ({ start }) => {
  const formattedDate = moment(start).format("YYYY-MM-DD");
  setSelectedAvailabilityDate(formattedDate);
  setAvailableTimes([]); // Reset times before opening modal
  setIsAvailabilityModalOpen(true);
};

  

  // Handle deleting availability
  const handleDeleteAvailability = (event) => {
    console.log('handleDeleteAvailability called with:', event);
    if (event.type !== "availability") return;
  
    setSelectedAvailability(event); // Store the selected availability
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  }



  
  

  // Handle rescheduling an appointment
 const confirmDeleteAvailability = async () => {
  if (!selectedAvailability) return;

  try {
    const dayISO = moment(selectedAvailability.start).format("YYYY-MM-DD");
    const timeHHMM = moment(selectedAvailability.start).format("HH:mm");

    await axios.put(
      `${API_BASE_URL}/api/doctor-availability/update/${doctorId}`,
      {
        month: moment(selectedAvailability.start).month() + 1,
        year: moment(selectedAvailability.start).year(),
        removeDate: dayISO,
        removeTime: timeHHMM,
      },
      { withCredentials: true }
    );

    setIsDeleteModalOpen(false);
    toast.success(`Removed ${dayISO} at ${timeHHMM}`);

    // Optimistically remove from UI
    setEvents((prev) =>
      prev.filter(
        (evt) =>
          !(
            evt.type === "availability" &&
            evt.start.getTime() === selectedAvailability.start.getTime()
          )
      )
    );

    // Optional: refresh to stay in sync with server
    fetchCalendarData();
  } catch (err) {
    console.error("delete availability error:", err);
    toast.error(
      err?.response?.data?.message || "Error deleting availability. Please try again."
    );
  }
};

  


  const handleSelectEvent = (event) => {
  if (!event) return;

  if (event.type === "availability") {
    setSelectedAvailability(event);
    setIsDeleteModalOpen(true);
    return;
  }

  if (event.type === "appointment") {
    setSelectedAppointment(event);
  
    setNewDate(moment(event.start).format("YYYY-MM-DD"));
    setNewTime(moment(event.start).format("HH:mm"));
    setIsDetailsModalOpen(true);  
    return;
  }
};

  
  

  const handleReschedule = async () => {
    if (!newDate || !newTime || !selectedAppointment) {
      toast.error("Please select a valid date and time.");
      setTimeout(() => toast.error(null), 3000);
      return;
    }
  
    // Convert newDate and newTime to a full DateTime object
    const selectedDateTime = moment(`${newDate} ${newTime}`, "YYYY-MM-DD HH:mm");
  
    // Check if the selected time is in the past
    if (selectedDateTime.isBefore(moment())) {
      toast.error("Appointments can only be scheduled for future dates and times.");
      setTimeout(() => toast.error(null), 4000);
      return;
    }
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/appointments/reschedule/${selectedAppointment.id}`,
        { newDate, newTime },
        { withCredentials: true }
      );
  
      setIsModalOpen(false); // Close modal after update
      toast.success("Appointment rescheduled successfully!");
      fetchCalendarData(); // Refresh the calendar
  
      setTimeout(() => toast.success(null), 3000);
    } catch (error) {
      toast.error("Error rescheduling appointment:", error);
  
      if (error.response) {
        console.log("Error Response:", error.response.data);
  
        if (error.response.status === 400) {
          toast.error("Invalid date or time. Please select a valid slot.");
        } else if (error.response.status === 409) {
          toast.error("This time slot is already booked. Choose another time.");
        } else {
          toast.error("Error rescheduling appointment. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
  
      setTimeout(() => toast.error(null), 3000);
    }
  }

  const handleConfirmAppointment = async () => {
    if (!selectedAppointment) return;
  
    try {
      await axios.patch(
        `${API_BASE_URL}/api/appointments/${selectedAppointment.id}/status`,
        { status: "confirmed" },
        { withCredentials: true }
      );
  
      setIsDetailsModalOpen(false); // Close modal after confirmation
      fetchCalendarData(); // Refresh the calendar
    } catch (error) {
      toast.error("Error confirming appointment:", error);
      toast.error("Error confirming appointment. Please try again.");
    }
  };
  
  
    

  const createAvailability = async () => {
    if (!doctorId || !selectedAvailabilityDate || availableTimes.length === 0) {
      toast.error("Missing required fields:", { doctorId, selectedAvailabilityDate, availableTimes });
      return;
    }
  
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/doctor-availability/update/${doctorId}`,
        {
          month: moment(selectedAvailabilityDate).month() + 1,
          year: moment(selectedAvailabilityDate).year(),
          monthlyDates: [{ date: selectedAvailabilityDate, times: availableTimes }],
        },
        { withCredentials: true }
      );
  

  
      if (response.data.success) {
        toast.success("Availability saved successfully!");
        setTimeout(() => toast.success(null), 3000);
        setIsAvailabilityModalOpen(false);
        fetchCalendarData(); //  Refresh calendar
      } else {
        toast.error("Error: API did not return success.");
      }
    } catch (error) {
      toast.error("Error creating availability:", error.response?.data || error);
  
      //  Handle case where availability does not exist (404)
      if (error.response?.status === 404) {
        console.warn("No availability found. Creating new entry...");
        await createNewAvailability(); // If no availability, create a new one
      } else {
        toast.error("Error saving availability. Please try again.");
      }
    }
  };
  
  /**
   * Creates a new doctor availability entry (if none exists)
   */
  const createNewAvailability = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/doctor-availability/monthly`,
        {
          doctorId: doctorId,
          month: moment(selectedAvailabilityDate).month() + 1,
          year: moment(selectedAvailabilityDate).year(),
          availableTimes: availableTimes, //  Use the selected times
        },
        { withCredentials: true }
      );
  
  
      if (response.data.success) {
        toast.success("Availability created successfully!");
        setTimeout(() => toast.success(null), 3000);
        setIsAvailabilityModalOpen(false);
        fetchCalendarData(); // Refresh calendar
      } else {
        toast.error("Error: API did not return success.");
      }
    } catch (error) {
      toast.error("Error creating new availability:", error.response?.data || error);
      alert("Error creating availability. Please try again.");
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
    // console.log("[socket] connected", socket.id);
    socket.emit("joinDoctor", doctorId);
  });

  // Availability changes: created | updated | removed | deleted
  socket.on("availability:changed", (payload) => {
    const { doctorId: dId, action, availability, removeDate, removeTime } = payload || {};
    if (!dId || dId !== doctorId) return;

    setEvents((prev) => {
      const appointmentEvents = prev.filter((e) => e.type === "appointment");

      // If we got a full availability doc (created/updated), rebuild availability events from it
      if ((action === "created" || action === "updated") && availability) {
        const availEvents = buildAvailabilityEventsFromDoc(availability);
        const merged = [...availEvents, ...appointmentEvents];
        const counts = recomputeCountsFromEvents(merged);
        setPendingCount(counts.pending);
        setConfirmedCount(counts.confirmed);
        setCanceledCount(counts.canceled);
        setCompletedCount(counts.completed);
        return merged;
      }

      // If removed (single time or whole day)
      if (action === "removed" && removeDate) {
        const targetDay = moment(removeDate).format("YYYY-MM-DD");
        const next = prev.filter((e) => {
          if (e.type !== "availability") return true;
          const day = moment(e.start).format("YYYY-MM-DD");
          if (day !== targetDay) return true;
          if (removeTime) {
            // remove just the matching time
            return moment(e.start).format("HH:mm") !== removeTime;
          }
          // remove all times on that day
          return false;
        });
        const counts = recomputeCountsFromEvents(next);
        setPendingCount(counts.pending);
        setConfirmedCount(counts.confirmed);
        setCanceledCount(counts.canceled);
        setCompletedCount(counts.completed);
        return next;
      }

      // If deleted (remove all availability for this doctor)
      if (action === "deleted") {
        const next = prev.filter((e) => e.type !== "availability");
        const counts = recomputeCountsFromEvents(next);
        setPendingCount(counts.pending);
        setConfirmedCount(counts.confirmed);
        setCanceledCount(counts.canceled);
        setCompletedCount(counts.completed);
        return next;
      }

      return prev;
    });
  });

  // Appointment changes: created | statusUpdated | canceled | rescheduled
  socket.on("appointment:changed", (payload) => {
    const { doctorId: dId, action, appointment } = payload || {};
    if (!dId || dId !== doctorId || !appointment) return;

    setEvents((prev) => {
      let next = [...prev];
      const idx = next.findIndex((e) => e.type === "appointment" && e.id === appointment._id);

      if (action === "created") {
        const ev = makeAppointmentEvent(appointment);
        if (idx >= 0) next[idx] = ev;
        else next.push(ev);
      }

      if (action === "statusUpdated" || action === "canceled") {
        if (idx >= 0) {
          next[idx] = { ...next[idx], status: appointment.status || (action === "canceled" ? "canceled" : next[idx].status) };
        } else {
          next.push(makeAppointmentEvent(appointment));
        }
      }

      if (action === "rescheduled") {
        const ev = makeAppointmentEvent(appointment);
        if (idx >= 0) next[idx] = { ...next[idx], start: ev.start, end: ev.end };
        else next.push(ev);
      }

      const counts = recomputeCountsFromEvents(next);
      setPendingCount(counts.pending);
      setConfirmedCount(counts.confirmed);
      setCanceledCount(counts.canceled);
      setCompletedCount(counts.completed);

      return next;
    });
  });

  return () => {
    socket.emit("leaveDoctor", doctorId);
    socket.disconnect();
  };
}, [doctorId, API_BASE_URL]);

// Handle canceling an appointment
const handleCancelAppointment = async () => {
  if (!selectedAppointment) return;

  try {
    const token = localStorage.getItem('access_token'); // adjust if you store differently

    // Prefer PATCH cancel endpoint that accepts JSON body
    const resp = await axios.patch(
      `${API_BASE_URL}/api/appointments/cancel/${selectedAppointment.id}`,
      { reason: cancelReason },
      {
        withCredentials: true,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      setIsCancelModalOpen(false);
      setSuccessMessage("Appointment canceled successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
      fetchCalendarData(); // refresh calendar view
    } else {
      throw new Error("Failed to cancel appointment");
    }
  } catch (error) {
    console.error("Error canceling appointment:", error);
    setError(error?.response?.data?.message || "Error canceling appointment");
    setTimeout(() => setError(null), 3000);
  }
};


  

  

  

  return (
    <div className="lg:p-4 max-w-6xl mx-auto">
       {events.length === 0 && !loading && !error && (
        <p className="text-center text-xl text-gray-500 font-medium mb-10">
          You have no availability set up yet. Please add available time slots to allow patients to book appointments.
        </p>
      )}
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Doctor's Calendar</h2>
     
      {loading &&  
          <div className='flex space-x-2 justify-center items-center bg-white dark:invert'>
            <span className='sr-only'>Loading...</span>
            <div className='h-8 w-8 bg-[#00b39be6] rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-8 w-8 bg-[#00b39be6]  rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-8 w-8 bg-[#00b39be6] rounded-full animate-bounce'></div>
          </div>
      }
      {successMessage && (
        <div className="p-3 bg-green-200 text-green-800 rounded-md mb-4 text-center">
          {successMessage}
        </div>
      )}
     

      {error && (
        <div className="p-3 bg-red-200 text-red-800 rounded-md mb-4 text-center">
          {error}
        </div>
      )}
     

      <div className="mb-4 flex gap-2">
        <button onClick={() => setFilterStatus("all")} className="px-3 py-1 bg-gray-300 rounded">All</button>
        <button onClick={() => setFilterStatus("pending")} className="px-3 py-1 bg-[#fca311] text-white rounded">Pending</button>
        <button onClick={() => setFilterStatus("confirmed")} className="px-3 py-1 bg-[#2ec4b6] text-white rounded">Confirmed</button>
        <button onClick={() => setFilterStatus("canceled")} className="px-3 py-1 bg-[#d90429] text-white rounded">Canceled</button>
        <button onClick={() => setFilterStatus("completed")} className="px-3 py-1 bg-[#083d77] text-white rounded">Completed</button>
      </div>

      {/* Show message if no appointments for the selected filter */}
      <div>
        {filterStatus !== "all" && (
          <p
            className={`text-gray-700 my-2 py-1 text-center ${
              (filterStatus === "pending" && pendingCount === 0) ||
              (filterStatus === "confirmed" && confirmedCount === 0) ||
              (filterStatus === "canceled" && canceledCount === 0) ||
              (filterStatus === "completed" && completedCount === 0)
                ? "bg-red-300" // Only applies background if text is visible
                : ""
            }`}
          >
            {filterStatus === "pending" && pendingCount === 0 && "No pending appointments."}
            {filterStatus === "confirmed" && confirmedCount === 0 && "No confirmed appointments."}
            {filterStatus === "canceled" && canceledCount === 0 && "No canceled appointments."}
            {filterStatus === "completed" && completedCount === 0 && "No completed appointments."}
          </p>
        )}
      </div>
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search by patient name or date..."
              className="w-full p-2 border-[1px] border-gray-300 rounded mb-4 placeholder:text-gray-400 text-sm focus:border-current focus:ring-0 focus:border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
     
      <Calendar
        key={events.length + successMessage?.length} 
        localizer={localizer}
        events={filteredEvents} 
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent} 
        style={{ height: 600 }}

        eventPropGetter={(event) => {
          let backgroundColor = "#fff8ad";
          let textDecoration = "none";
        
          if (event.type === "availability") {
            backgroundColor = "#0ec8ca"; 
          } else if (event.status === "confirmed") {
            backgroundColor = "#36f1cd"; 
          } else if (event.status === "pending") {
            backgroundColor = "#fff8ad"; 
          } else if (event.status === "canceled") {
            backgroundColor = "#ff5a5f"; 
            textDecoration = "line-through";
          } else if (event.status === "completed") {
            backgroundColor = "#6495ED"; 
          }
          
        
          return {
            style: {
              backgroundColor,
              textDecoration,
              color: "#404040",
            },
          };
        }}
        
      />


      <Modal
        isOpen={isDetailsModalOpen}
        onRequestClose={() => setIsDetailsModalOpen(false)}
        contentLabel="Appointment Details"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-semibold mb-4">Appointment Details</h2>

        {selectedAppointment && (
          <div>
            <p><strong>Patient:</strong> {selectedAppointment?.title.replace("Appointment with ", "")}</p>
            <p><strong>Date:</strong> {moment(selectedAppointment.start).format("YYYY-MM-DD")}</p>
            <p><strong>Time:</strong> {moment(selectedAppointment.start).format("HH:mm")}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Reason:</strong> {selectedAppointment.reason || "—"}</p>
            <p><strong>Notes:</strong> {selectedAppointment.specialNotes || "—"}</p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </button>

              {selectedAppointment.status === "pending" && (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  onClick={handleConfirmAppointment}
                >
                  Confirm
                </button>
              )}

              {(selectedAppointment.status === "pending" ||
                selectedAppointment.status === "confirmed") && (
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    setCancelReason("");
                    setIsCancelModalOpen(true);
                  }}
                >
                  Cancel
                </button>
              )}

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  // fields already prefilled in handler
                  setIsDetailsModalOpen(false);
                  setIsModalOpen(true); // open reschedule modal
                }}
              >
                Reschedule
              </button>
            </div>
          </div>
        )}
      </Modal>

       {/* Delete Availability Modal */}
        <Modal
        isOpen={isDeleteModalOpen}
        onRequestClose={() => setIsDeleteModalOpen(false)}
        contentLabel="Delete Availability"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-[10000]"
      >
        {selectedAvailability && (
          <>
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">
              Remove availability on{" "}
              <strong>
                {moment(selectedAvailability.start).format("YYYY-MM-DD")} at{" "}
                {moment(selectedAvailability.start).format("HH:mm")}
              </strong>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAvailability}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </Modal>

          {isAvailabilityModalOpen && (
              <Modal
                isOpen={isAvailabilityModalOpen}
                onRequestClose={() => setIsAvailabilityModalOpen(false)}
                contentLabel="Add Availability"
                className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
                overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
              >
                <h2 className="text-lg font-semibold mb-4">Add Availability</h2>

                <p className="mb-3">Selected Date: <strong>{selectedAvailabilityDate}</strong></p>

                <label className="block mb-2">Available Times (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. 09:00, 10:00, 14:30"
                  value={availableTimes.join(", ")}
                  onChange={(e) =>
                    setAvailableTimes(
                      e.target.value
                        .split(",")
                        .map(s => s.trim())
                        .filter(Boolean)
                    )
                  }
                  className="w-full p-2 border rounded mb-4"
                />

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsAvailabilityModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={createAvailability}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </Modal>
            )}


      
    </div>

    
  );
};

export default DoctorCalendar;




