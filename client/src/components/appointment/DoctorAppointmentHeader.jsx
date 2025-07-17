import logo from '../../assets/logowhite.png'
import { FaArrowLeft } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const DoctorAppointmentHeader = ({ onBack, calculateProgressWidth }) => {
    return (
        <header className='sticky top-0 bg-white z-50'>
            <div className=' py-2'>
                <nav className='flex gap-2 items-center  justify-between relative w-full'>
                    <FaArrowLeft className='text-3xl text-[#00c3a5] ml-4 cursor-pointer absolute left-0' onClick={onBack} />
                    <Link to='/'  className='cursor-pointer mx-auto'>
                        <img src={logo} alt='logo' className='w-52 cursor-pointer' />
                    </Link>
                </nav>
            </div>
          {/* Progress bar */}
          <div className="relative h-[2px] border-b border-gray-300">
          <div
            className="absolute top-0 left-0 h-full bg-[#00c3a5] transition-width duration-300 ease-in-out"
            style={{ width: calculateProgressWidth() }}
          ></div>
        </div>
      </header>
    )
}

export default DoctorAppointmentHeader