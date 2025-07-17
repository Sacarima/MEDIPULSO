import React from 'react'
import { Link } from 'react-router-dom'

const AppointmentFooter = () => {
  return (
    <div className='text-center text-sm mt-4'>
        <span className='flex justify-center gap-1 mb-2'>This site is protected by reCAPTCHA. The Google <Link to='/data-privacy'><span className='text-blue-500'>Privacy Policy</span></Link> and <span className='text-blue-500'>Terms of Service apply.</span></span>
        <p className='text-gray-400'>Medi-Pulse © 2025 - Find a doctor and make an appointment</p>

       
    </div>
  )
}

export default AppointmentFooter