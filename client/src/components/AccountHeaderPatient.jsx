import { useState} from 'react'
import { Link } from 'react-router-dom'
import { FaTimes } from "react-icons/fa";
import logo from '../assets/fivicon.png'
import logoDarkMode from '../assets/logoDarkMode-1.png'
import { useSelector } from 'react-redux'

function AccountHeaderPatient() {
   const { theme } = useSelector(state => state.theme);
   const { currentUser, loading, error } = useSelector(state => state.user)
  return (
    <div className='border-b-[1px] border-gray-300'>
        <header className="flex justify-between sm:items-center sm:px-0 px-4 py-8 sm:w-[80%] sm:m-auto">
          <div className='sm:flex gap sm:items-center'>
            <div className='border-r-[1px] border-gray-300 pr-4'>
                <img 
                    src={theme === 'dark' ? logoDarkMode : logo} 
                    alt="logo" 
                    className="w-14" 
                />
            </div>
            <div className='sm:pl-4 mt-4'>
                <span className='text-3xl font-bold'>Account</span>
                <div className='flex gap-1 mt-3 '>
                    <span className='text-sm text-[#666666e4] font-semibold'>Login:</span>
                    <span className='text-sm text-[#666666e3] font-semibold'>{currentUser.email}</span>
                </div>
            </div>
          </div>
          <Link to='/'>
            <button
              type='button'
                className='flex justify-center shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center py-3 px-4 rounded-sm bg-[#fff] text-[#000] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#000] focus:ring-[#000] hover:bg-[#000] hover:text-white hover:shadow-lg transition duration-300 ease-in-out'
            >
                <Link to='/' className='flex items-center gap-1'>
                    <FaTimes className='text-lg font-extralight'/>
                    Close
                </Link>
            </button>
          </Link>
        </header>
    </div>
  )
}

export default AccountHeaderPatient