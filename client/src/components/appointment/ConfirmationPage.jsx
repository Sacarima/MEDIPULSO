import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCheckCircle } from "react-icons/fa"
import { FaCalendarAlt, FaClock, FaUserMd, FaMapMarkerAlt, FaUser, FaPhone } from "react-icons/fa"
import { useSelector } from 'react-redux'
import { useDoctor } from '../context/DoctorContext'



const ConfirmationPage = () => {
    const location = useLocation()
    const { currentUser } = useSelector((state) => state.user)
    const [loading, setLoading] = useState(true)
    const doctorData = useDoctor()
    const { appointment = {} } = location.state || {};
    const finalAppointment = appointment || JSON.parse(localStorage.getItem("lastAppointment")) || {};
  

      if (!doctorData) {;
        return <div>Loading doctor details...</div>;
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
          {/* Success Icon */}
          <div className="bg-white p-10 rounded-lg shadow-lg text-center w-full max-w-2xl">
            <FaCheckCircle className="text-[#00c3a5] text-5xl mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-800">Appointment Confirmed!</h2>
            <p className="text-gray-500 mt-2">Your appointment has been successfully booked.</p>
    
            {/* Appointment Details */}
            <div className="mt-6 text-left">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Appointment Details</h3>
              <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <FaCalendarAlt className="text-[#00c3a5] text-xl" />
                  <p className="text-gray-700 font-medium">{appointment.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaClock className="text-[#00c3a5]  text-xl" />
                  <p className="text-gray-700 font-medium">{appointment.time}</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaUserMd className="text-[#00c3a5] text-xl" />
                  <p className="text-gray-700 font-medium">Dr. {doctorData.firstName} {doctorData.lastName} </p>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-[#00c3a5]  text-xl" />
                  <p className="text-gray-700 font-medium">{doctorData.address || "Clinic Address"}</p>
                </div>
              </div>
            </div>
    
            {/* Patient Details */}
            <div className="mt-6 text-left">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Patient Information</h3>
              <div className="bg-gray-50 p-4 rounded-md shadow-sm space-y-3">
                <div className="flex items-center gap-3">
                  <FaUser className="text-[#00c3a5] text-xl" />
                  <p className="text-gray-700 font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-[#00c3a5]  text-xl" />
                  <p className="text-gray-700 font-medium">{appointment.phoneNumber}</p>
                </div>
              </div>
            </div>
    
            {/* Navigation Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/patient-profile"
                state={{ section: "my-visits"}}  // Pass "my-visits" as the section to show the visits tab
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-center font-medium"
              >
                View My Appointments
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-md text-center font-medium"
              >
                Go to Home
              </Link>
            </div>
          </div>
        </div>
      )
}

export default ConfirmationPage