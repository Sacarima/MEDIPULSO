import React, { useEffect, useState } from 'react'

const DoctorSpecialties = () => {
    const [specialties, setSpecialties] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSpecialties = async () => {
        try {
            const response = await fetch('http://localhost:7500/api/specialty')
            if (!response.ok) {
                throw new Error('Failed to fetch specialties')
            }

            const data = await response.json()
            setSpecialties(data.specialties || [])
        } catch (error) {
            console.error('Failed to fetch specialties:', error)
            setError('Failed to fetch specialties', error.message)
        } finally {
            setLoading(false)
        }
    }
       
        fetchSpecialties()
    }, [])

    if (loading) return <p>Loading Specialties...</p>
    if (error) return <p>Error: {error}</p>


    return (
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-3">Select a Specialty</h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {specialties.map((specialty) => (
              <li
                key={specialty._id}
                className="bg-blue-100 p-2 rounded cursor-pointer flex flex-col hover:bg-blue-300"
              >
                <span className='font-medium'>{specialty.name}</span>
                
              </li>
            ))}
          </ul>
        </div>
      );
}

export default DoctorSpecialties