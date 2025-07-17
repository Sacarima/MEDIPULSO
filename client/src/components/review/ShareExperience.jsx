import React, { useState } from 'react'
import { FaPen } from "react-icons/fa"
import { FaUserLarge } from "react-icons/fa6"
import { ImLocation2 } from "react-icons/im"
import { FaStethoscope } from "react-icons/fa"
import { useParams } from 'react-router-dom'
import  LoadingOverlay  from '../LoadingOverlay'


const ShareExperience = ({ selectedReview, onSubmit   }) => {
  const [formData, setFormData] = useState({
    details: '',
    name: '',
    reason: 'general_checkup',
    consent: false,
    rating: selectedReview.rating || 0,
  })
  const { rating, options } = selectedReview

  const [details, setDetails] = useState('')
  const [name, setName] = useState('')
  const { doctorId } = useParams()
  const [reason, setReason] = useState('general_checkup')
  const [consent, setConsent] = useState(false)


  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [invalidFields, setInvalidFields] = useState([])
  const [successMessage, setSuccessMessage] = useState(null)
 
 

  const requiredFields = [details, name, reason]

  // Valiadate the form fields before submitting
  const validateFields = () => {
    const { details, name, reason, consent, rating } = formData
    if (!details.trim() || !name.trim() || !reason || !consent || !rating) {
      setErrorMessage("All fields are required, including comment and rating")
      return false
    }
    return true
  }

  // Handle input changes dynamically
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }


  const handleContinue = async () => {

    // Validate required fields
    if (!validateFields()) return
  
    const finalFormData = {
      comment: formData.details,
      rating: formData.rating,
      name: formData.name,
      reason: formData.reason,
      consent: formData.consent,
    }

    if (onSubmit) {
      onSubmit(finalFormData)

      // Reset form data
      setFormData({
        details: "",
        name: "",
        reason: "general_checkup",
        consent: false,
        rating: 0,
      });

      setErrorMessage(null);
    }
  
  }

  const isInvalid = (fieldName) => invalidFields.includes(fieldName)

  return (
    <div>

      {/* Error / Success Messages */}
      {errorMessage && <div className="text-red-500 mb-2">{errorMessage}</div>}
      {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}
      {loading && <LoadingOverlay isLoading={loading} delay={4000} />}

      {/* Textarea for additional details */}
      <div className='mb-4'>
        <label className=' flex items-center gap-2 font-medium'><FaPen className='text-gray-400' />Write a review</label>
        <p className='text-gray-400 my-1'>Please provide as many details as possible:</p>
        <textarea
          name='details'
          value={formData.details}
          //onChange={(e) => setDetails(e.target.value)}
          onChange={handleChange}
          className={`w-full h-24 p-2 border border-gray-300 rounded placeholder:text-gray-400 ${isInvalid('details') ? 'border-red-500' : 'border-gray-300'}`}
        />
        <p className='text-end text-[11px] text-gray-400'>Write 50 more characters</p>
      </div>

      {/* Name input */}
      <div className='mb-4'>
        <label className='flex mb-2 font-medium items-center gap-2'><FaUserLarge className='text-gray-400'/> Your Name </label>
        <input
          type='text'
          name='name'
          value={formData.name}
          //onChange={(e) => setName(e.target.value)}
          onChange={handleChange}
          placeholder='Your name or initials'
          className={`w-full p-2 border border-gray-300 rounded placeholder:text-gray-400 ${isInvalid('name') ? 'border-red-500' : 'border-gray-300'}`}
        />
      </div>

      {/* Location */}
      <div className='mb-4'>
        <label className='flex items-center gap-2 mb-2 font-medium'><ImLocation2 className='text-gray-400'/> Place of visit</label>
        <input
          type='text'
          name='name'
          defaultValue={formData.address}
          //value={formData.name}
          //onChange={(e) => setName(e.target.value)}
          onChange={handleChange}
          placeholder='Enter your name'
          className='w-full p-2 border border-gray-300 rounded'
        />
      </div>

      {/* Reason for visit dropdown */}
      <div className='mb-4'>
        <label className='flex items-center gap-2 mb-2 font-medium'><FaStethoscope className='text-gray-400' /> Reason for Visiting</label>
        <select
          name='reason'
          value={formData.reason}
          //onChange={(e) => setReason(e.target.value)}
          onChange={handleChange}
          className={`w-full p-2 border border-gray-300 rounded ${isInvalid('reason') ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value=''>Select a reason</option>
          <option value='general_checkup'>General Checkup</option>
          <option value='treatment_followup'>Treatment Follow-Up</option>
          <option value='new_symptoms'>New Symptoms</option>
          <option value='other'>Other</option>
        </select>
      </div>

      {/* Consent for data processing */}
      <div className='mb-4'>
        <label className='inline-flex '>
          <input
            type='checkbox'
            checked={formData.consent}
            name='consent'
            //onChange={(e) => setConsent(e.target.checked)}
            onChange={handleChange}
            className='mr-4 mt-1 rounded-sm outline-none cursor-pointer'
          />
          
        <p className='text-sm'>I consent to the processing of my personal data for the purpose of adding an opinion.</p>
        </label>

        <p className='text-[12px] mt-4'>By agreeing, you confirm that (1) the review is about your personal experience,
           (2) you were not offered any payment or similar incentive in exchange for posting a review, 
           (3) there are no restrictions on you posting a review. Please see our privacy policy and terms 
           and conditions for more information.
        </p>
      </div>

      {/* Submit button */}
      <div className='flex justify-end mt-4'>
        <button
          onClick={handleContinue}
          disabled={loading}
          className={`text-white px-3 py-2 rounded-sm flex items-center gap-1 transition-colors
            ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </div>
  )
}

export default ShareExperience
