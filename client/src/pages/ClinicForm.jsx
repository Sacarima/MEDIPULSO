import { useState, useEffect} from 'react'
import { Alert, Label, Spinner } from 'flowbite-react'
import { FaUsers } from "react-icons/fa"
import { TiTick } from "react-icons/ti"
import { IoDiamond } from "react-icons/io5"
import { MdOutlineStarPurple500 } from "react-icons/md"
import SignupClinicInfo from '../components/SignupClinicInfo'
import SignupClinicMoreInfo from '../components/SignupClinicMoreInfo'
import DoctorHeader from '../components/DoctorHeader'
import doctorImg from '../assets/doc.jpg'
import doctorImage from '../assets/doc-1.jpg'
import { useNavigate } from 'react-router-dom'
import ProgressBar from '../components/ProgressBar'
import axios from 'axios'


const ClinicForm = () => {

  const [page, setPage] = useState(0)
  const titles = ['Personal information', 'Complete the details' ]
  const totalSteps =  titles.length // totaal number of steps
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [invalidFields, setInvalidFields] = useState([])
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    facilityName: '',
    numberOfDoctorsSpecialist: '',
    facilityPrograms: '',
    roleInFacility: '',
    city: '',
    profile: 'facility',
    phoneNumber: '',
    email: '',
    verifyEmail: '',
    password: '',
    confirmPassword: '',
    termsConditions: false,
    profileStatistcs: false,

  })
 

  const PageDisplay = () => {
    if (page === 0) {
      return (
        <SignupClinicInfo 
          formData={formData} 
          setFormData={setFormData} 
          invalidFields={invalidFields} 
          setInvalidFields={setInvalidFields}
        />
      )
    } else if (page === 1) {
      return (
        <SignupClinicMoreInfo 
          formData={formData} 
          setFormData={setFormData} 
          invalidFields={invalidFields} 
          setInvalidFields={setInvalidFields}
        />
      )
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
    const requiredFieldsPage1 = [
      'facilityName', 
      'facilityPrograms', 
      'city', 
      'numberOfDoctorsSpecialist'

    ]
 
    // Define required fields for the second page
    const requiredFieldsPage2 = [
      'email', 
      'verifyEmail', 
      'phoneNumber', 
      'confirmPassword', 
      'firstName', 
      'lastName', 
      'password', 
      'termsConditions',
      'roleInFacility',
      'profileStatistcs'
    ]
 
    // Determine which fields to validate based on the current page
    const requiredFields = page === 0 ? requiredFieldsPage1 : requiredFieldsPage2;
    const newInvalidFields = []
 
     for (const field of requiredFields) {
       const value = formData[field];
       //console.log('Checking field:', field, 'Value:', value);
       if (!value || (typeof value === 'string' && !value.trim())) {
         //console.log(`Invalid field found: ${field}`);
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


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!validatePage()) {
      setLoading(false);
      return;
    }

    // validate required fields before submitting the form
    const requireFields = [
      'firstName',
      'lastName',
      'facilityName',
      'numberOfDoctorsSpecialist',
      'facilityPrograms',
      'roleInFacility',
      'city',
      'phoneNumber',
      'email',
      'verifyEmail',
      'password',
      'confirmPassword',
      'termsConditions'
    ]

    // check for empty fields or fields that not strings
    const isEmptyField = requireFields.some(field => {
      const value = formData[field]
      // allow termsConditions to be a boolean
      if (field === 'termsConditions') {
        return !value
      }
      return typeof value !== 'string' || !value.trim() === ''
    })

    if (isEmptyField) {
      setLoading(false)
      return setErrorMessage('Please fill in all required fields')
   }

   // validate email and verifyEmail
    if (formData.email !== formData.verifyEmail) {
      setLoading(false)
      return setErrorMessage('Emails do not match')
    }

    // validate password and confirmPassword
    if (formData.password !== formData.confirmPassword) {
      setLoading(false)
      return setErrorMessage('Passwords do not match')
    }

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setLoading(false)
      return setErrorMessage('Invalid email format')
    }

    // validate password length
    if (formData.password.length < 8) {
      setLoading(false)
      return setErrorMessage('Password must be at least 8 characters long')
    }

    

    // trim form data before sending to the server
    const trimmedFormData = {
      ...formData,
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      facilityName: formData.facilityName.trim(),
      city: formData.city.trim(),
      email: formData.email.trim(),
      verifyEmail: formData.verifyEmail.trim(),
      password: formData.password.trim(),
      confirmPassword: formData.confirmPassword.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      termsConditions: formData.termsConditions,
      profileStatistcs: formData.profileStatistcs,
      roleInFacility: formData.roleInFacility.trim(),
      numberOfDoctorsSpecialist: formData.numberOfDoctorsSpecialist.trim(),
      facilityPrograms: formData.facilityPrograms.trim(),

    }

    // send the form data to the server
    try {
      setLoading(true)
      const response = await axios.post('http://localhost:7500/api/auth/signup/clinic-form', trimmedFormData)

      if (response.status === 201) {
        setSuccessMessage('Account created successfully')
        // redirect to the login page after successful registration
        setTimeout(() => navigate('/login'), 4000) // redirect to the login page after 4 seconds
        //navigate('/login')
      } 
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Sign up failed. Please try again')
    }finally {
      setLoading(false) // stop the loading animation
    }
  }

  // Calculate progress percentage
  const progressPercentage = ((page + 1) / totalSteps) * 100;

  return (
    <div className=''>
        <DoctorHeader />
        
        <div className='w-full sm:flex h-screen min-h-full md:h-screen '>
           <div className='lg:w-[55%] p-4'>
                <div className=' lg:w-[70%] sm:ml-auto sm:mr-9 sm:mt-8'>
                  
                  <div>
                      <h1 className='text-2xl sm:w-full font-semibold pb-3 sm:text-start'>{titles[page]}</h1>
                      <div className="w-full">
          
          <ProgressBar currentStep={page + 1} totalSteps={totalSteps} />
          </div>
                      <div className='sm:mt-2'>{PageDisplay()}</div>
                  </div>
                  <div className=' flex-col lg:flex-row lg:flex sm:flex-col gap-3 sm:w-full sm:ml-auto sm:mr-8'>
                      <div className='lg:flex flex gap-2 mt-6 w-full'>
                        <button
                        className='bg-blue-500 w-full text-white px-4 py-2 rounded-sm'
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                            style={{ display: page === 0 ? 'none' : 'block' }}
                        >
                            Prev
                        </button>
                        
                        <button
                          className="bg-blue-500 w-full text-white px-4 py-2 rounded-sm"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default behavior to avoid unexpected issues
                            if (page === titles.length - 1) {
                              handleSubmit(e); // Call the submit function on the last page
                            } else {
                              const isValid = validatePage();
                              //console.log('Validation result:', isValid);
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
              <div className=' lg:w-[45%]'>
                <section className='bg-gray-100 sm:h-screen sm:w-full' style={{ display: page === 1 ? 'none' : 'block'}}>
                <div className='lg:max-w-[80%] lg:w-[80%] p-4 pb-36 sm:p-12'>
                <div className='lg:flex flex-col lg:max-w-[75%]'>
                  <div className='flex'>
                    {/* <TbStarsFilled className='text-5xl text-teal-500' /> */}
                    <div className='flex flex-col pl-2 pb-4 sm:mt-8'>
                      <h2 className='font-semibold text-2xl pb-4'>Join over 22,000 medical offices and facilities!</h2>
                      <h3 className='text-lg font-semibold'>Create a free account and develop your office with us!</h3>
                    </div>
                  </div>
                  <div className='flex justify-start mt-10'>
                    <FaUsers className='text-6xl text-teal-500' />
                    <div className='flex flex-col pl-2 pb-4'>
                      <span className='font-normal text-slate-600'>Be found by over 13 million patients.</span>
                      <span className='text-gray-500 text-sm'>Showcase your doctors and make it easier for patients to find your facility.</span>
                    </div>
                  </div>
                  <div className='flex justify-start'>
                    {/* <IoDiamond className='text-4xl text-teal-500' /> */}
                    <TiTick className='text-6xl text-teal-500'/>
                    <div className='flex flex-col pl-2'>
                      <span className='font-normal text-slate-600'>Make it easier for patients to get to your facility.</span>
                      <span className='text-gray-500 text-sm'>Reduce the number of patients who forget about appointments by up to 65%.</span>
                    </div>
                  </div>
                  <div className='flex justify-start mt-4'>
                    <IoDiamond className='text-6xl text-teal-500' />
                    <div className='flex flex-col pl-2'>
                      <span className='font-normal text-slate-600'>Take care of the image of your facility.                      </span>
                      <span className='text-gray-500 text-sm'>Use the potential of your doctors to promote your facility.</span>
                    </div>
                  </div>
                </div>
                </div>
            </section>
            </div>
           )}
            
            { page === 1 && (
              <div className='sm:w-[45%] '>
              <section
                className='bg-gray-100 sm:h-screen sm:w-full'
                style={{ display: page === 0 ? 'none' : 'block'}}
              >
                <div className='lg:w-[60%]  p-4 pb-36 lg:p-12'>
                <div className='flex flex-col lg:w-[75%]'>
                <h3 className='text-lg font-semibold'>How do we help our specialists?</h3>
                <p className='text-[0.9rem] italic mt-3'>The appointment management system is a really convenient solution - I no longer have to deal with a constantly ringing phone. Medi-Pulso offers real support for busy doctors.</p>
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
                  <p className='text-[0.9rem] italic mt-6'>Right after I launched Calendar, my work became easier and I had more time for other activities. Patients had access to all appointments and I didn't have to worry about registration.</p>
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

export default ClinicForm