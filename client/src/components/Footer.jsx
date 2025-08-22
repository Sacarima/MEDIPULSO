import React from 'react'
import logo from '../assets/medipulso.png'; // Replace with your logo path

export default function Footer() {
  return (
    <div className=''>
      <div className='sm:flex 2xl:w-[70%] md:w-[90%] p-4 m-auto mt-6'>
        

        <aside className='sm:w-[25%] mt-4 sm:text-start text-center'>
          <h2 className='mb-3 text-gray-500'>Service</h2>
          <ul>
            <li>Privacy and Cookie Policy</li>
            <li>Privacy on Healthcare</li>
            <li>Professionals</li>
            <li>About us</li>
            <li>Contact</li>
            <li>Work</li>
            <li>Statute</li>
            <li>Partners</li>
            <li>Press Center</li>
            <li>How Search Result Work</li>
          </ul>
        </aside>

        <aside className='sm:w-[25%] mt-4 sm:text-start text-center'>
          <h2 className='text-gray-500 mb-3'>For Patients</h2>
          <ul>
            <li>How to find a doctor</li>
            <li>Medical facilities</li>
            <li>Questions and answers</li>
            <li>Services and treatments</li>
            <li>Diseases</li>
            <li>Help</li>
            <li>Mobile applications</li>
            <li>Blog for patients</li>
          </ul>
        </aside>

        <aside className='sm:w-[25%] sm:text-start text-center mt-4 px-2'>
          <h2 className='text-gray-500 mb-3'>For professionals</h2>
          <ul>
            <li>Price-list</li>
            <li>For doctors</li>
            <li>Knowledge base</li>
            <li>For medical facilities</li>
            <li>Specialist Help Center</li>
            <li>Online consultations</li>
          </ul>
        </aside>

        <aside className='sm:w-[25%] mt-4 flex flex-col justify-start items-start sm:items-start px-2'>
          <div>
            <img
              className='w-24 mx-auto  mb-4 m-auto'
              src={logo}
              alt="logo"
            />
          </div>
          <p className='t sm:text-start'>Medipulso connects patients with trusted doctors and clinics, making it easy to find specialists, book appointments, and access healthcare services online or in person..</p>
        </aside>
      </div>

      <hr className='w-[70%] m-auto my-6'/>
      <div className='text-center '>
        <p>© 2025 Medi-Pulso. All rights reserved.</p>
      </div>
    </div>
  )
}
