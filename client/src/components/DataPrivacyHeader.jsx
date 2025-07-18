import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/fivicon.png'
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md'

function DataPrivacyHeader() {
  return (
    <div>
        <header className='lg:w-[70%] w-full m-auto flex justify-between items-center px-2 p-2 pt-4'>
        <Link to='/'>
            <div className='flex items-center border-[1px] rounded px-2 cursor-pointer '>
                    <MdOutlineKeyboardArrowLeft className='text-2xl text-gray-500'/>
                <span className='pr-1'>Back</span>
            </div>
        </Link>
            <div className='m-aut'>
                <img src={logo} alt="logo" className="w-8" />
            </div>
        </header>
    </div>
  )
}

export default DataPrivacyHeader