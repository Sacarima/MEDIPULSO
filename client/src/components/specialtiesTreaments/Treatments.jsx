import { useEffect, useState } from 'react'

const Treatments = ({ selectedSpecialty }) => {
    const [treatments, setTreatments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 


    useEffect(() => {
        if (!selectedSpecialty) return

        setLoading(true)
        setError(null)

        const fetchTreatments = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/specialty/${selectedSpecialty}/treatments`)
                if (!response.ok) {
                    throw new Error('Failed to fetch treatments')
                }

                const data = await response.json()
                setTreatments(data.treatments || [])
            } catch (error) {
                console.error('Failed to fetch treatments:', error)
                setError('Failed to fetch treatments', error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchTreatments()
    }, [selectedSpecialty])


    if (!selectedSpecialty) return <p>Please select a specialty.</p>;
    if (loading) return <p>Loading Treatments...</p>;
    if (error) return <p>Error: {error}</p>

      return (
    <div className="p-4">
      <h3 className="text-lg font-semibold">Treatments for {selectedSpecialty}</h3>
      <ul className="list-disc pl-5">
        {treatments.map((treatment, index) => (
          <li key={index} className="mt-1">{treatment}</li>
        ))}
      </ul>
    </div>
  )
}

export default Treatments