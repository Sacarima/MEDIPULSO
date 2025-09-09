import  { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import AppointmentInformation from './AppointmentInformation'
import AppointmentType from './AppointmentType'
import AppointmentDateSelection from './AppointmentDateSelection'
import VisitOptionsSelection from './VisitOptionsSelection'
import { useDoctor } from '../context/DoctorContext'
import DoctorAppointmentHeader from './DoctorAppointmentHeader'
import { ImLocation2 } from "react-icons/im"
import { FaRegCalendarAlt } from "react-icons/fa"
import { BsCashStack } from "react-icons/bs"
import AppointmentFooter from './AppointmentFooter'
import { useSelector } from 'react-redux'



const  DoctorAppointment = () => {
    const [step, setStep] = useState(1)
    const totalSteps = 2
    const [visitType, setVisitType] =  useState('')
    const [appointmentInfo, setAppointmentInfo] =  useState({})
    const [ appointmentDate, setAppointmentDate] = useState('')
    const [invalidFields, setInvalidFields] = useState([])
    const [ errors, setErrors] = useState({})
    
    const navigate = useNavigate()
    const location = useLocation()
    const slotFromState = location.state?.slot;
    const slotFromStorage = localStorage.getItem("selectedSlot")
    const slot = slotFromState || slotFromStorage
    const { doctorId } = useParams()
    const doctorData = useDoctor()
    const { currentUser } = useSelector((state) => state.user)
    const [showCalendar, setShowCalendar] = useState(false)
    

    // Store selected appointment slot(date & tiime )
    const [appointmentSlot, setAppointmentSlot] = useState( slot || null)

    // Store visit type and appointment selection
    const [appointmentSelection , setAppointmentSelection] = useState(null)
    const [firstAppointment, setFirstAppointment] = useState(true)


    useEffect(() => {
      let storedSlot = location.state?.slot || localStorage.getItem("selectedSlot")
    
      if (storedSlot) {
        setAppointmentSlot(storedSlot)
      } else {
        console.warn("No slot selected.")
      }
    }, [])

    // Store patient details & form data
    const [formData, setFormData] = useState({
        details: '',
        reason: 'general_checkup',
        consent: false,
        pesel: "",
        phoneNumber: "",
        dateOfBirth: "",
       
      })

    // UI States
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    if (!doctorData) return <div>Loading...</div>;
    if (!slot) return <div>Error: No slot selected.</div>;

    const { firstName, lastName, doctorSpecialization, profilePicture, medicalSpecialtyCategory, address } = doctorData

    // handle show calendar
    const handleShowCalendar = () => {
        setShowCalendar((prev) => !prev)
    }
    

    if (!doctorData) {
        return <div>Loading...</div>
    }

    if (!slot) {
        return <div>Error: No slot selected.</div>;
      }
    
    

    
    const handleNextStep = () => {
        if( step < totalSteps) {
            setStep((prev) => prev + 1)
        }
    }

    const handlePreviousStep = () => {
        if( step > 1) {
            setStep((prev) => prev - 1)
        }
    }

    const calculateProgressWidth = () => {
        return `${(step / totalSteps) * 100}%`
    }

    const handleAppointmentSelection = (selection) => {
        setAppointmentSelection(selection)
    }

    useEffect(() => {
      if ( slot) {
        setAppointmentDate(slot)
      }
    }, [slot])

    const validateForm = () => {
      const newErrors = {}


      if (!formData.pesel) newErrors.pesel = 'PESEL is required'
      if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required'
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
      if (!formData.pesel) {
        newErrors.pesel = "This field is required.";
      }
      if (!formData.phoneNumber) {
        newErrors.phoneNumber = "This field is required.";
      }
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = "This field is required.";
      }
      return newErrors
    }

    // handle form data submit
    const handleSubmitAppointment = async () => {
      if (!formData.reason || !formData.consent || !slot) {
        setErrorMessage("Please complete all required fields.")
        return
      }

      // validste formData
      const validationErrors = validateForm()


      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        setErrorMessage("Please complete all required fields.")
        return
      }

      setErrors({})
      setLoading(true)


      // Extracting Date and Time from the Slot
      const [day, month, year, time] = slot.split(" ");

      // Create a valid date object in `YYYY-MM-DD` format
      const formattedDate = new Date(`${day} ${month} ${year}`).toISOString().split("T")[0];


      const fixedDateOfBirth = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split("T")[0] : "";


      const appointmentData = {
        doctor: doctorId,
        patient: currentUser._id,
        date: formattedDate,
        time: time.trim(),
        reason: formData.reason,
        specialNotes: formData.details || "",
        firstName: formData.name || "",
        lastName: formData.lastName || "",
        email: formData.email || "",
        status: "pending",
        phoneNumber: formData.phoneNumber || "",
        dateOfBirth: fixedDateOfBirth,
        consent: formData.consent,

    }

    
    try {
      const response = await fetch("http://localhost:7500/api/appointments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(appointmentData),
      })

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response from Server:", errorData);
        throw new Error(errorData.message || "Failed to create appointment.");
    }

      const result = await response.json()

      if (!result.appointment) {
        console.error("No appointment data returned!");
        setErrorMessage("Appointment data is missing.");
        return;
      }

      setSuccessMessage("Appointment successfully booked.")

      // Redirect to confirmation page aftter successful booking
      setTimeout(() => {
        
        // Store appointment in localStorage as a backup
        localStorage.setItem("lastAppointment", JSON.stringify(result.appointment))

        navigate('/appointment-confirmation', { state: { appointment: result.appointment || {} } })
      }, 300);
      
    } catch (error) {
      console.error("Appointment Submission Error:", error)
      setErrorMessage(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }



    


  return (
    <div>
        <DoctorAppointmentHeader 
           onBack={handlePreviousStep}
            calculateProgressWidth={calculateProgressWidth}
        />
      <div className="flex flex-col min-h-screen">
          
            <div className="flex-grow">
                {/* Step 1 - Visit Selection */}
                {step === 1 && (
                    <div className='lg:w-[60%] w-full px-4 lg:px-0 m-auto flex items-start flex-col lg:flex-row mt-10'>
                        <div className='lg:w-[60%] w-full'>
                            <VisitOptionsSelection
                                doctorId={doctorId}
                                handleNextStep={handleNextStep}
                                setAppointmentSelection={setAppointmentSelection}
                                appointmentSelection={appointmentSelection}
                                onBack={handlePreviousStep}
                                doctorData={doctorData}
                                showCalendar={showCalendar}
                                handleShowCalendar={handleShowCalendar}
                                setAppointmentSlot={setAppointmentSlot} // Capture Date & Time
                                
                                
                            />
                        </div>

                        {/* SIDE SECTION */}
                        <section className="flex justify-between lg:w-[40%] w-full grow  bg-gray-100 p-6 rounded-sm">
                          <div className="">
                            <div className="flex">
                              <img
                                src={profilePicture}
                                alt="doctor image"
                                className="rounded-xl w-8 h-8"
                              />
                              <div className='ml-4'>
                                  <p className='text-md font-semibold'>
                                    Dr. {firstName} {lastName}
                                  </p>
                                  <span className='text-gray-500 text-[12px]'>
                                    {doctorSpecialization}, {medicalSpecialtyCategory}
                                  </span>
                              </div>
                            </div>
                            <div className="flex flex-col mt-4">
                              <span className='flex  gap-2'>
                                <FaRegCalendarAlt className='text-gray-400 text-2xl' />
                                <div className='ml-4'>
                                    <p className='text-gray-950'> {slot}</p>
                                    <p 
                                        className='text-blue-500 text-[13px] cursor-pointer'
                                        onClick={handleShowCalendar}
                                    >
                                        Change the date
                                    </p>
                                </div>
                              </span>
                              <span className='flex items-center gap-2 mt-4'>
                                <ImLocation2 className="text-gray-400 text-2xl" />
                                <p className='ml-4 text-gray-950'>{address}</p>
                              </span>
                              <span className='flex items-center gap-2 mt-4'>
                                <BsCashStack className='text-gray-400 text-2xl' />
                                <p className='ml-4 text-gray-500'>Cash, Blik, Card payment, Bank transfer</p>
                              </span>
                            </div>
                          </div>
                        </section>
                    </div>
                )}

                {/* Step 2 - Patient Details */}
                {step === 2 && (
                    <div className='lg:w-[60%] w-full m-auto gap-8 flex flex-col lg:flex-row px-4 lg:px-0 items-start mt-10'>
                        <div className='lg:w-[60%] w-full'>
                            <AppointmentInformation
                                formData={formData}
                                setFormData={setFormData}
                                appointmentInfo={appointmentInfo}
                                setAppointmentInfo={setAppointmentInfo}
                                handlePreviousStep={handlePreviousStep}
                                doctorData={doctorData}
                                onBack={handlePreviousStep}
                                loading={loading}
                                errorMessage={errorMessage}
                                successMessage={successMessage}
                                handleSubmitAppointment={handleSubmitAppointment}
                                errors={errors}
                                setErrors={setErrors}
                            />
                        </div>
                        <section className="flex justify-between lg:w-[40%] w-full grow  bg-gray-100 p-6 rounded-sm">
                          <div className="">
                            <div className="flex">
                              <img
                                src={profilePicture}
                                alt="doctor image"
                                className="rounded-xl w-8 h-8"
                              />
                              <div className='ml-4'>
                                  <p className='text-md font-semibold'>
                                    Dr. {firstName} {lastName}
                                  </p>
                                  <span className='text-gray-500 text-[12px]'>
                                    {doctorSpecialization}, {medicalSpecialtyCategory}
                                  </span>
                              </div>
                            </div>
                            <div className="flex flex-col mt-4">
                              <span className='flex  gap-2'>
                                <FaRegCalendarAlt className='text-gray-400 text-2xl' />
                                <div className='ml-4'>
                                    <p> {slot}</p>
                                </div>
                              </span>
                              <span className='flex items-center gap-2 mt-4'>
                                <ImLocation2 className="text-gray-400 text-2xl" />
                                <p className='ml-4'>{address}</p>
                              </span>
                              <span className='flex items-center gap-2 mt-4'>
                                <BsCashStack className='text-gray-400 text-2xl' />
                                <p className='ml-4 text-gray-500'>Cash, Blik, Card payment, Bank transfer</p>
                              </span>
                            </div>
                          </div>
                        </section>
                    </div>
                )}
             
            </div>
            <AppointmentFooter
                step={step}
                totalSteps={totalSteps}
                handleNextStep={handleNextStep}
                navigate={navigate}
            />
      </div>
    
    </div>
  )
}

export default DoctorAppointment