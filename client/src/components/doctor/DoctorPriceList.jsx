import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'


const DoctorPriceList = ({ handleNext, handleBack, setPriceList }) => {
  const { currentDoctor } = useSelector((state) => state.doctor)
  const [treatments, setTreatments] = useState([])          // raw from API (ids or objects)
  const [selectedPrices, setSelectedPrices] = useState({})  // { [serviceName]: price }
  const [errors, setErrors] = useState('')

  // cache of id -> name so we don’t refetch
  const [namesById, setNamesById] = useState({})
  const hydratingRef = useRef(false)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
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

  // Hydrate any unknown ids -> names (batch if available, fallback per-id)
  useEffect(() => {
    if (!treatments?.length) return
    const idsNeedingNames = (treatments || [])
      .map((t) => (typeof t === 'object' ? (t._id || t.id) : t))
      .filter(isObjectId)
      .filter((id) => !namesById[id])

    if (!idsNeedingNames.length || hydratingRef.current) return
    hydratingRef.current = true

    ;(async () => {
      try {
        let resolved = []
        // Try batch
        try {
          const batch = await axios.post(
            `${API_BASE_URL}/api/treatments/by-ids`,
            { ids: idsNeedingNames },
            { withCredentials: true }
          )
          if (batch?.data?.success) {
            resolved = batch.data.treatments || [] // [{_id, name}]
          }
        } catch { /* batch may not exist; ignore */ }

        // Fallback per id for any not returned in batch
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
            for (const t of all) if (t?._id && t?.name) next[String(t._id)] = t.name
            return next
          })
        }
      } finally {
        hydratingRef.current = false
      }
    })()
  }, [treatments, namesById, API_BASE_URL])

  // Build display items: stable id + human label
  const items = (treatments || []).map((t, i) => {
    const id = typeof t === 'object' ? (t._id || t.id || `opt-${i}`) : t
    const label =
      typeof t === 'object'
        ? (t.name || t.title || t.label || String(id))
        : (isObjectId(t) ? (namesById[t] || String(t)) : String(t))
    return { id: String(id), label }
  })

  // Toggle selection using the LABEL (so your map keys stay human-readable)
  const handleCheckboxChange = (label) => {
    setSelectedPrices((prev) => {
      const next = { ...prev }
      if (Object.prototype.hasOwnProperty.call(next, label)) {
        delete next[label]
      } else {
        next[label] = '' // empty price initially
      }
      return next
    })
  }

  const handlePriceChange = (label, value) => {
    setSelectedPrices((prev) => ({ ...prev, [label]: value }))
  }

  const handleNextStep = () => {
    const valid = Object.keys(selectedPrices).filter((k) => selectedPrices[k]?.trim())
    if (!valid.length) {
      setErrors('Please select at least one service and provide a price.')
      return
    }
    setErrors('')
    // keep output shape: { [serviceName]: price }
    setPriceList(selectedPrices)
    handleNext()
  }

  return (
    <div>
      <section className='lg:pr-24 p-6 lg:mt-24'>
        <h2 className='text-3xl'>What are the prices for your services?</h2>
        <p className='text-sm my-4 text-gray-400'>
          If you don't want to list all prices, list the most important ones, i.e for consultations and the most popular treatments.
        </p>

        {errors && <p className="text-red-500">{errors}</p>}

        <div className='flex justify-between mt-4 border-b-[1px] border-gray-300 p-2'>
          <span className='font-semibold'>Service</span>
          <span className='font-semibold'>Price</span>
        </div>

        <section>
          {items.map((opt, index) => (
            <div
              key={opt.id}
              className={`flex w-full items-center gap-1 mt-1 p-2 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}
            >
              <div className='w-[65%]'>
                <p>{opt.label}</p>
              </div>
              <div className='flex grow bg-white items-center gap-1 border-[1px] pl-2 border-gray-300 rounded h-8 w-[35%]'>
                <div className='flex items-center gap-1'>
                  <input
                    type="checkbox"
                    id={`service-${opt.id}`}
                    name={`service-${index}`}
                    className='rounded mt-2 text-3xl p-2 mb-2 border-gray-400'
                    checked={Object.prototype.hasOwnProperty.call(selectedPrices, opt.label)}
                    onChange={() => handleCheckboxChange(opt.label)}
                  />
                  <label htmlFor={`service-${opt.id}`} className='border-r-[1px] border-gray-300 text-gray-400 px-1 pr-4'>
                    From
                  </label>
                </div>
                <input
                  type="text"
                  id={`price-input-${opt.id}`}
                  name={`price-input-${index}`}
                  className='rounded mt-2 p-2 mb-2 w-20 h-7 border-none outline-none focus:ring-0'
                  value={selectedPrices[opt.label] || ''}
                  onChange={(e) => handlePriceChange(opt.label, e.target.value)}
                />
              </div>
            </div>
          ))}
        </section>

        <div className='flex justify-between items-end mt-5'>
          <button
            className=' text-gray-500 border-[1px] w-24 mt-5 mb-2 py-2 rounded shadow-md'
            onClick={handleBack}
          >
            Back
          </button>
          <button
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

export default DoctorPriceList
