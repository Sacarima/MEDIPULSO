import React from 'react'
import logo from  '../assets/logowhite.png'
import { ROUTES }from '../config/routes.js'
import { Link } from 'react-router-dom'

const DoctorSignupConfirmationHeader = () => {
  return (
    <div>
        <header className='sticky top-0 z-50'>
                    <div className=' py-2'>
                        <nav className=' lg:w-[70%] mx-auto'>
                            <Link to={ROUTES.DOCTOR_PROFILE}  className='cursor-pointer mx-auto'>
                                <img src={logo} alt='logo' className='w-52 cursor-pointer' />
                            </Link>
                        </nav>
              </div>
                </header>
    </div>
  )
}

export default DoctorSignupConfirmationHeader