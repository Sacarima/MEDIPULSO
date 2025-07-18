import {  useState, useEffect } from 'react'
import { LiaTimesSolid } from "react-icons/lia"
import { useDispatch, useSelector } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Alert, Modal, Button } from 'flowbite-react'
import AccountHeaderPatient from '../components/AccountHeaderPatient'
import UpcomingAppointment from '../components/appointment/UpcomingAppointment'
import CancelAppointment from '../components/appointment/CancelAppointment'
import {Link, useLocation } from 'react-router-dom'

import { 
  updateStart, updateSuccess, updateFailure, 
  deleteUserStart, deleteUserFailure, deleteUserSuccess, clearError,
  } from '../redux/user/userSlice'



function PatientAccount() {
  
 
  const dispatch = useDispatch()
  const location = useLocation()
  const { currentUser, loading, error } = useSelector(state => state.user)


  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [originalData, setOriginalData] = useState({})
  const [showModal, setShowModal] = useState(false)

  const [activeSection, setActiveSection] = useState('account-settings')

  useEffect(() => {
    if (currentUser) {
      setActiveSection('account-settings')
    }
  }, [currentUser])

  // Check if there's a state directing to "my-visits"
  useEffect(() => {
    if (location.state?.section === "my-visits") {
      setActiveSection("my-visits");
    }
  }, [location])


  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  })

  // Select the current user and isLoggedIn status for both user and doctor
  

  useEffect(() => {
    // whem user changes the input fields set the original data and the current user's data

    if (currentUser) {
      setOriginalData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        password: currentUser.password
      })
      setFormData({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        password: currentUser.password
      })
    }
  }, [currentUser])

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }


   // update profile submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
    

    if(Object.keys(formData).length === 0) {
      setUpdateUserError('No changes were made')
      return
    }
    try {
      dispatch(updateStart())
      const token = localStorage.getItem('access_token');

      const response = await fetch(`http://localhost:7500/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
        credentials: 'include', // include cookies
      })

     

      const data = await response.json()
      console.log('Response:', data)

      if (!response.ok) {
        dispatch(updateFailure(data.message))
        setUpdateUserError(data.message)
      }else {
        dispatch(updateSuccess(data))
        setUpdateUserSuccess('Your profile information updated successfully')
      }
    } catch (error) {
      //console.log('Error:', error)
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }
  }

  const handleReset = () => {
    // reveert the form data to the original data
    setFormData(originalData)
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
  }

  // delete user
  const handleDeleteUser = async () => {
    setShowModal(false)
    try {
      dispatch(deleteUserStart())
      const response = await fetch(`http://localhost:7500/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()
      if (!response.ok) {
        dispatch(deleteUserFailure(data.message))
      }else {
        dispatch(deleteUserSuccess(data))
      }

    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }



  return (
    <div className='bg-gray-200 min-h-dvh'>
      <AccountHeaderPatient className='sticky top-0'/>
      <div className='bg-gray-200 min-h-dvh'>
        <main className=' sm:w-[80%]  m-auto  mt-8 bg-gray-200'>
          <section className=' sm:flex '>

            {/* Sidebar Navigation */}
            <aside 
              className='bg-gray-200 sm:w-[20%] w-[90%] m-auto sm:fixed p-4 mt-6  sm:left-0 sm:top-24 sm:h-full  shadow-mdoverflow-auto'>
              <nav>
                <ul>
                  <li className='text-gray-400 text-[12px]'>Specialists</li>
                  <Link>
                    <li 
                      className={`pl-4 my-2 py-1 text-sm cursor-pointer ${activeSection === "my-visits" ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-500 hover:bg-[#80808011] hover:text-blue-800"}`} 
                      onClick={() => setActiveSection("my-visits")}
                    >
                      My Visits
                    </li>
                  </Link>
                  <Link>
                    <li 
                      className={`pl-4 my-2 py-1 text-sm cursor-pointer ${activeSection === "register" ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-500 hover:bg-[#80808011] hover:text-blue-800"}`} 
                      onClick={() => setActiveSection("register")}
                    >
                      Registered Specialists
                    </li>
                  </Link>
                  <hr className='bg-gray-300 h-[2px] w-full ' />
                  <li className='text-gray-400 pt-2 text-[12px]'>Communication with doctors</li>
                  <Link>
                    <li className='pl-4 my-2 py-1 text-sm text-gray-500 hover:bg-[#80808011] hover:text-blue-800' >Public Questions</li>
                  </Link>
                  <hr className='bg-gray-300 h-[2px] w-full ' />
                  <li className='text-gray-400 pt-2 text-[12px]'>Account Settings</li>
                  <Link>
                    <li 
                      className={`pl-4 my-2 py-1 text-sm cursor-pointer ${activeSection === "account-settings" ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-500 hover:bg-[#80808011] hover:text-blue-800"}`} 
                      onClick={() => setActiveSection("account-settings")}
                    >
                      Account Settings
                    </li>
                  </Link>
                  <Link>
                    <li className='pl-4 my-2 py-1 text-sm text-gray-500 hover:bg-[#80808011] hover:text-blue-800'>Notification preferences</li>
                  </Link>
                  <Link>
                    <li className='pl-4 my-2 py-1 text-sm text-gray-500 hover:bg-[#80808011] hover:text-blue-800'>Social media accounts</li>
                  </Link>
                </ul>
              </nav>
            </aside>

            {/* Main Content Area */}
            <section  className=' bg-white sm:w-[75%] p-4 sm:ml-[22%] mt-4 rounded shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                  {/* Conditionally render content based on active section */}
                  {activeSection === 'my-visits' ? (
                    <div className=' '>
                      <UpcomingAppointment />
                      <CancelAppointment />
                    </div>
                  ) : (
                    <>
                  <div className='mb-2'>
                    <h3 className='text-xl font-semibold mb-2'>Account Settings</h3>
                    <span className='text-sm'>* Required fields</span>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className='sm:flex flex-col sm:flex-row sm:items-center mt-3 mb-3 gap-3'>
                      <label htmlFor='firstName' className='sm:w-1/4 font-semibold'>Name*</label>
                      <input 
                        type='text' 
                        className=' sm:w-[50%] w-full  rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        id='firstName' 
                        name='firstName'
                        defaultValue={currentUser.firstName}
                        onChange={handleChange}  
                      />
                    </div>
                    <div className='sm:flex sm:flex-row flex-col items-center mb-3 gap-3'>
                      <label htmlFor='lastName' className='w-1/4 font-semibold'>Last name *</label>
                      <input 
                        type='text' 
                        className=' sm:w-[50%] w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        id='lastName' 
                        name='lastName' 
                        defaultValue={currentUser.lastName}
                        onChange={handleChange} 
                        
                      />
                    </div>
                    <div className='sm:flex items-center mb-3 gap-3'>
                      <label htmlFor='phoneNumber' className='w-1/4 font-semibold'>Phone</label>
                      <input 
                        type='text' 
                        className=' sm:w-[50%] w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        id='phoneNumber' 
                        name='phoneNumber'
                        defaultValue={currentUser.phoneNumber}
                        onChange={handleChange} 
                      />
                    </div>
                    <div className='sm:flex items-center mb-3 gap-3'>
                      <label htmlFor='passsword' className='w-1/4 font-semibold'>Change password</label>
                      <input 
                        type='text' 
                        className=' sm:w-[50%] w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        id='passsword' 
                        name='passsword'
                        defaultValue={currentUser.password}
                        onChange={handleChange} 

                      />
                    </div>
                    <div className='sm:flex items-center mb-3 gap-3'> 
                      <label htmlFor='email' className='w-1/4 font-semibold'>Email</label>
                      <input 
                        type='email' 
                        className=' sm:w-[50%] w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        id='email' 
                        name='email'
                        defaultValue={currentUser.email}
                        onChange={handleChange} 
                   
                      />
                    </div>
                    <hr className='bg-gray-300 h-[1px] my-6 w-full ' />
                    <div className='mt-4 sm:flex items-center justify-between'>
                      <div className='flex flex-col sm:flex-row'>
                        <button
                          disabled={loading}
                          className='bg-blue-500 text-white w-full sm:w-auto rounded py-1 px-3 mb-3' 
                          onClick={handleSubmit} 
                        >
                          {loading ? 'Loading...' : 'Save changes'}
                        </button>
                        <button 
                          type='button'
                          className='text-blue-500  sm:ml-4 mb-4'
                          onClick={handleReset}
                        >
                          Cancel
                        </button>
                      </div>
                      <div>
                        <button className='flex items-center gap-2 ' onClick={() => setShowModal(true)} type='button'>
                        <LiaTimesSolid className='text-lg text-red-500 font-extralight'/>
                          Delete my account
                        </button>
                        <Modal
                            show={showModal}
                            onClose={() => setShowModal(false)}
                            popup
                            size='md'
                            
                          >
                            <Modal.Header/>
                            <Modal.Body>
                              <div className='text-center'>
                                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                                  Your appointments will not be canceled. You will lose all other data.
                                </h3>
                                <div className='flex justify-center gap-4'>
                                  <Button color='failure' onClick={handleDeleteUser}>
                                    Delete account
                                  </Button>
                                  <Button color='gray' onClick={() => setShowModal(false)}>
                                    No, cancel
                                  </Button>
                                </div>
                              </div>
                            </Modal.Body>
                      </Modal>
                      </div>
                    </div>
                  </form>
                  </> 
              
                  )}

                  
            </section>
                
          </section>
          <div className='flex justify-center '>
            {updateUserSuccess && (
              <Alert color='success' className='mt-5'>
                {updateUserSuccess}
              </Alert>
            )}
            {updateUserError && (
              <Alert color='failure' className='mt-5'>
                {updateUserError}
              </Alert>
            )}
             {error && (
              <Alert color='failure' className='mt-5'>
                {error}
              </Alert>
            )}
          </div>
        </main>
      </div>

      
    </div>
  )
}

export default PatientAccount