import { useState, useEffect } from 'react'
import { Alert, Spinner } from 'flowbite-react'
import { BiSolidShow, BiSolidHide } from "react-icons/bi"
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInFailure, signInSuccess, clearError, resetUserState } from '../redux/user/userSlice'
import {signInDoctorSuccess, resetDoctorState } from '../redux/doctor/doctorSlice'
import { signInClinicSuccess, resetClinicState } from '../redux/clinic/clinicSlice'
import { signInAdminSuccess, resetAdminState } from '../redux/admin/adminSlice'
import OAuth from '../components/OAuth'
import AppleOAuth from '../components/AppleOAuth'
import PatientHeader from '../components/PatientHeader'


export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const { loading, error: errorMessage } = useSelector((state) => state.user)
  const [successMessage, setSuccessMessage] = useState('')

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 


  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()


  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        dispatch(clearError())
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage, dispatch])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    })
  }

    // Handle form changes
    const handleFormChange = (e) => {
      setFormData({ 
        ...formData, 
        [e.target.id]: e.target.value.trim() 
      }
    )
  }

    const handleChange = (e) => {
      handleFormChange(e)
      handleInputChange(e)
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
  
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all fields'))
    }
    
    dispatch(signInStart())
    
    try {
      
  
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(formData),
      })
  
      const data = await response.json()
  
      // Check if the response indicates a failure
      if (data.success === false) {
        return dispatch(signInFailure(data.message))
      }
  
      if (response.ok) {
        const {  redirectTo, user } = data
        const role = user.role  

        // Clear all roles BEFORE setting the new one
        dispatch(resetAdminState());
        dispatch(resetDoctorState());
        dispatch(resetClinicState());
        dispatch(resetUserState());


        // Role-based dispatch
        if (user.role === 'admin') {
          dispatch(signInAdminSuccess(user));
        } else if (user.role === 'doctor') {
          dispatch(signInDoctorSuccess(user)); 
        } else if (user.role === 'clinic') {
          dispatch(signInClinicSuccess(user));
        } else {
          dispatch(signInSuccess(user));
        }


          const fromPath = location.state?.from?.pathname
          const forbiddenPaths = ['/doctor-profile', '/clinic', '/admin', '/dashboard', '/doctor-calendar']
          const isCrossRolePath = forbiddenPaths.some(path => fromPath?.startsWith(path))

          navigate(isCrossRolePath ? redirectTo || '/' : fromPath || redirectTo || '/', {
            replace: true,
          })

      
      
      }
    } catch (error) {
      // Handle any errors that occur during the fetch
      dispatch(signInFailure('Login failed. Please try again.'))
      console.error('Login error:', error)
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
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <h2 style={headerStyle}>Log in to your account</h2>
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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email" 
                  className='w-full py-2 px-4 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                />
              </div>
              <div className='flex flex-col mt-4'>
                <div className='flex items-end '>
                  <input
                    className='rounded-bl-sm rounded-tl-sm w-full border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                    style={{height: '40px'}}
                    placeholder='Password'
                    type={showPassword ? 'text' : 'password'}
                    id='password'
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type='button'
                    className='border px-2 rounded-br-sm rounded-tr-sm border-gray-300 bg-white text-gray-400 active:bg-gray-200 transition duration-300 ease-in-out'
                    onClick={() => setShowPassword(!showPassword)}
                    style={{height: '40px'}}
                  >
                    {showPassword ? <BiSolidHide /> : <BiSolidShow />}
                  </button>
                </div>
              </div>
              <button
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
                  'Log in'
                )}
              </button>
              <div className='text-[11px] text-center'>
                <Link to='/forgot-password'><span className='text-blue-500 mr-1'>Forgot your password ?</span></Link>
              </div>
            </form>
            <hr className='mt-5'/>
            <div className='flex text-[12px] mt-5'>
              <span>Don't have an account at Medi-Pulse?</span>
              <Link to='/signup' className='text-blue-500 ml-2'>
                <span className='text-[12px]'>Create a free account</span>
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


