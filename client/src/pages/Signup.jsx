import { useState } from 'react'
import {Alert, Button, Label, Spinner, TextInput} from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth'


export default function SignUp() {
  
  const [formData, setFormData] =  useState({
    username: '',
    email: '',
    password: ''
  })
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    })
    

}

  const handleSubmit = async (e) => {
    // 
    e.preventDefault()
    if (formData.username === '' || formData.email === '' || formData.password === '') {
      return setErrorMessage('Please fill in all fields')
    }
    if (formData.email.indexOf('@') === -1) {
      return setErrorMessage('Please enter a valid email')
    }
    if (formData.password.length < 6) {
      return setErrorMessage('Password must be at least 6 characters')
    }

    //  send the form data to the server
    try {
      setLoading(true)
      setErrorMessage(null)
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      if ( data.success === false) {
        return setErrorMessage(data.message)
      }
      setLoading(false)
      if(response.ok) {
        navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-6'>

      
      {/**lelft side log*/}
      <div className='flex-1'>
        <Link to='/' className='font-bold text-4xl dark:text-white'>
              <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Programming</span>
              Nest
      </Link>
      <p className='text-sm mt-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit.  non sed velit incidunt doloremque? Quos nihil delectus, voluptatem amet perferendis commodi at labore.</p>
      </div>
      {/* Sign up form */}
      <div className='flex-1'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label value="Username" />
            <TextInput 
              type="text" 
              placeholder="Username"
              id="username"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label value="Email" />
            <TextInput 
              type="text" 
              placeholder="email"
              id="email"
              onChange={handleChange}
            />
          </div>

          <div>
            <Label value="Password" />
            <TextInput 
              type="text" 
              placeholder="Password"
              id="password"
              onChange={handleChange}
            />
          </div>
          <Button 
            gradientDuoTone='purpleToPink' 
            type='submit'
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size='sm' />
                <span className=''pl-3>Loading...</span>
              </>
            ) : (
              'Sign Up'
            )}
       
          </Button>
          <OAuth />
        </form>
        <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/login' className='text-blue-500'>
              Sign In
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
  )
}

// Fixed the bug in the button, the loading effect is working when an error occurs