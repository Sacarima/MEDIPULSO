import { useState } from 'react'
import {Alert, Button, Checkbox, Label, Spinner, TextInput} from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import AppleOAuth from '../components/AppleOAuth'
import PatientHeader from '../components/PatientHeader'


const SignUp = () => {
  
  const [formData, setFormData] =  useState({ 
    username: '', 
    email: '', 
    password: '',
    consent: false,
    marketing: false
  })
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const handleChange = (e) => {
 

    const { id, checked, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [id]: id === 'consent' || id === 'marketing' ? checked : value
    }))
}

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate required fields
    const requiredFields = ['username', 'email', 'password'];
    const isEmptyField = requiredFields.some(field => !formData[field] || formData[field].trim() === '');
    if (isEmptyField) {
      return setErrorMessage('Please fill in all fields');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return setErrorMessage('Please enter a valid email');
    }

    // check if there's duplicate username
   

    // Validate password length
    if (formData.password.length < 6) {
      return setErrorMessage('Password must be at least 6 characters')
    }

    // Trim form data before sending
    const trimmedFormData = {
      ...formData,
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      consent: formData.consent,
      marketing: formData.marketing
    }

    // console.log(formData.consent); // Check if this logs true or false
    // console.log(formData.marketing);

    //  send the form data to the server
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetch('/api/auth/signup', /** a proxy needs to be create in vite.config.js in order for the appropriate port number
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
        return setErrorMessage(data.message || 'An error occurrerd during sign up. Please try again.')
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
        <div className=' m-auto w-ful sm:w-[60%]'>
          <form className='flex flex-col gap-4'  onSubmit={handleSubmit}>
            <h2 style={headerStyle}>Create a free account</h2>
            <OAuth />
            <AppleOAuth />

            <div className='flex justify-center items-center py-6'>
              <hr className='w-32 mr-2' />
              <span className='px-6'>or</span>
              <hr className='w-32 ml-2' />
            </div>

            <div className=''>
              <input 
                type="text" 
                id="username" 
                onChange={handleChange} 
                placeholder="Username" 
                className='w-full py-2 px-4 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'/>
            </div>

            <div>
              <input 
                type="text" 
                id="email" 
                onChange={handleChange}
                placeholder="Email" 
                className='w-full py-2 px-4 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'/>
                
            </div>

            <div>
              <input 
                type="password" 
                id="password" 
                onChange={handleChange} 
                placeholder="Password" 
                className='w-full py-2 px-4 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'/>
            </div>
            <div>
              <div>
                <input 
                  type="checkbox" 
                  className='mr-2'
                  id="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                />
                <label htmlFor="consent" className='text-[11px]'>I consent to Medi-Pluso processing my medical data in order to use the services</label>
              </div>
              <div>
                <input 
                  type="checkbox" 
                  className='mr-2'
                  id="marketing"
                  checked={formData.marketing}
                  onChange={handleChange}
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
              <span>By registering, you accept ours <span className='text-blue-500 mr-1'>regulations</span>and confirm that you understand our<span className='text-blue-500 ml-1'>personal data processing policy</span></span>
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
        </div>
      </div>
      </div>
    </>
  )
}

export default SignUp

// Fixed the bug in the button, the loading effect is working when an error occurs