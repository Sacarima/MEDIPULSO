import  { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import DoctorServices from './DoctorServices'
import DoctorPriceList from './DoctorPriceList'
import DoctorPaymentMethods from './DoctorPaymentMethods'
import DoctorAvailability from './DoctorAvailability'
import DoctorCertificate from './DoctorCertificate'
import DoctorCalendar from './DoctorCalendar'
import DoctorProfileCompletionHeader from './DoctorProfileCompletionHeader'
import DoctorOfficeInformation from './DoctorOfficeInformation'
import locationImg from '../../assets/doctorlocation.png'
import serviceImg from '../../assets/section.png'
import { IoBulbOutline } from "react-icons/io5"
import { ROUTES } from '../../config/routes'




const DoctorProfileCompletion = () => {
  const { currentDoctor } = useSelector(state => state.doctor)
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const totalSteps = 6

  const [services, setServices] = useState([])
  const [priceList, setPriceList] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [certificateUpload, setCertificateUpload] = useState([])
  const [calendar, setCalendar] = useState([])
  const [availability, setAvailability] = useState([])
  const [officeInformation, setOfficeInformation] = useState([])

  const [completedSteps, setCompletedSteps] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Move to next step
  const handleNext = () => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps((prev) => [...prev, step])
    }
    
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  // Move back to previous step
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentDoctor?._id) {
        console.error(" Missing doctor ID in frontend");
        setErrorMessage("Doctor information is missing. Please log in again.");
        return;
    }

    // Collect form data
    const updatedDoctorData = {
        services,
        priceList,
        paymentMethods,
        certificateUpload,
        calendar,
        officeInformation
    };


    try {
        const response = await axios.put(
            `http://localhost:7500/api/doctor-form/profile-completion/${currentDoctor._id}`, 
            updatedDoctorData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Server Response:", response.data);

        if (response.data.success) {
            setSuccessMessage("Profile updated successfully");
            setTimeout(() => navigate(ROUTES.DOCTOR_PROFILE), 2000);
        }
    } catch (error) {
        console.error(" API Error:", error)
        setErrorMessage(error.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
};




  

  return (
    <div className='w-full'>
      <DoctorProfileCompletionHeader  step={step} completedSteps={completedSteps} />
      
     
        {step === 1 && (
            <div className='flex flex-col-reverse lg:flex-row min-h-screen p-4 '>
              {/* Form Section */}
              <div className='w-full lg:w-1/2'>
                <div className='w-full px-4 sm:px-6 md:px-8 lg:w-[70%] lg:ml-auto'>
                  <DoctorOfficeInformation
                    setOfficeInformation={setOfficeInformation}
                    officeInformation={officeInformation}
                    handleNext={handleNext}
                    handleBack={handleBack}
                    step={step}
                  />
                </div>
              </div>

              {/* Image/Tip Section */}
              <div className='bg-[#bdc3cb63] w-full lg:w-1/2'>
                <div className='w-full px-4 lg:px-6 md:px-8 lg:w-[70%] lg:mr-auto mt-10'>
                  <div className='lg:grid lg:h-screen content-between lg:ml-10'>
                    <div className='flex w-full lg:w-2/3 gap-2 lg:p-4 bg-white rounded-sm shadow mt-10'>
                      <IoBulbOutline className='text-[#00c3a5] text-6xl ' />
                      <p>
                        Providing your exact address and your practice full name will make it easier for patients to find you.
                      </p>
                    </div>
                    <img src={locationImg} alt="location" className='mb-10 lg:mb-48 w-full' />
                  </div>
                </div>
              </div>
            </div>
          )}


          {step === 2 && (
          <div className='flex flex-col-reverse lg:flex-row min-h-screen'>
            <div className='bg-white lg:w-1/2'>
              <div className='lg:w-[70%] lg:ml-auto'>
              <DoctorServices 
                setServices={setServices} 
                handleNext={handleNext} 
                handleBack={handleBack} 
              />
              </div>
            </div>


            <div className='bg-[#bdc3cb63] lg:w-[50%]'>
              <div className='lg:w-[70%] w-full lg:mr-auto mt-24'>
                <div className=" grid h-screen content-between lg:ml-10">
                    <div className='flex w-[70%]  lgw-2/3 gap-2 p-4 bg-white rounded-sm shadow mt-10'>
                       <IoBulbOutline className='text-[#00c3a5] text-6xl ' />
                       <p>Remember that patients are 4x more likely to choose doctors who provide full information about themselves and their services.</p>
                    </div>
                    
                    <img src={serviceImg} alt="" className='mb-48' />
                </div>
              </div>
            </div>
            
          </div>
        )}

        {/* SERVICE PRICE LIST */}
        {step === 3 && (
          <div className='flex flex-col-reverse lg:flex-row min-h-screen'>
            <div className='bg-white lg:w-1/2'>
              <div className='lg:w-[70%] lg:ml-auto'>
              <DoctorPriceList 
                setPriceList={setPriceList} 
                handleNext={handleNext} 
                handleBack={handleBack} 
              />
              </div>
            </div>


            <div className='bg-[#bdc3cb63] lg:w-[50%]'>
              <div className='lg:w-[70%] w-full  lg:mr-auto lg:mt-24'>
                <div className=" grid h-screen content-between ml-10">
                    <div className='flex  w-2/3 gap-2 p-4 bg-white rounded-sm shadow mt-10'>
                       <IoBulbOutline className='text-[#00c3a5] text-6xl ' />
                       <p>For many patients, price is one of the most important criteria when choosing a doctor.</p>
                    </div>
                    
                    <img src={serviceImg} alt="" className='mb-48' />
                </div>
              </div>
            </div>
            
          </div>
        )}


          {/* PAYMENT METHODS */}
          {step === 4 && (
          <div className='flex flex-col-reverse lg:flex-row  '>
            <div className='bg-white lg:w-[50%]'>
              <div className='lg:w-[70%] lg:ml-auto'>
                <DoctorPaymentMethods 
                  setPaymentMethods={setPaymentMethods} 
                  handleNext={handleNext} 
                  handleBack={handleBack} 
                  />
              </div>
            </div>


            <div className='bg-[#bdc3cb63] lg:w-[50%]'>
              <div className='lg:w-[70%] lg:mr-auto mt-'>
                <div className="flex lg:h-screen ml-1">
                    
                    
                    <img src={serviceImg} alt="" className='lg:mt-auto grow lg:w-[100%]' />
                </div>
              </div>
            </div>
            
          </div>
        )}

        
        {step === 5 && (
          <div className='flex flex-col-reverse lg:flex-row  min-h-screen'>
            <div className='bg-white lg:w-[50%]'>
              <div className='lg:w-[70%] lg:ml-auto'>
                <DoctorCertificate 
                  setCertificateUpload={setCertificateUpload} 
                  handleNext={handleNext} 
                  handleBack={handleBack} 
                />
              </div>
            </div>


            <div className='bg-[#bdc3cb63] lg:w-[50%]'>
              <div className='lg:w-[70%] lg:mr-auto lg:mt-24'>
                <div className=" grid h-screen content-between ml-10">
                    <div className='flex w-[70%]  lg:w-2/3 gap-2 p-4 bg-white rounded-sm shadow mt-10'>
                       <IoBulbOutline className='text-[#00c3a5] text-6xl ' />
                       <p>For many patients, price is one of the most important criteria when choosing a doctor.</p>
                    </div>
                    
                    <img src={serviceImg} alt="" className='mb-48' />
                </div>
              </div>
            </div>
            
          </div>
        )}

        {step === 6 && (
          <div className='flex min-h-screen'>
            <div className='bg-white w-full'>
              <div className='w-[70%] mx-auto'> 
                <DoctorAvailability 
                  setAvailability={setAvailability}
                  handleNext={handleNext} 
                  handleBack={handleBack}
                  handleSubmit={handleSubmit}
                  isSubmitting={isSubmitting}
                  errorMessage={errorMessage}
                  successMessage={successMessage}
                />
                
              </div>
            </div>
            </div>
        )}


    </div>
  )
}

export default DoctorProfileCompletion