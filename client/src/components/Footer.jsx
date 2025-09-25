import logo from '../assets/medipulso.png'; 
import { ROUTES } from '../config/routes';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className=''>
      <div className='md:flex  xl:w-[70%] md:w-[90%] gap-4 p-4 m-auto mt-6 text-center md:text-left lg:text-left lg:justify-between lg:items-start sm:flex  sm:justify '>
        

        <aside className=' mt-4 '>
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

        <aside className=' mt-4 '>
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

        <aside className=' mt-4 px-2'>
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

        <aside className='sm:w-[25%] mt-4 flex flex-col lg:justify-left  lg:items- items- px-2 '>
          <div>
            <Link to={ROUTES.HOME}>
              <img
                className='w-24 mx-auto  mb-4 m-auto'
                src={logo}
                alt="logo"
              />
            </Link>
          </div>
          <div className='text-center'>
            <p className=''>Medipulso connects patients with trusted doctors and clinics, making it easy to find specialists, book appointments, and access healthcare services online or in person..</p>
          </div>
        </aside>
      </div>

      <hr className='w-[70%] m-auto my-6'/>
      <div className='text-center mb-2'>
        <p>© 2025 Medi-Pulso. All rights reserved.</p>
      </div>
    </div>
  )
}
