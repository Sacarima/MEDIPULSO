import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const DoctorServices = ({ handleNext, handleBack, setServices }) => {
  const { currentDoctor } = useSelector((state) => state.doctor)

  const [treatments, setTreatments] = useState([]) // may be IDs (strings) or objects
  const [selectedServices, setSelectedServices] = useState([]) // keep NAMES here (unchanged)
  const [customService, setCustomService] = useState('')
  const [errors, setErrors] = useState('')

  const [namesById, setNamesById] = useState({}) // cache: { [id]: name }
  const hydratingRef = useRef(false)             // prevent duplicate concurrent hydrations

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  // small helper
  const isObjectId = (v) => typeof v === 'string' && /^[0-9a-fA-F]{24}$/.test(v)

  useEffect(() => {
    if (currentDoctor?.medicalCategory) {
      fetchTreatments(currentDoctor.medicalCategory)
    }
  }, [currentDoctor])

  const fetchTreatments = async (medicalCategory) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/specialties/treatments/${medicalCategory}`)
      if (data?.success) {
        setTreatments(data.treatments || [])
        setErrors('')
      } else {
        setTreatments([])
        setErrors('No treatments found for this specialty.')
      }
    } catch {
      setTreatments([])
      setErrors('Failed to fetch treatments. Please try again.')
    }
  }

  // Try to fetch names for any treatment IDs we don't have yet.
  useEffect(() => {
    if (!treatments?.length) return
    const idsNeedingNames = (treatments || [])
      .map((t) => (typeof t === 'object' ? t._id || t.id : t))
      .filter(isObjectId)
      .filter((id) => !namesById[id])

    if (!idsNeedingNames.length || hydratingRef.current) return
    hydratingRef.current = true

    ;(async () => {
      try {
        // TRY a batch endpoint first (if your backend has it). If not, the per-id fallback will run.
        let resolved = []
        try {
          const batch = await axios.post(
            `${API_BASE_URL}/api/treatments/by-ids`,
            { ids: idsNeedingNames },
            { withCredentials: true }
          )
          if (batch?.data?.success) {
            resolved = batch.data.treatments || []
          }
        } catch {
          // ignore; fall back to per-id below
        }

        // Fallback: fetch per id if batch wasn’t available or incomplete
        const already = new Set(resolved.map((r) => String(r._id)))
        const perId = await Promise.all(
          idsNeedingNames
            .filter((id) => !already.has(String(id)))
            .map(async (id) => {
              try {
                const r = await axios.get(`${API_BASE_URL}/api/treatments/${id}`, { withCredentials: true })
                const doc = r?.data?.treatment || r?.data
                return doc ? { _id: doc._id || id, name: doc.name || id } : { _id: id, name: id }
              } catch {
                return { _id: id, name: id }
              }
            })
        )

        const all = [...resolved, ...perId]
        if (all.length) {
          setNamesById((prev) => {
            const next = { ...prev }
            for (const t of all) {
              if (t?._id && t?.name) next[String(t._id)] = t.name
            }
            return next
          })
        }
      } finally {
        hydratingRef.current = false
      }
    })()
  }, [treatments, namesById, API_BASE_URL])

  // Build render items with a stable id + a label to display
  const items = (treatments || []).map((svc, i) => {
    const id = typeof svc === 'object' ? (svc._id || svc.id || `opt-${i}`) : svc
    const label =
      typeof svc === 'object'
        ? svc.name || svc.title || svc.label || String(id)
        : (isObjectId(svc) ? (namesById[svc] || String(svc)) : String(svc))
    return { id: String(id), label }
  })

  // Keep selectedServices as NAMES (strings) so your downstream stays unchanged
  const handleCheckboxChange = (label) => {
    setSelectedServices((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    )
  }

  const handleAddCustomService = () => {
    const label = customService.trim()
    if (!label) return
    // Add to list for rendering (as a simple string; not an ObjectId pattern)
    setTreatments((prev) => [...prev, label])
    // Select it
    setSelectedServices((prev) => (prev.includes(label) ? prev : [...prev, label]))
    setCustomService('')
  }

  const handleNextStep = () => {
    if (!selectedServices.length) {
      setErrors('Please select at least one service.')
      return
    }
    setErrors('')
    // pass names (unchanged behavior)
    setServices(selectedServices)
    handleNext()
  }

  return (
    <div>
      <section className='lg:pr-24 p-6 mt-4 lg:mt-24 '>
        <h2 className='text-3xl'>Select the services you provide</h2>
        <p className='text-sm my-4 text-gray-400'>
          The form includes the most popular services for your specialization. If a service is missing , add it to the list
        </p>

        <span className='font-medium'>Select services</span>
        {errors && <p className='text-red-500 mt-2'>{errors}</p>}

        <div className='mt-4'>
          {items.map((opt) => (
            <div key={opt.id} className='flex items-center gap-2 mt-2'>
              <input
                type='checkbox'
                id={`service-${opt.id}`}
                name='service'
                className='rounded mt-2 text-3xl p-2 mb-2'
                checked={selectedServices.includes(opt.label)}
                onChange={() => handleCheckboxChange(opt.label)}
              />
              <label htmlFor={`service-${opt.id}`}>{opt.label}</label>
            </div>
          ))}
        </div>

        {/* Input for custom service */}
        <div className='mt-5'>
          <input
            type='text'
            className='border border-gray-300 p-2 rounded w-full'
            placeholder='Add a custom service...'
            value={customService}
            onChange={(e) => setCustomService(e.target.value)}
          />
          <button
            type='button'
            className='bg-blue-500 text-white px-4 py-2 mt-2 rounded'
            onClick={handleAddCustomService}
          >
            Add Service
          </button>
        </div>

        <div className='flex justify-between items-end mt-5'>
          <button
            type='button'
            className=' text-gray-500 border-[1px] w-24 mt-5 mb-2 py-2 rounded shadow-md'
            onClick={handleBack}
          >
            Back
          </button>
          <button
            type='button'
            className='text-white bg-blue-500 w-24 mt-5 mb-2 py-2 rounded'
            onClick={handleNextStep}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  )
}

export default DoctorServices
