import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";
import { HiMiniUsers } from "react-icons/hi2";
import { RiHospitalFill } from "react-icons/ri";
import logoDarkMode from '../assets/logoDarkMode-1.png';
import '../styles/MobileDropdownContent.css';
import { FaTimes } from "react-icons/fa"

const MobileDropdownContent = ({ onClose, onBack }) => {
  const [animationClass, setAnimationClass] = useState('slide-in');

  // Handle the closing of the dropdown
  const handleClose = () => {
    setAnimationClass('slide-out');
    setTimeout(() => {
      onClose();
    }, 300); // Duration should match the CSS animation duration
  };

  // Handle the back action
  const handleBack = () => {
    setAnimationClass('slide-out-left');
    setTimeout(() => {
      onBack();
    }, 300); // Duration should match the CSS animation duration
  };

  return (
    <div className='fixed inset-0 bg-[#00b39b] text-white w-full flex flex-col items-center z-50'>
      {/* Header Section */}
      <header className="border-b-[.5px] border-[#343a4027] w-full px-5">
        <div className="flex justify-between m-auto items-center w-full py-4">
          <img src={logoDarkMode} alt='logo' className='w-[35.5%]' />
          <button onClick={handleClose} className='text-2xl font-bold'>
            <FaTimes />
          </button>
        </div>
      </header>

      {/* Dropdown Content with Animation */}
      <div className='flex flex-col divide-y divide-[#343a4018] divide-y-reverse w-[93%]'>
        <div className='border-b-[1px] border-[#343a4018] pl-2 py-5'>
          <button onClick={handleBack} className={`flex items-center gap-4 font-bold animated-content ${animationClass}`}>
            <FaChevronLeft className="w-2" /> <span className='pl-2'>Register for free</span>
          </button>
        </div>
        <div className={`py-5 pl-2 animated-content ${animationClass}`}>
          <Link to='/signup' className='mb-4 font-bold hover:underline'>
            <div className='flex items-center gap-4'>
              <HiMiniUsers />
              <span>as a patient</span>
            </div>
          </Link>
        </div>
        <div className={`py-5 pl-2 animated-content ${animationClass}`}>
          <Link to='/signup/doctor' className='mb-4 font-bold hover:underline'>
            <div className='flex items-center gap-4'>
              <FaUserDoctor />
              <span>as a doctor</span>
            </div>
          </Link>
        </div>
        <div className={`py-5 pl-2 animated-content ${animationClass}`}>
          <Link to='/signup/facility' className='mb-4 font-bold hover:underline'>
            <div className='flex items-center gap-4'>
              <RiHospitalFill />
              <span>as a facility</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileDropdownContent;
