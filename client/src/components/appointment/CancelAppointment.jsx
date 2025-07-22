import {useState, useEffect} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import moment from 'moment'




const  CancelAppointment = () => {
    const { currentUser } = useSelector((state) => state.user)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [appointments, setAppointments] = useState([])
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/appointments/user/${currentUser?._id}`, {
          withCredentials: true,
        });
        setAppointments(res.data);
      } catch (error) {
        console.error("Error fetching patient appointments:", error);
      }
    };

    if (currentUser?._id) {
      fetchAppointments();
    }
  }, [currentUser]);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/api/appointments/cancel/${appointmentId}`, {
        withCredentials: true,
      });

      //  Update state to remove canceled appointment
      setAppointments((prev) => prev.map((appt) =>
        appt._id === appointmentId ? { ...appt, status: "canceled" } : appt
      ));
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert("Failed to cancel appointment. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul className="space-y-3">
          {appointments.map((appt) => (
            <li key={appt._id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <p><strong>Doctor:</strong> {appt.doctor.firstName} {appt.doctor.lastName}</p>
                <p><strong>Date:</strong> {moment(appt.date).format("YYYY-MM-DD")}</p>
                <p><strong>Time:</strong> {appt.time}</p>
                <p><strong>Status:</strong> 
                  <span className={appt.status === "canceled" ? "text-red-500" : "text-green-600"}>
                    {appt.status}
                  </span>
                </p>
              </div>
              {appt.status !== "canceled" && (
                <button
                  className="px-3 py-2 bg-red-500 text-white rounded"
                  onClick={() => handleCancel(appt._id)}
                >
                  Cancel
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CancelAppointment