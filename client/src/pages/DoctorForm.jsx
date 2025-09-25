import { useState} from 'react'
import { Alert, Spinner } from 'flowbite-react'
import { TbStarsFilled } from "react-icons/tb"
import { HiMiniUsers } from "react-icons/hi2"
import { IoDiamond } from "react-icons/io5"
import { MdOutlineStarPurple500 } from "react-icons/md"
import SignupDoctorInfo from '../components/SignupDoctorInfo'
import SignupDoctorMoreInfo from '../components/SignupDoctorMoreInfo'
import DoctorHeader from '../components/DoctorHeader'
import { signInDoctorSuccess } from '../redux/doctor/doctorSlice'
import { useDispatch } from 'react-redux'
import doctorImg from '../assets/doc.jpg'
import doctorImage from '../assets/doc-1.jpg'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import axios from 'axios'
import { ROUTES } from '../config/routes'





// update using redux for state mantainance

const DoctorForm = () => {

  const [page, setPage] = useState(0)
  const titles = ['Personal information', 'Create a free doctors account' ]
  const totalSteps =  titles.length // totaal number of steps
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [invalidFields, setInvalidFields] = useState([])
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    medicalCategory: '',
    city: '',
    profile: 'doctor',
    countryCode: '',
    phoneNumber: '',
    email: '',
    password: '',
    selectAll: false,
    termsConditions: false,
    profileStatistcs: false,

  })

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

  const [successMessage, setSuccessMessage] = useState(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  
  const PageDisplay = () => {
    if (page === 0) {

      return <SignupDoctorInfo 
                formData={formData} 
                setFormData={setFormData} 
                invalidFields={invalidFields} 
                setInvalidFields={setInvalidFields}
              />

    } else if (page === 1) {

      return <SignupDoctorMoreInfo 
                formData={formData} 
                setFormData={setFormData} 
                invalidFields={invalidFields} 
                setInvalidFields={setInvalidFields}
              />
    }
  }

  const handleNext = () => {
    if (page < totalSteps - 1) {
      setPage(page + 1)
    }
  }

  const handleBack = () => {
    if (page > 0) {
      setPage(page - 1)
    }
  }

  // Validate the form data before moving to the next page
  const validatePage = () => {

   // Define required fields for the first page
   const requiredFieldsPage1 = ['firstName', 'lastName', 'medicalCategory'];

   // Define required fields for the second page
   const requiredFieldsPage2 = ['city', 'countryCode', 'phoneNumber', 'email', 'password', 'termsConditions'];

   // Determine which fields to validate based on the current page
   const requiredFields = page === 0 ? requiredFieldsPage1 : requiredFieldsPage2;


    const newInvalidFields = []

    for (const field of requiredFields) {
      const value = formData[field];
      // console.log('Checking field:', field, 'Value:', value);
      if (!value || (typeof value === 'string' && !value.trim())) {
        // console.log(`Invalid field found: ${field}`);
        newInvalidFields.push(field);
      }
    }
  
  

    setInvalidFields(newInvalidFields)
    
    if (newInvalidFields.length > 0) {
      setErrorMessage('Please fill in all required fields before proceeding')
      return false
    }

    setErrorMessage(null) // Clear the error message if there are no invalid fields
    return true
  }

  // HANDLE SUBMIT

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validate required fields
    const requiredFields = [
      'firstName', 
      'lastName', 
      'medicalCategory', 
      'city', 
      'countryCode', 
      'phoneNumber', 
      'email', 
      'password',
      'termsConditions'
    ]

     // Check for empty fields or fields that are not strings
      const isEmptyField = requiredFields.some(field => {
        const value = formData[field]
        // allow terms to be a boolean
        if ( field === 'termsConditions') {
          return !value
        }
        return typeof value !== 'string' || !value.trim() === ''
      })
      

      if (isEmptyField) {
        setLoading(false)
        return setErrorMessage('Please fill in all fields')
      }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setErrorMessage('Please enter a valid email');
    }

    // validate password length
    if (formData.password.length < 6) {
      return setErrorMessage('Password must be at least 6 characters')
    }

    // trim form data before sending
    const trimmedFormData = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      medicalCategory: formData.medicalCategory.trim(),
      city: formData.city.trim(),
      countryCode: formData.countryCode.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      termsConditions: formData.termsConditions,
      profileStatistcs: formData.profileStatistcs,
      selectAll: formData.selectAll,
      role: 'doctor'
    }

    // send form data to the server
    try {
      setLoading(true);  // Set loading to true when the request starts
  
      const response = await axios.post(`${API_BASE_URL}/api/auth/signup/doctor-form`, 
        formData, 
        { withCredentials: true } // Ensures cookies are sent
      );



      if (response.status === 201) {
        dispatch(signInDoctorSuccess(response.data.doctor)); // Store doctor in Redux
  
        // Redirect to confirmation page
        navigate(ROUTES.DOCTOR_SIGNUP_CONFIRMATION);
      } else {
        setErrorMessage("Signup failed. Invalid response from server.");
      }

  } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Signup failed. Please try again.');
  } finally {
      setLoading(false);  // Ensure loading is set to false after the request completes
  }
  
  }

  // Calculate progress percentage
  const progressPercentage = ((page + 1) / totalSteps) * 100;



  return (
    <div className=''>
        <DoctorHeader />
        
        <div className='w-full lg:flex h-screen min-h-full md:h-screen '>
           <div className='xl:w-[55%] md:w-[90%] p-4 '>
                <div className=' xl:w-[70%] md:w-[85%] sm:ml-auto sm:mr-9 sm:mt-8'>
                  
                  <div>
                      <h1 className='text-2xl sm:w-full font-semibold pb-3 sm:text-start'>{titles[page]}</h1>
                      <div className="w-full">
       
          <ProgressBar currentStep={page + 1} totalSteps={totalSteps} />
          
          </div>
                      <div className='sm:mt-2 '>{PageDisplay()}</div>
                  </div>
                  <div className='flex  flex-col sm:flex sm:flex-col gap-3 sm:w-full sm:ml-auto sm:mr-8'>
                      <div className='sm:flex flex gap-2 mt-6 w-full'>
                        <button
                            className='bg-blue-500 w-full text-white px-4 py-2 rounded-sm cursor-pointer'
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                            style={{ display: page === 0 ? 'none' : 'block' }}
                        >
                            Prev
                        </button>



                        <button
                          className="bg-blue-500 w-full text-white px-4 py-2 rounded-sm cursor-pointer"
                          
                          onClick={(e) => {
                            e.preventDefault()
                            if (page === titles.length - 1) {
                              handleSubmit(e); // Call the submit function on the last page
                            } else {
                              const isValid = validatePage();
                              if (isValid) {
                                setPage(page + 1); // Move to the next page only if valid
                              }
                            }
                          }}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <Spinner size="sm" />
                              <span>Loading...</span>
                            </>
                          ) : (
                            page === titles.length - 1 ? 'Submit' : 'Next'
                          )}
                        </button>
                      </div>

                      <span className='text-center  text-gray-400 pb-3'>*Required fields</span>

                      {errorMessage && (
                            <Alert className='mt-5' color='failure'>
                                {errorMessage}
                            </Alert>
                        )}

                        {successMessage && (
                            <Alert className='mt-5' color='success'>
                                {successMessage}
                            </Alert>
                        )}
                  </div>
                </div>
            </div>

           { page === 0 && ( 
              <div className=' xl:w-[45%] order-2 lg:order-none'>
                <section className='bg-gray-100 lg:h-screen lg:w-full' style={{ display: page === 1 ? 'none' : 'block'}}>
                <div className=' xl:w-[80%] md:w-[90%] p-4 pb-36 md:p-12'>
                <div className='lg:flex flex-col xl:max-w-[75%] md:max-w-[100%] '>
                  <div className='flex'>
                    <TbStarsFilled className='text-5xl text-teal-500' />
                    <div className='flex flex-col pl-2 pb-4'>
                      <span className='font-semibold'>Join over 170,000 doctors</span>
                      <span className='text-gray-500 text-sm'>Create a free account and develop your office with us!</span>
                    </div>
                  </div>
                  <div className='flex justify-start'>
                    <HiMiniUsers className='text-6xl text-teal-500' />
                    <div className='flex flex-col pl-2 pb-4'>
                      <span className='font-semibold'>Let yourself be found by over 14 million patients</span>
                      <span className='text-gray-500 text-sm'>Promote your services and make it easier for patients to reach your office.</span>
                    </div>
                  </div>
                  <div className='flex justify-start'>
                    <IoDiamond className='text-6xl text-teal-500' />
                    <div className='flex flex-col pl-2'>
                      <span className='font-semibold'>Take care of your reputation on the Internet</span>
                      <span className='text-gray-500 text-sm'>Create a professional business card and stand out among specialists in your area.</span>
                    </div>
                  </div>
                </div>
                </div>
            </section>
            </div>
           )}
            
            { page === 1 && (
              <div className='lg:w-[45%]'>
              <section
                className='bg-gray-100 sm:h-screen sm:w-full'
                style={{ display: page === 0 ? 'none' : 'block'}}
              >
                <div className=' xl:w-[70%] md:w-[90%]  xl:p-4 md:p-2 md:pt-10 pb-36 sm:p-12'>
                <div className='flex flex-col w-full'>
                <h3 className='text-lg font-semibold'>How do we help our specialists?</h3>
                <p className='text-[0.9rem] italic mt-3 xl:max-w-lg'>The appointment management system is a really convenient solution - I no longer have to deal with a constantly ringing phone. Medi-Pulso offers real support for busy doctors.</p>
                  <div className='flex mt-4 '>
                    <div className='pr-4'>
                      <img src={doctorImage} alt="doctors image" style={{height: '100px', width: '70px', borderRadius: '10px'}}/>
                    </div>
                    <div className=''>
                      <h3 className='text-blue-500 mt-4 mb-2 text-xl'>Marina Punhao</h3>
                      <span className=''>physiotherapist, Elk</span>
                      <div className='flex items-center gap-2'>
                        <div className='flex mt-1'>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                        </div>
                        
                        <span className='mt-'>1547 reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className='border-b-[1px] mt-8'></div>
                  <p className='text-[0.9rem] italic mt-6 xl:max-w-lg'>Right after I launched Calendar, my work became easier and I had more time for other activities. Patients had access to all appointments and I didn't have to worry about registration.</p>
                  <div className='flex mt-4'>
                    <div className='pr-4'>
                      <img src={doctorImg} alt="doctors image" style={{height: '100px', width: '70px', borderRadius: '10px'}}/>
                    </div>
                    <div className=''>
                      <h3 className='text-blue-500 mt-4 mb-2 text-xl'>Lukasz Klos</h3>
                      <span className=''>family doctor, Wejherowo</span>
                      <div className='flex items-center gap-2'>
                        <div className='flex mt-1'>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                        </div>
                        
                        <span className='mt-'>392 reviews</span>
                      </div>
                    </div>
                  </div>
                
                </div>
                </div>
              </section>
            </div>
          )}

        </div>
    </div>
  )
}

export default DoctorForm