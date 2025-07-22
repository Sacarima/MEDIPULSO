import React, { createContext, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const DoctorContext = createContext()

export const useDoctor = () => useContext(DoctorContext)

export const DoctorProvider = ({ children }) => {
    const { doctorId } = useParams()
    const [doctorData, setDoctorData] = useState(null)
    const [loading, setLoading] = useState(true)

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/doctor-form/profile-info/${doctorId}`)
                const data = await response.json()
                setDoctorData(data)
            } catch (error) {
                console.error('Error fetching doctor data:', error)
            } finally {
                setLoading(false)
            }
        }

        if (doctorId) {
            fetchDoctorData()
        }
    }, [doctorId])

        if (loading) return <div>Loading doctor details...</div>
        if (!doctorData) return <div>Error: Doctor not found.</div>

    return <DoctorContext.Provider value={doctorData}>{children}</DoctorContext.Provider>
}
