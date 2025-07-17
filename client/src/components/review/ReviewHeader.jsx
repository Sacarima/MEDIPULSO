import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import logo from '../../assets/logowhite.png';

const ReviewHeader = ({ step, totalSteps, onBack, calculateProgressWidth }) => {
  return (
    <header className="sticky top-0 bg-white z-50">
      <div className="w-[70%] m-auto flex py-2">
        <nav className="flex w-full gap-2 items-center justify-between">
          <FaArrowLeft
            className="text-3xl text-[#00c3a5] cursor-pointer"
            onClick={onBack}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-52 cursor-pointer" />
          </Link>
          <span className="text-[#00c3a5] font-semibold">
            {step}/{totalSteps}
          </span>
        </nav>
      </div>
            {/* Progress bar */}
            <div className="relative h-[5px] border-b border-gray-300">
        <div
          className="absolute top-0 left-0 h-full bg-[#00c3a5] transition-width duration-300 ease-in-out"
          style={{ width: calculateProgressWidth() }}
        ></div>
      </div>
  
    </header>
  );
};

export default ReviewHeader;