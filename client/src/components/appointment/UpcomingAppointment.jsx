import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

const UpcomingAppointment = () => {
    const [appointments, setAppointments] = useState(null)
    const [ timeRemaining, setTimeRemaining ] = useState(null)
    const { currentUser } = useSelector((state) => state.user)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)


    // Function to fetch the appointment
    useEffect (() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch(`http://localhost:7500/api/appointments/upcoming/${currentUser._id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                })

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`)
                }
                
                const data = await response.json()

                if (!data.success) {
                    console.error("Backend error:", data.message);
                    setError("We couldn't retrieve your appointment details right now.");
                    return

                  }
            
                  if (data.success && data.appointment) {
                    setAppointments(data.appointment) // Singular
                    calculateRemainingTime(data.appointment.date, data.appointment.time)
                } else {
                    setAppointments(null);
                }
                
            } catch (error) {
                console.error('Failed to fetch upcoming appointment:', error)
                setError("Something went wrong while loading new appointment. Please try again later.")
            } finally {
                setLoading(false)
            }
        }

        fetchAppointments()
    }, [currentUser._id])


    // Function to calculate the time remaining
    const calculateRemainingTime = (appointmentDate, appointmentTime) => {
        if (!appointmentDate || !appointmentTime) {
            setTimeRemaining("Invalid date/time");
            return;
        }
    
        // Ensure correct formatting
        const formattedDate = new Date(appointmentDate).toISOString().split("T")[0]; // YYYY-MM-DD
        const formattedTime = appointmentTime.trim(); // Ensure no extra spaces
    
        // Construct a valid DateTime string
        const appointmentDateTime = new Date(`${formattedDate}T${formattedTime}:00`).getTime();
    
        if (isNaN(appointmentDateTime)) {
            setTimeRemaining("Invalid date/time format");
            return;
        }
    
        const updateTimer = () => {
            const now = new Date().getTime();
            const difference = appointmentDateTime - now;
    
            if (difference <= 0) {
                setTimeRemaining("Appointment Time!");
                clearInterval(timerInterval);
                return;
            }
    
            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
            setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        };
    
        const timerInterval = setInterval(updateTimer, 1000);
        updateTimer();
    
        return () => clearInterval(timerInterval);
    }

    useEffect(() => {
        if (appointments && appointments.date && appointments.time) {
            console.log("Triggering Countdown for:", appointments.date, appointments.time);
            calculateRemainingTime(appointments.date, appointments.time);
        }
    }, [appointments])
    
    
    if (loading) return <p>Loading your appointment...</p>;

    if (error) {
        return (
            <div className="text-center text-slate-400 py-4">
                <p>{error}</p>
            </div>
        );
    }

    if (!appointments) {
        return (
            <div className="text-center py-4 text-gray-600">
                <p>You have no upcoming appointments.</p>
                <Link to="/search-results" className="text-blue-600 hover:underline">
                    Find a doctor and book now
                </Link>
            </div>
        );
    }



    return (
        <div className=" p-4 w-full ">
            <h2 className="text-xl font-semibold mb-2">Upcoming Appointment</h2>
            <p className="text-gray-700">
                📅 **Date:** {new Date(appointments.date).toLocaleDateString()}  
                🕒 **Time:** {appointments.time}
            </p>
            <div className="flex items-center gap-4 mt-4">
                <img
                src={appointments.doctor.profilePicture}
                alt="Doctor"
                className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                <p className="text-lg font-semibold">
                    {appointments.doctor.firstName} {appointments.doctor.lastName}
                </p>
                <p className="text-gray-500">{appointments.doctor.medicalCategory}</p>
                <p className="text-gray-500">{appointments.doctor.address}</p>
                </div>
            </div>
            <p className="mt-4 text-lg font-medium text-blue-500">
                ⏳ Time remaining: {timeRemaining}
            </p>
    </div>
    )
}

export default UpcomingAppointment