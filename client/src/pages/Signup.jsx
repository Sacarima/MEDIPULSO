import { useState, useEffect } from 'react'
import {Alert, Button, Checkbox, Label, Spinner, TextInput} from 'flowbite-react'
import { BiSolidShow, BiSolidHide  } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import AppleOAuth from '../components/AppleOAuth'
import PatientHeader from '../components/PatientHeader'


const SignUp = () => {
  
  const [formData, setFormData] =  useState({  
    email: '', 
    password: '',
    termsConditions: false,
    consentToMarketing: false

  })
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [invalidFields, setInvalidFields] = useState([])
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const isFieldInvalid = (field) => invalidFields.includes(field)


  // handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value
    })

    // Remove the field from invalidFields when the user Starts typing
    if (isFieldInvalid(id) && value.trim() !== '') {
      setInvalidFields(invalidFields.filter((item) => item !== id))
    }
  }

 
  // 

  useEffect(() => {
    // Reset error and success messages when component mounts
    setErrorMessage(null)
    setSuccessMessage(null)
  }, [])

  // toggle the checkbox when individual checkbox is clicked
  const handleCheckbox = (e) => {
    const { id, checked } = e.target
    setFormData({
      ...formData,
      [id]: checked
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = ['email', 'password'];
    const newInvalidFields = []
   // const invalidFields = requiredFields.some(field => !formData[field] || formData[field].trim() === '')

    requiredFields.forEach(field => {
      if (!formData[field] || formData[field].trim() === '') {
        newInvalidFields.push(field);
      }
    })

    if (newInvalidFields.length > 0) {
    setInvalidFields(newInvalidFields);
    return setErrorMessage('Please fill in all fields');
  }
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setErrorMessage('Please enter a valid email');
    }
   
    // Validate password length
    if (formData.password.length < 6) {
      return setErrorMessage('Password must be at least 6 characters')
    }

    // // validate password strength
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    // if (!passwordRegex.test(formData.password)) {
    //   return setErrorMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    // }

     // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      return setErrorMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }


    // Trim form data before sending
    const trimmedFormData = {
      ...formData,
      email: formData.email.trim(),
      password: formData.password.trim(),
      consentToMarketing: formData.consentToMarketing,
      marketing: formData.termsConditions
    }

    // console.log(formData.consent); // Check if this logs true or false
    // console.log(formData.marketing);

    //  send the form data to the server
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetch('http://localhost:7500/api/auth/signup', /** a proxy needs to be create in vite.config.js in order for the appropriate port number
        to be identified or simply put the port number in there */
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trimmedFormData)
      })
      
      const data = await response.json()


      if(!response.ok) {
        setLoading(false)
        return setErrorMessage(data.message || 'Signup failed. Please try again.')
      }


      setLoading(false)
      setErrorMessage(null)
      navigate('/login')

    } catch (error) {
      setLoading(false)
      setErrorMessage(error.message)
      
    }
  }
  const headerStyle = {
    fontSize: '1.3rem',
    fontWeight: '700',
    color: '#222'
  }
  return (
    <>
    <PatientHeader />
      <div className='min-h-screen mt-10'>
        <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6'>
        <div className=' m-auto w-full sm:w-[60%]'>
          <form className='flex flex-col gap-4'  onSubmit={handleSubmit}>
            <h2 style={headerStyle}>Create a free account</h2>
            <OAuth />
            <AppleOAuth />

            <div className='flex justify-center items-center py-6'>
              <hr className='w-32 mr-2' />
              <span className='px-6'>or</span>
              <hr className='w-32 ml-2' />
            </div>

            <div>
              <input 
                type="text" 
                id="email" 
                //onChange={handleChange}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email" 
                //className='w-full py-2 px-4 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                className={`block w-full mt-1 placeholder-gray-400 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out  ${isFieldInvalid('email') ? 'border-red-500' : 'border-gray-300'}`}
                />
                
                
            </div>

            <div className='flex flex-col mt-4'>
                    <div className='flex items-end '>
                      <input
                        //className='rounded-bl-sm rounded-tl-sm w-full border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        className={`block w-full mt-1 placeholder-gray-400 px-3 py-2 border rounded-tl-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out  ${isFieldInvalid('password') ? 'border-red-500' : 'border-gray-300'}`}
                        style={{height: '40px'}}
                        placeholder='Password'
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        value={formData.password}
                        //onChange={(e) => setFormData({...formData, password: e.target.value})}
                        onChange={handleInputChange}
                      />
                      <button
                      type='button'
                        className='border px-2 rounded-br-sm rounded-tr-sm border-gray-300 bg-white text-gray-400 active:bg-gray-200 transition duration-300 ease-in-out'
                        onClick={() => setShowPassword(!showPassword)}
                        style={{height: '40px'}}
                      >
                        {showPassword ? <BiSolidHide  /> : <BiSolidShow  />}
                      </button>
                    </div>
                  
                  </div>
            <div>
              <div>
                <input 
                  type="checkbox" 
                  className='mr-2'
                  id='termsConditions'
                  checked={formData.termsConditions}
                  onChange={handleCheckbox}
                />
                <label htmlFor="consent" className='text-[11px]'>I consent to Medi-Pluso processing my medical data in order to use the services</label>
              </div>
              <div>
                <input 
                  type="checkbox" 
                  className='mr-2'
                  id='consentToMarketing'
                  checked={formData.consentToMarketing}
                  onChange={handleCheckbox}
                  
                />
                <label htmlFor="marketing" className='text-[11px]'>I want to receive marketing communications from Medi-Pulse "optional".</label>
              </div>
            </div>
            <button
              // gradientDuoTone='purpleToPink'
              className='btn btn-primary bg-blue-400 rounded-sm w-full  py-2 px-4 text-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 text-white focus:ring-offset-[#4285F4] focus:ring-[#4285F4] hover:bg-[#4285F4] hover:text-white hover:shadow-lg transition duration-300 ease-in-out'
              type='submit'
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span>Loading...</span>
                </>
              ) : (
                'Register for free'
              )}
      
            </button>
            <div className='text-[11px]'>
              <span>By registering, you accept ours <Link to='/regulation'><span className='text-blue-500 mr-1'>regulations</span></Link>and confirm that you understand our<span className='text-blue-500 ml-1'>personal data processing policy</span></span>
            </div>
      
          </form>
          <hr className='mt-5'/>
          <div className='flex text-[12px] mt-5'>
              <span>To continue, log in to your account at Medi-Pulse</span>
              <Link to='/login' className='text-blue-500 ml-2'>
                <span className='text-[12px]'>Log into your account</span>
              </Link>
            </div>

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
    </>
  )
}

export default SignUp

// Fixed the bug in the button, the loading effect is working when an error occurs