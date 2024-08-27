import {useState, useEffect} from 'react'
import {Alert, Button, Checkbox, Label, Spinner, TextInput} from 'flowbite-react'
import { BiSolidShow, BiSolidHide  } from "react-icons/bi"
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signInStart, signInFailure, signInSuccess } from '../redux/user/userSlice'
import OAuth from '../components/OAuth'
import AppleOAuth from '../components/AppleOAuth'
import PatientHeader from '../components/PatientHeader'


export default function Login() {
  const [formData, setFormData] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const { loading, error: errorMessage } = useSelector((state) => state.user)
  const [successMessage, setSuccessMessage] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  useEffect(() => {
    // Reset error message when the component mounts
    if (errorMessage) {
      dispatch(signInFailure(null))
    }
  }, [])

  // handle form data
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    })
  }

  const isFieldInvalid = (field) => {
    return !formData[field]
  }

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure('Please fill in all fields'))
    }

    if (formData.email.indexOf('@') === -1) {
      return dispatch(signInFailure('Wrong credentials'))
    }

    // send form data to the server
    try {
      dispatch(signInStart())
      const response = await fetch('http://localhost:7500/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success === false) {
        return dispatch(signInFailure(data.message))
      }

      if (response.ok) {
        dispatch(signInSuccess(data))
        setSuccessMessage('You have successfully logged in')
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure('An error occurred. Please try again later'))
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
                //onChange={handleChange}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email" 
                className='w-full py-2 px-4 rounded-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                //className={`block w-full mt-1 placeholder-gray-400 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out  ${isFieldInvalid('email') ? 'border-red-500' : 'border-gray-300'}`}
                />
                
                
            </div>

            <div className='flex flex-col mt-4'>
                    <div className='flex items-end '>
                      <input
                        className='rounded-bl-sm rounded-tl-sm w-full border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        //className={`block w-full mt-1 placeholder-gray-400 px-3 py-2 border rounded-tl-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out  ${isFieldInvalid('password') ? 'border-red-500' : 'border-gray-300'}`}
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

