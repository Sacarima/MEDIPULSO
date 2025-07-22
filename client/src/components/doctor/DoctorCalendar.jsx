import { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import { useSelector } from "react-redux";
import "react-big-calendar/lib/css/react-big-calendar.css"
import Modal from "react-modal"

Modal.setAppElement("#root");

const localizer = momentLocalizer(moment);

const DoctorCalendar = () => {
  const { currentDoctor } = useSelector((state) => state.doctor);
  const doctorId = currentDoctor?._id

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
    const timestamp = new Date().getTime()
    
    const [availabilityRes, appointmentsRes] = await Promise.all([
      axios.get(`${API_BASE_URL}/doctor-availability/${doctorId}?t=${timestamp}`, { withCredentials: true })
        .catch(error => {
          if (error.response?.status === 404) {
            console.warn("No availability found for this doctor.");
            return { data: { availability: { monthlyAvailability: [] } } }; // Return empty data instead of throwing an error
          }
          throw error;
        }),
      axios.get(`${API_BASE_URL}/api/appointments/doctor/${doctorId}`, { withCredentials: true })
        .catch(error => {
          if (error.response?.status === 500) {
            console.warn("No appointments found or server error.");
            return { data: { appointments: [] } }; // Return empty array instead of throwing an error
          }
          throw error;
        }),
    ]);

    //Convert availability into events (Handles empty availability case)
    const availabilityEvents = availabilityRes.data.availability?.monthlyAvailability.flatMap((month) =>
      month.dates.flatMap((day) =>
        day.times.map((time) => ({
          id: `available-${day.date}-${time}`,
          title: `Available at ${time}`,
          start: moment(`${day.date} ${time}`, "YYYY-MM-DD HH:mm").toDate(),
          end: moment(`${day.date} ${time}`, "YYYY-MM-DD HH:mm").add(30, "minutes").toDate(),
          allDay: false,
          type: "availability",
        }))
      )
    ) || [];



    // Convert appointments into events (Handles empty appointment case)
    const appointments = appointmentsRes.data.appointments || [];

    // Count different appointment statuses
    setPendingCount(appointments.filter(appt => appt.status === "pending").length);
    setConfirmedCount(appointments.filter(appt => appt.status === "confirmed").length);
    setCanceledCount(appointments.filter(appt => appt.status === "canceled").length);
    setCompletedCount(appointments.filter(appt => appt.status === "completed").length);

    const appointmentEvents = appointments.map((appt) => ({
      id: appt._id,
      title: `Appointment with ${appt?.patient?.firstName || "Patient"}`,
      start: moment(`${appt.date.split("T")[0]} ${appt.time}`, "YYYY-MM-DD HH:mm").toDate(),
      end: moment(`${appt.date.split("T")[0]} ${appt.time}`, "YYYY-MM-DD HH:mm").add(30, "minutes").toDate(),
      allDay: false,
      type: "appointment",
      status: appt.status || "pending",
    }));

  

    setEvents([...availabilityEvents, ...appointmentEvents]); // Ensure canceled appointments are included
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    setError("Error fetching calendar data. Please try again.");
  }
  setLoading(false);
}, [doctorId]);


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
    if (event.type !== "availability") return;
  
    setSelectedAvailability(event); // Store the selected availability
    setIsDeleteModalOpen(true); // Open the delete confirmation modal
  }

  
  

  // Handle rescheduling an appointment
  const confirmDeleteAvailability = async () => {
    if (!selectedAvailability) return;
  
    try {
      const formattedDate = moment(selectedAvailability.start).format("YYYY-MM-DD");
      const timeSlot = moment(selectedAvailability.start).format("HH:mm");
  
      await axios.put(
        `${API_BASE_URL}/api/doctor-availability/update/${doctorId}`,
        {
          month: moment(selectedAvailability.start).month() + 1,
          year: moment(selectedAvailability.start).year(),
          removeDate: formattedDate,
          removeTime: timeSlot, //  Send the specific time to delete
        },
        { withCredentials: true }
      );
  
      setIsDeleteModalOpen(false);
      setSuccessMessage(`Availability on ${formattedDate} at ${timeSlot} removed successfully!`)
      setTimeout(() => setSuccessMessage(null), 3000);
  
      // Remove only the selected availability event
      setEvents((prevEvents) =>
        prevEvents.filter(
          (event) => !(event.type === "availability" && event.start.getTime() === selectedAvailability.start.getTime())
        )
      );
  
      fetchCalendarData(); // Refresh calendar after deletion
    } catch (error) {
      console.error("Error deleting availability:", error);
      setError("Error deleting availability. Please try again.");
    }
  };
  
  
  const handleSelectEvent = (event) => {
    if (event.type === "appointment") {
      // Handle rescheduling for appointments
      setSelectedAppointment(event);
      setNewDate(moment(event.start).format("YYYY-MM-DD")); // Pre-fill current date
      setNewTime(moment(event.start).format("HH:mm")); // Pre-fill current time
      setIsModalOpen(true); // Open the reschedule modal
    } 
    else if (event.type === "availability") {
      // Handle availability deletion
      setSelectedAvailability(event);
      setIsDeleteModalOpen(true);
    }

    if ( event.type !== "appointment") return
    setSelectedAppointment(event)
    setIsDetailsModalOpen(true)
  };
  
  

  const handleReschedule = async () => {
    if (!newDate || !newTime || !selectedAppointment) {
      setError("Please select a valid date and time.");
      setTimeout(() => setError(null), 3000);
      return;
    }
  
    // Convert newDate and newTime to a full DateTime object
    const selectedDateTime = moment(`${newDate} ${newTime}`, "YYYY-MM-DD HH:mm");
  
    // Check if the selected time is in the past
    if (selectedDateTime.isBefore(moment())) {
      setError("Appointments can only be scheduled for future dates and times.");
      setTimeout(() => setError(null), 4000);
      return;
    }
  
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/appointments/reschedule/${selectedAppointment.id}`,
        { newDate, newTime },
        { withCredentials: true }
      );
  
      setIsModalOpen(false); // Close modal after update
      setSuccessMessage("Appointment rescheduled successfully!");
      fetchCalendarData(); // Refresh the calendar
  
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
  
      if (error.response) {
        console.log("Error Response:", error.response.data);
  
        if (error.response.status === 400) {
          setError("Invalid date or time. Please select a valid slot.");
        } else if (error.response.status === 409) {
          setError("This time slot is already booked. Choose another time.");
        } else {
          setError("Error rescheduling appointment. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
  
      setTimeout(() => setError(null), 3000);
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
      console.error("Error confirming appointment:", error);
      setError("Error confirming appointment. Please try again.");
    }
  };
  
  
    

  const createAvailability = async () => {
    if (!doctorId || !selectedAvailabilityDate || availableTimes.length === 0) {
      console.error("Missing required fields:", { doctorId, selectedAvailabilityDate, availableTimes });
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
        setSuccessMessage("Availability saved successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        setIsAvailabilityModalOpen(false);
        fetchCalendarData(); //  Refresh calendar
      } else {
        console.error("Error: API did not return success.");
      }
    } catch (error) {
      console.error("Error creating availability:", error.response?.data || error);
  
      //  Handle case where availability does not exist (404)
      if (error.response?.status === 404) {
        console.warn("No availability found. Creating new entry...");
        await createNewAvailability(); // If no availability, create a new one
      } else {
        alert("Error saving availability. Please try again.");
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
        setSuccessMessage("Availability created successfully!");
        setTimeout(() => setSuccessMessage(null), 3000);
        setIsAvailabilityModalOpen(false);
        fetchCalendarData(); // Refresh calendar
      } else {
        console.error("Error: API did not return success.");
      }
    } catch (error) {
      console.error("Error creating new availability:", error.response?.data || error);
      alert("Error creating availability. Please try again.");
    }
  };
  

  

  

  return (
    <div className="lg:p-4">
       {events.length === 0 && !loading && !error && (
        <p className="text-center text-xl text-gray-500 font-medium mb-10">
          You have no availability set up yet. Please add available time slots to allow patients to book appointments.
        </p>
      )}
      <h2 className="text-2xl font-semibold mb-4 text-red-950">Doctor's Calendar</h2>
     
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
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Reschedule Appointment"
        className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center"
      >
        <h2 className="text-lg font-semibold mb-4">Reschedule Appointment</h2>

        <label className="block mb-2">New Date:</label>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">New Time:</label>
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleReschedule}
          >
            Confirm
          </button>
        </div>
      </Modal>            

      {isDeleteModalOpen && selectedAvailability && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Confirm Deletion</h2>
            <p>Are you sure you want to remove availability on <strong>{moment(selectedAvailability?.start).format("YYYY-MM-DD")}</strong>?</p>
            <div className="flex justify-end mt-4">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
              <button onClick={confirmDeleteAvailability} className="px-4 py-2 bg-red-500 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
      
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
            <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
            <p><strong>Notes:</strong> {selectedAppointment.specialNotes || "No notes provided"}</p>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsDetailsModalOpen(false)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setIsModalOpen(true); // Open Reschedule Modal
                }}
              >
                Reschedule
              </button>
            </div>
          </div>
        )}
      </Modal>

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
            <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
            <p><strong>Notes:</strong> {selectedAppointment.specialNotes || "No notes provided"}</p>

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

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  setIsModalOpen(true); // Open Reschedule Modal
                }}
              >
                Reschedule
              </button>
            </div>
          </div>
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

            <p>Selected Date: {selectedAvailabilityDate}</p>

            <label className="block mb-2">Available Times:</label>
            <input
              type="text"
              placeholder="E.g. 09:00, 10:00, 14:00"
              value={availableTimes.join(", ")}
              onChange={(e) => setAvailableTimes(e.target.value.split(","))}
              className="w-full p-2 border rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAvailabilityModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={createAvailability} className="px-4 py-2 bg-blue-500 text-white rounded">
                Save
              </button>
            </div>
        </Modal>
      )}



      
    </div>

    
  );
};

export default DoctorCalendar;




