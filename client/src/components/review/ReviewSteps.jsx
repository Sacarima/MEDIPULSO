import { useState } from 'react'
import ReviewHeader from './ReviewHeader'
import RatingStep from './RatingStep'
import OptionsStep from './OptionsStep'
import ShareExperience from './ShareExperience'
import { FaLightbulb } from "react-icons/fa"
import ratingImg from '../../assets/rateicon.png'
import { useNavigate } from 'react-router-dom'
import { useDoctor } from '../context/DoctorContext'




const ReviewSteps = () => {
    const [step, setStep] = useState(1)
    const totalSteps = 3
    const [selectedRating, setSelectedRating] = useState(0)
    const [selectedOptions, setSelectedOptions] = useState([])
    const[selectedReview, setSelectedReview] = useState({})
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [invalidFields, setInvalidFields] = useState([])


    const doctorData = useDoctor()
    const { _id, firstName, lastName, doctorSpecialization, profilePicture, medicalSpecialtyCategory } = doctorData

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
      rating: 0,
      details: '',
      name: '',
      reason: 'general_checkup',
      consent: false
    })

    const calculateProgressWidth = () => {
        return `${(step / totalSteps) * 100}%`
    }

    const handleNextStep = () => {
        if (step < totalSteps) {
            setStep((prev) => prev + 1)
        }
    }

    const handlePreviousStep = () => {
        if (step > 1) {
            setStep((prev) => prev - 1)
        }
    }
    

    const handleNextFromRating = () => {
        if (selectedRating > 0) {
            handleNextStep()
        } else {
            alert("Please select a rating before continuing.");
        }
    }

    const handleOptionClick = (option) => {
        setSelectedOptions((prev) => {
            return prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        })
    }
    
    const handleDetailedReview = () => {
        const reviewData = {
            rating: selectedRating,
            options: selectedOptions,
        }
        setSelectedReview(reviewData)
        setStep(3)
    }

  // Validate the form fields before submitting
    const validateFields = () => {
      // define a list of fields to validate
      const requiredFields = ['details', 'name', 'reason', 'consent']
  
      // Check if the required fields are empty
      const invalidFields = requiredFields.filter((field) => {
        return !formData[field]
      })
  
      // Update the state with the invalid fields
      setInvalidFields(invalidFields)
  
      // Return true if there are no invalid fields
      return invalidFields.length === 0
    }

  const handleSubmit = async (finalFormData) => {
    setLoading(true)


    try {
        const payload = {
            ...finalFormData,
            ...selectedReview,
            doctorId: _id
        }

        const response = await fetch(`http://localhost:7500/api/reviews/${_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(payload),
        })

        if (response.ok) {
            setSuccessMessage('Review submitted successfully')
            
            setTimeout(() => navigate(`/profile-info/${_id}`), 3000)
        } else {
            const errorData = await response.json()
            setErrorMessage(errorData.message || 'An error occurred. Please try again')
        }

    } catch (error) {
        console.error('Error submitting review:', error)
        setErrorMessage(error.response?.data.message || 'An error occurred. Please try again')
    } finally {
        setLoading(false)
    }

}

  if (!doctorData) {
      return <div>Loading doctor details...</div>;
  }

return (
    <div className="min-h-screen flex flex-col overflow-hidde">
      {/* Sticky Header */}
      <ReviewHeader
        step={step}
        totalSteps={totalSteps}
        onBack={handlePreviousStep}
        calculateProgressWidth={calculateProgressWidth}
      />
  

      <div className="">
        {step === 1 && (
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[50%] w-full pr-12">
              <div className="my-8 p-4 lg:max-w-[70%] ml-auto">
                <span className="text-3xl font-semibold">
                  How would you like to rate your visit?
                </span>
                <div className="flex justify-between border-[1px] rounded-md border-gray-200 p-6 my-8">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200">
                      <img
                        src={profilePicture}
                        alt="doctor image"
                        className="rounded-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2>
                        Dr. {firstName} {lastName}
                      </h2>
                      <p>
                        {doctorSpecialization}, {medicalSpecialtyCategory}
                      </p>
                    </div>
                  </div>
                </div>
                <RatingStep
                  selectedRating={selectedRating}
                  onRatingSelect={setSelectedRating}
                  onContinue={handleNextFromRating}
                />
              </div>
            </div>
  
            <div className="bg-gray-100 lg:w-[50%]">
              <div className="lg:w-[70%]">
                <div className="h-screen">
                  <div className="pl-8 py-8 pr-24">
                    <div className="flex gap-2 border-[1px] bg-white rounded-sm border-gray-100">
                      <div className="py-4">
                        <FaLightbulb className="text-[#00c3a5] text-4xl" />
                      </div>
                      <div className="py-4">
                        <p className="mb-6 pr-1">
                          We publish both negative and positive reviews. In order
                          to ensure the safety and quality of entries, we verify
                          each review before publishing.
                        </p>
                        <span className="text-blue-500 cursor-pointer hover:underline hover:text-blue-900">
                          Read our review guidelines
                        </span>
                      </div>
                    </div>
                    <img
                      src={ratingImg}
                      alt="rating Image"
                      className="lg:w-[50%] m-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[50%] pr-12">
              <div className="my-8 p-4 lg:max-w-[70%] lg:ml-auto">
                <span className="text-3xl font-semibold">
                  Please provide more details
                </span>
                <div className="flex justify-between border-[1px] rounded-md border-gray-200 p-6 my-8">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200">
                      <img
                        src={profilePicture}
                        alt="doctor image"
                        className="rounded-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2>
                        Dr. {firstName} {lastName}
                      </h2>
                      <p>
                        {doctorSpecialization}, {medicalSpecialtyCategory}
                      </p>
                    </div>
                  </div>
                </div>
                <OptionsStep
                  selectedOptions={selectedOptions}
                  onOptionSelect={handleOptionClick}
                  onContinue={handleDetailedReview}
                  onBack={handlePreviousStep}
                />
              </div>
            </div>
  
            <div className="bg-gray-100 lg:w-[50%]">
              <div className="lg:w-[70%]">
                <div className="h-screen">
                  <div className="pl-8 py-8 pr-24">
                    <div className="flex gap-2 border-[1px] bg-white rounded-sm border-gray-100">
                      <div className="py-4">
                        <FaLightbulb className="text-[#00c3a5] text-4xl" />
                      </div>
                      <div className="py-4">
                        <p className="mb-6 pr-1">
                          We publish both negative and positive reviews. In order
                          to ensure the safety and quality of entries, we verify
                          each review before publishing.
                        </p>
                        <span className="text-blue-500 cursor-pointer hover:underline hover:text-blue-900">
                          Read our review guidelines
                        </span>
                      </div>
                    </div>
                    <img
                      src={ratingImg}
                      alt="rating Image"
                      className="lg:w-[50%] m-6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-[50%] pr-12">
              <div className="my-8 p-4 lg:max-w-[70%] ml-auto">
                <span className="text-3xl font-semibold">Share your experience</span>
                <div className="flex justify-between border-[1px] rounded-md border-gray-200 p-6 my-8">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200">
                      <img
                        src={profilePicture}
                        alt="doctor image"
                        className="rounded-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h2>
                        Dr. {firstName} {lastName}
                      </h2>
                      <p>
                        {doctorSpecialization}, {medicalSpecialtyCategory}
                      </p>
                    </div>
                  </div>
                </div>
                <ShareExperience
                  selectedReview={selectedReview}
                  onContinue={handleDetailedReview}
                  onSubmit={handleSubmit}
                  onBack={handlePreviousStep}
                />
              </div>
            </div>
  
            <div className="bg-gray-100 lg:w-[50%]">
              <div className="lg:w-[70%]">
                <div className="h-screen">
                  <div className="lg:pl-8 py-8 lg:pr-24">
                    <div className="flex gap-2 border-[1px] bg-white rounded-sm border-gray-100">
                      <div className="py-4">
                        <FaLightbulb className="text-[#00c3a5] text-4xl" />
                      </div>
                      <div className="py-6 lg:pr-6">
                        <span className="font-bold">Tips on how to write reviews</span>
                        <p className="font-medium mt-4">Share your experience</p>
                        <p className="mb-6 pr-1">
                          We publish both negative and positive reviews. In order
                          to ensure the safety and quality of entries, we verify
                          each review before publishing.
                        </p>
                        <p className="font-medium mt-4">Focus on the specifics</p>
                        <p className="mb-6 pr-1">
                          Location, amenities, waiting times, communication, and
                          payment methods are topics that interest many people
                          before making an appointment.
                        </p>
                        <p className="font-medium mt-4">
                          Write honestly and constructively
                        </p>
                        <p className="mb-6 pr-1">
                          Even if your experience with a specialist wasn't the
                          best, avoid offensive language. Stick to facts, not
                          judgments.
                        </p>
                        <p className="font-medium mt-4">Medical errors</p>
                        <p className="mb-6 pr-1">
                          Do you suspect a medical error has occurred? It would be
                          best to contact your local authorities.
                        </p>
                        <span className="text-blue-500 cursor-pointer hover:underline hover:text-blue-900">
                          Read our review guidelines
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
  
}

export default ReviewSteps