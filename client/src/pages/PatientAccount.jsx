import { 
  useRef, 
  useState, 
  useEffect

} from 'react'

import { FaTimes } from "react-icons/fa"

import { 
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure, 
  deleteUserStart, 
  deleteUserFailure, 
  deleteUserSuccess, 
  logoutUserStart 

} from '../redux/user/userSlice'

import { 
  useDispatch, 
  useSelector 
} from 'react-redux'

import { Link } from 'react-router-dom'
import AccountHeaderPatient from '../components/AccountHeaderPatient'
import DeleteConfirmation from '../components/DeleteConfirmation'


function PatientAccount() {
  const { currentUser, loading, error } = useSelector(state => state.user)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const disptach = useDispatch()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

   // submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    disptach(updateUserStart())
    try {
      const response = await fetch(`http://localhost:7500/api/users/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (data.success === false) {
        disptach(updateUserFailure(data.message))
      }
    } catch (error) {
      disptach(updateUserFailure(error.message))
    }
  }

  // delete user
  const handleDeleteUser = async () => {
    try {
      disptach(deleteUserStart())
      const response = await fetch(`http://localhost:7500/api/users/${currentUser._id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data.success === false) {
        disptach(deleteUserFailure(data.message))
        return
      }
      disptach(deleteUserSuccess(data))
    } catch (error) {
      disptach(deleteUserFailure(error.message))
    }
  }

  // logout user
  const handleLogout = async() => {
   try {
    disptach(logoutUserStart())
    const response = await fetch('http://localhost:7500/api/auth/logout')
    const data = await response.json()
    if (data.success === false) {
      disptach(logoutUserFailure(data.message))
      return
    }
    disptach(logoutUserSuccess(data))
   } catch (error) {
    disptach(logoutUserFailure(error.message))
   }
  }

  return (
    <div className='bg-gray-200'>
      <AccountHeaderPatient />
      <div className='bg-gray-200 h-screen'>
        <main className=' sm:w-[80%]  m-auto  mt-8'>
        
          <section className=' sm:flex'>
            <aside className=' sm:w-[20%] w-[90%] m-auto'>
              <ul>
                <li className='text-gray-400 text-[12px]'>Specialists</li>
                <Link>
                  <li className='pl-4 my-2 py-1 text-sm text-gray-500 hover:bg-[#80808011] hover:text-blue-800'>My Visits</li>
                </Link>
                <Link>
                  <li className='pl-4 my-2 py-1 text-sm text-gray-500 hover:bg-[#80808011] hover:text-blue-800'>Registered Specialists</li>
                </Link>
                <hr className='bg-gray-300 h-[2px] w-full ' />
                <li className='text-gray-400 pt-2 text-[12px]'>Communication with doctors</li>
                <Link>
                  <li className='pl-4 my-2 py-1 text-sm text-gray-500 hover:bg-[#80808011] hover:text-blue-800' >Public Questions</li>
                </Link>
                <hr className='bg-gray-300 h-[2px] w-full ' />
                <li className='text-gray-400 pt-2 text-[12px]'>Account Settings</li>
                <Link>
                  <li className='pl-4 my-2 py-1 text-sm text-gray-500 hover:bg-[#80808011] hover:text-blue-800'>Account Settings</li>
                </Link>
                <Link>
                  <li className='pl-4 my-2 py-1 text-sm text-gray-500 hover:bg-[#80808011] hover:text-blue-800'>Notification preferences</li>
                </Link>
                <Link>
                  <li className='pl-4 my-2 py-1 text-sm text-gray-500 hover:bg-[#80808011] hover:text-blue-800'>Social media accounts</li>
                </Link>
              </ul>
            </aside>

            <section className='bg-white sm:w-[80%] p-4 sm:ml-5 m-auto w-[95%] mt-4 rounded shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                  <div className='mb-2'>
                    <h3 className='text-xl font-semibold mb-2'>Account Settings</h3>
                    <span className='text-sm'>* Required fields</span>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className='sm:flex flex-col sm:flex-row sm:items-center mt-3 mb-3 gap-3'>
                      <label htmlFor='name' className='sm:w-1/4 font-semibold'>Name*</label>
                      <input 
                        type='text' 
                        className=' sm:w-[50%] w-full  rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        id='name' 
                        name='name'
                        defaultValue={currentUser.name}
                        value={formData.name} 
                        onChange={handleChange}  
                      />
                    </div>
                    <div className='sm:flex sm:flex-row flex-col items-center mb-3 gap-3'>
                      <label htmlFor='name' className='w-1/4 font-semibold'>Last name *</label>
                      <input 
                        type='text' 
                        //className='w-full placeholder-gray-300 rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        className=' sm:w-[50%] w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        id='lastName' 
                        name='lastName' 
                        defaultValue={currentUser.lastName}
                        value={formData.lastName} 
                        onChange={handleChange} 
                        
                      />
                    </div>
                    <div className='sm:flex items-center mb-3 gap-3'>
                      <label htmlFor='phone' className='w-1/4 font-semibold'>Phone</label>
                      <input 
                        type='text' 
                        //className='w-full placeholder-gray-300 rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        className=' sm:w-[50%] w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        id='phone' 
                        name='phone' 
                        value={formData.phone} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className='sm:flex items-center mb-3 gap-3'>
                      <label htmlFor='changePassword' className='w-1/4 font-semibold'>Change password</label>
                      <input 
                        type='text' 
                        className=' sm:w-[50%] w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        
                        //className='w-full placeholder-gray-300 rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        id='changePassword' 
                        name='changePassword'
                        defaultValue={currentUser.changePassword}
                        value={formData.changePassword} 
                        onChange={handleChange} 

                      />
                    </div>
                    <div className='sm:flex items-center mb-3 gap-3'> 
                      <label htmlFor='email' className='w-1/4 font-semibold'>Email</label>
                      <input 
                        type='email' 
                        className=' sm:w-[50%] w-full rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        
                        
                        //className='w-full placeholder-gray-300 rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                        id='email' 
                        name='email'
                        defaultValue={currentUser.email}
                        value={formData.email} 
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
                          className='text-blue-500  sm:ml-4 mb-4'
                          onClick={() => DeleteConfirmation() && handleDeleteUser()}
                        >
                          Cancel
                        </button>
                      </div>
                      <div>
                        <button className='flex items-center gap-2'>
                          <FaTimes className='text-red-500' onClick={handleDeleteUser} />
                          Delete my account
                        </button>
                      </div>
                    </div>
                  </form>
            </section>
          </section>
          
        </main>
      </div>
    </div>
  )
}

export default PatientAccount