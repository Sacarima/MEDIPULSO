import React, {useState, useEffect } from 'react'
import { FaUserFriends } from "react-icons/fa"
import { FaUser } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'



const AppointmentInformation = ({ formData, setFormData, errors, setErrors, handleSubmitAppointment, loading, errorMessage, successMessage })  => {
    const [isInvalid, setIsInvalid] = useState([])
    const [isEditable, setIsEditable] = useState(false);
    const [isEditableLastName, setIsEditableLastName] = useState(false)
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.user)
    const [userAppointmentToggle, setUserAppointmentToggle] = useState(false)
    const[appointmentForSomeoneElse, setAppointmentForSomeoneElse] = useState(false)
    const navigate = useNavigate()


    const [phone, setPhone] = useState('')
  

    // handle change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target 

        const updatedValue = type === "checkbox" ? checked : value

        setFormData(prev => ({ ...prev, [name]: updatedValue }))

       // if there are was error for this field, remove it.
        if ( errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors }
                delete newErrors[name]
                return newErrors
        })
      }
    }

        // Redirect to login if user is not logged in
        useEffect(() => {
          if (!currentUser) {
              navigate('/login')
          }
      }, [currentUser, navigate]);
  
      if (!currentUser) {
          return null
      }


    // handle appointment toggle
    const handleAppointmentToggle = () => {
        setUserAppointmentToggle((prev) => !prev)
    }

    // handle appointment for someone else
    const handleAppointmentForSomeoneElse = () => {
        setAppointmentForSomeoneElse((prev) => !prev)
    }


  return (
    <div>

              

            <div>
              {/* MAKE AN APOINTMENT FOR A USER OR FOR SOMEONNE ELSE  */}
              <h3 className='text-3xl'>Make an appointment</h3>
              <p className='mb-2 mt-8 font-medium'>Who are you making the appointment for?</p>
              <div className='flex mb-10'>
                <div 
                    className={`flex w-[50%] items-center justify-center cursor-pointer gap-2 border  ${!appointmentForSomeoneElse ? 'text-blue-500 border border-blue-500 active:bg-gray-300 bg-blue-100 ease-in' : 'text-gray-500 border border-gray-300'}`}
                    onClick={() => setAppointmentForSomeoneElse(false)}
                >  
                    <FaUser className='text-[13px]' />
                    <span>For yourself</span>
                </div>
                <div 
                    className={`flex w-[50%] items-center justify-center cursor-pointer gap-2 rounded-l-none rounded p-2 ${appointmentForSomeoneElse ? 'text-blue-500 border border-blue-500 active:bg-gray-300 bg-blue-100' : 'text-gray-500 border border-gray-300 '}`}
                    onClick={() => setAppointmentForSomeoneElse(true)}
                >
                    <FaUserFriends />
                    <span>For someone else</span>
                </div>

            </div> 

            {/*  MAKE APPOINTMENT FOR SOMOEONE ELSE */}
            {appointmentForSomeoneElse && ( <div className='mb-12'>
                <span className='font-medium'>Patient personal data*</span>
                <div>
                    <input 
                        type="text" 
                        name='firstName'
                        value={formData.firstName || ""}
                        onChange={handleChange}
                        placeholder="Patient's name*" 
                        className='w-full p-2 border border-gray-300 rounded outline-none mt-6 placeholder:text-sm placeholder:text-gray-400'
                    />
                </div>
                <div>
                <input 
                    type="text" 
                    name='lastName'
                    value={formData.lastName || ""}
                    onChange={handleChange}
                    placeholder="Patient's surname*" 
                    className='w-full p-2 border border-gray-300 rounded outline-none mt-6 placeholder:text-sm placeholder:text-gray-400'
                />
            </div>
            
                <div className='mt-5'>
                    <span className='font-medium'>Date of birth*</span>
                    <input      
                        type="date" 
                        name='dateOfBirth'
                        value={formData.dateOfBirth || ""}
                        onChange={handleChange}
                        data-date-inline-picker="true" 
                        className='w-full p-2 border border-gray-300 rounded outline-none text-sm text-gray-400'
                    />
                </div>

           
            </div>
            )}

        
            <div>
            <span className='font-medium'>Personal data*</span>
            <div className='relative mt-2'>
                <label className='absolute top-0 text-[10px]  text-gray-500 ml-2'>Name*</label>
                <input 
                        type="text" 
                        className={`w-full p-2 text-gray-950 border border-gray-300 rounded bg-gray-200 
                        ${!isEditable ? "cursor-not-allowed" : "cursor-text"}`}
                        value={formData.firstName || currentUser.firstName || ""}
                        disabled={!isEditable}
                        onChange={handleChange}
                        onMouseEnter={() => setIsEditable(true)}
                        onMouseLeave={() => setIsEditable(false)}
                    
                
                />
                <div className='relative mt-4'>
                    <label className='absolute top-0 text-[10px]  text-gray-500 ml-2'>Last nme*</label>
                    <input
                        type="text"
                        className={`w-full p-2 text-gray-950 border border-gray-300 rounded bg-gray-200
                            ${!isEditableLastName ? "cursor-not-allowed" : "cursor-text"}`}
                            value={formData.lastName || currentUser.lastName || ""}
                            disabled={!isEditableLastName}
                            onChange={handleChange}
                            onMouseEnter={() => setIsEditableLastName(true)}
                            onMouseLeave={() => setIsEditableLastName(false)}
                    
                    />
                </div>
                <span className='flex gap-1 text-sm my-2'>You can change your personal information in <Link to='/patient-profile'><p className='text-blue-500'>your account settings</p></Link></span>
            </div>

            
          { !appointmentForSomeoneElse && (
             <div>
                 <div className='mt-5'>
                    <span className='font-medium'>Date of birth*</span>
                    <input
                        type="date"
                        name='dateOfBirth'
                        value={formData.dateOfBirth || ""}
                        onChange={handleChange}
                        data-date-inline-picker="true"
                        //className='w-full p-2 border border-gray-300 rounded outline-none'
                        className={`w-full p-2 border rounded outline-none mt-6 transition-all duration-200 ${
                            errorMessage && !formData.dateOfBirth
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                    />
                </div>

                <div>
                <input 
                    type="text" 
                    placeholder="PESEL*" 
                    name="pesel"
                    onChange={handleChange}
                    value={formData.pesel || ""}
                    className={`w-full p-2 border rounded outline-none mt-6 transition-all duration-200 ${
                        errorMessage && !formData.pesel
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    
                />
            </div>
             </div>
        )}

            

            <div className='w-full mt-6'>
                <p className='font-medium'>Contact details*</p>
                <div className='flex gap-2 flex-col lg:flex-row'>
                  <PhoneInput
                      country={'pl'}
                      value={formData.phoneNumber || ""}
                    
                      onChange={(phone) => setFormData({ ...formData, phoneNumber: phone })}
                      className={` w-[50%] border-[.5px] rounded outline-non mt-6 transition-all duration-200 ${
                          errorMessage && !formData.phoneNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        inputStyle={{
                            width: '100%',
                            height: '44px',
                            borderRadius: '0.5rem',
                            border: '1px solid #d1d5db', // Tailwind gray-300
                            paddingLeft: '3rem',
                            fontSize: '1rem',
                          }}
                          buttonStyle={{
                            borderRadius: '0.5rem 0 0 0.5rem',
                            border: '.5px solid #d1d5db',
                          }}
                  />
                  <div className='grow'>
                      <input
                          type="email"
                          name='email'
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Email*"
                          className={`w-full p-2 border rounded outline-none mt-6 transition-all duration-200 ${
                              errorMessage && !formData.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                      />
                  </div>
                </div>
            </div>

              {/* Textarea for additional details */}
              <div className='mb-4 mt-12'>
                <label className='34 font-medium'>Information for physician (optional)</label>
                <textarea
                  name='details'
                  value={formData.details}
                  onChange={handleChange}
                  placeholder='Here you can enter the information you want the doctor to know before your visit'
                  //onChange={(e) => setDetails(e.target.value)}
                  
                  className={`w-full h-24 p-2 border border-gray-300 mt-2 rounded placeholder:text-gray-400 placeholder:text-sm`}
                />
              </div>
             
        
              {/* Consent for data processing */}
              <div className='mb-4 '>
                <div className='flex items-center gap-1'>
                  <input
                    type='checkbox'
                    checked={formData.consent}
                    onChange={handleChange}
                    name='consent'
                    //onChange={(e) => setConsent(e.target.checked)}
                    
                    className='mr-4 mt-1 rounded-sm outline-none cursor-pointer'
                  />
                  
                <p className='text-sm'>I consent to the processing of my personal data for the purpose of making an appointment.</p>
                </div>
        
                <p className='text-[12px] mt-4'>By agreeing, you confirm that (1) the review is about your personal experience,
                   (2) you were not offered any payment or similar incentive in exchange for posting a review, 
                   (3) there are no restrictions on you posting a review. Please see our privacy policy and terms 
                   and conditions for more information.
                </p>
              </div>
        
              {/* Submit button */}
              <div className=' mt-4 mb-10'>
                <button
                  onClick={handleSubmitAppointment}
                  disabled={loading}
                  className={`text-white px-3 py-2 rounded-sm flex items-center w-full justify-center gap-1 transition-colors
                    ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </button>

                <p className='text-center mt-5 text-gray-400'>Required fields*</p>
              </div>

              {/* Error / Success Messages */}
              {errorMessage && <div className="text-red-500 mb-2 bg-red-50 p-3 rounded">{errorMessage}</div>}
              {successMessage && <div className="text-green-500 pb-6 bg-green-50 p-3 rounded ">{successMessage}</div>}
            </div>
           
    </div>
    </div>
  )
}

export default AppointmentInformation

