import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import logo from '../assets/fivicon.png'
import { Link, useLocation } from 'react-router-dom'
import { FaRegCalendarAlt } from "react-icons/fa"
import { RiMessage2Fill } from "react-icons/ri"
import { HiMiniUsers } from "react-icons/hi2"
import { IoStatsChart } from "react-icons/io5"
import { FaGooglePlay } from "react-icons/fa"
import { GiNurseMale } from "react-icons/gi"
import { RiSecurePaymentLine } from "react-icons/ri"
import { FaRegQuestionCircle } from "react-icons/fa"
import { FaUser } from "react-icons/fa"
import { CgMenuLeft } from "react-icons/cg"
import { LiaTimesSolid } from "react-icons/lia"
import useMediaQuery from '../hooks/useMediaQuery'
import logoDarkMode from '../assets/fivicon.png'
import WithLogout from './WithLogout'
import { ROUTES } from '../config/routes'






const DoctorProfileHeader = ({ handleLogout}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isDropdownOpen2, setIsDropdownOpen2] = useState(false)
    const [showDoctorProfile, setShowDoctorProfile] = useState(false)
    const [showDropdownContent, setShowDropdownContent] = useState(false)
    const [isMenuToggled, setIsMenuToggled] = useState(false)
    const [isOpen, setIsOpen] = useState(false) // state for icon toggle
    const isAboveSmallScreens = useMediaQuery('(min-width: 770px)')
    const [isProfileActive, setIsProfileActive] = useState(false)
    const [isAccountActive, setIsAccountActive] = useState(false)
    const { currentDoctor} = useSelector((state) => state.doctor)
    const path = useLocation().pathname
    const accountRef = useRef(null)
    const profileRef = useRef(null)
    const dropdownRef = useRef(null)

  const toggleDropdown  = () => {
    setIsDropdownOpen(prevState => !prevState);
    setIsAccountActive(prevState => !prevState);
    setIsProfileActive(false)
  }


  const toggleDropdown2  = (e) => {
    e.stopPropagation();


    if (!isAboveSmallScreens) {
      setIsDropdownOpen2(prevState => !prevState)
      setIsProfileActive(prevState => !prevState)
    } else {
      if (!isDropdownOpen2) {
      setIsDropdownOpen2(true)
      setIsProfileActive(true)
    }
    }
  
    // Show doctor profile on mobile when clicked
    setShowDoctorProfile(true)
  }
 
  // function to handle profile click
  const handleProfileClick = () => {
    setShowDoctorProfile(true)
  }

  // Toggle menu and icon state
  const handleMenuToggle = () => {
    setIsMenuToggled(!isMenuToggled);
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsDropdownOpen2(false)
    }
}


//close menu handler 
const closeMenu = () => {
    setIsMenuToggled(false)
    setIsOpen(false)
}


    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsDropdownOpen2(false);
          setIsProfileActive(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);


    



  return (
    <div>
        {/* DESKTOP NAVIGATION */}
        {isAboveSmallScreens ? (
        <header className='bg-white sm:h-screen sm:w-[4.5rem] sm:flex sm:sticky sm:top-0 flex-row sm:flex-col justify-between z-50 items-center border-r-[1px] pb-5'>
        <div className='flex flex-col justify-between items-center'>
          
        <div className='group relative flex items-center'>
             <Link to='/doctor-profile' className='flex items-center '>
               <img className='w-8 cursor-pointer my-4 ' src={logo} alt="logo" />
               <div className=''>
                 <span className="absolute mt-[-14px] ml-3  left-[56px] bg-black text-white text-sm z-50 whitespace-nowrap py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Homepage
                  </span>
                  <span className="absolute ml-3  left-10 z-50 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
               </div>
             </Link>
           </div>
          <div className='text-gray-400 text-2xl'>
            {/* Icon with tooltip */}
            <div className="group relative flex items-center">
              <Link to={ROUTES.DOCTOR_CALENDAR}>
                <FaRegCalendarAlt className='my-4 cursor-pointer' />
             
                <span className="absolute left-16 bg-black text-white z-50 text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Calendar
                </span>
               </Link>
              <span className="absolute left-12 z-50 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
            </div>

            <div className="group relative flex items-center">
              <RiMessage2Fill className='my-4 cursor-pointer'/>
              <span className="absolute left-16 bg-black text-white text-sm z-50 py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                News
              </span>
              <span className="absolute left-12 top-1/2 z-50 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
            </div>

            <div className="group relative flex items-center">
              <HiMiniUsers className='my-4 cursor-pointer text-gray-400'/>
              <span className="absolute left-16 bg-black text-white z-50 text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Patients
              </span>
              <span className="absolute left-12 z-50 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
            </div>

            <div className="group relative flex items-center">
              <IoStatsChart className='my-4 cursor-pointer '/>
              <span className="absolute left-16 bg-black text-white  z-50 whitespace-nowrap text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Statatistics
              </span>
              <span className="absolute left-12 z-50 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
            </div>

            <div className="group relative flex items-center">
              <FaGooglePlay className='my-4 cursor-pointer'/>
              <span className="absolute left-16 bg-black text-white z-50 whitespace-nowrap text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Campaings
              </span>
              <span className="absolute left-12 z-50 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
            </div>
          </div>

          <hr className='my-4 w-1/2 px-6'/>
          
          <div className='text-2xl'>
            <div  className=" relative flex items-center">
              <div className="group flex items-center">
                <Link to='/doctor-profile-info'>
                  <GiNurseMale className=' my-4 cursor-pointer text-gray-400'/>
                </Link>
                <div className="left-0 relative">
                  <span className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-black text-white z-50 text-sm whitespace-nowrap py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    My profile
                  </span>
                  {/* Triangle (arrow) aligned to the middle of the text */}
                  <span className="absolute left-6 top-1/2 z-50 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
                </div>
              </div>
              {isDropdownOpen2 && (
                <div
                  className={`fixed left-[71.6px] top-0 h-screen text-[1rem] w-64 bg-white shadow-lg transition-all   duration-300 transform ${
                  isDropdownOpen2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
                >
                  <ul className="py-4">
                    {/* Profile Section */}
                    <li className="px-4 py-2 hover:bg-gray-100">
                      Profile
                      {/* Submenu */}
                      <ul className="ml-4 py-2">
                        <Link to={ROUTES.DOCTOR_PROFILE}>
                          <li className="px-4 cursor-pointer py-1 hover:bg-gray-200">Edit Profile</li>
                        </Link>
                        <li className="px-4 cursor-pointer py-1 hover:bg-gray-200 whitespace-nowrap">Public profile</li>
                        <li className="px-4 cursor-pointer py-1 hover:bg-gray-200">Addresses</li>
                      </ul>
                    </li>
                    {/* Additional Items */}
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Appointment channels</li>
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Profile statistics</li>
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Promotions</li>
                    <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Certificates</li>
                  </ul>

                  <div className='bg-[#00b39be6] p-2 rounded  mx-4'>
                    <button className='w-full sm:text-sm cursor-pointer bg-white text-[#00b39be6] py-2 rounded font-medium'>Discover Medi Pulso Pro</button>
                  </div>
                </div>
              )}
            </div>

            <div className="group relative flex items-center">
              <RiSecurePaymentLine className='cursor-pointer text-gray-400'/>
              <span className="absolute left-16 z-50 bg-black text-white whitespace-nowrap text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                Choose your plan
              </span>
              <span className="absolute left-12 z-50 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
            </div>
          </div>
        </div>
        
        <div className='text-2xl'>
          <div className="group relative flex items-center">
            <FaRegQuestionCircle className='my-4 cursor-pointer text-gray-400'/>
            <span className="absolute left-16 bg-black text-white text-sm py-1 px-2 z-50 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Help
            </span>
            <span className="absolute left-12 z-50 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
          
          </div>

          <div ref={accountRef} className="relative flex items-center">
            <div className='group flex items-center'>
              <FaUser className='my-4 cursor-pointer text-gray-400' onClick={toggleDropdown}/>
              <div className="left-0 relative">
                  <span className="absolute left-10 top-1/2 transform -translate-y-1/2 bg-black text-white z-50 text-sm whitespace-nowrap py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    My account
                  </span>
                  {/* Triangle (arrow) aligned to the middle of the text */}
                  <span className="absolute left-6 top-1/2 z-50 transform -translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
                </div>
            </div>
            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute left-[49px] bottom-0 mt-2 bg-white border rounded z-[2147483647]  shadow-lg w-[20rem] ">
                <ul className="py-1 text-[1rem]">
                <li className='px-4 bg-[#f7f9fa] flex justify-between gap-4 items-center py-2'><FaUser className='text-gray-400'/><span className=' ml-12 font-medium grow'><span className='font-medium'>{currentDoctor ? currentDoctor.firstName : "Loading..."}</span> <span className='font-medium'>{currentDoctor ? currentDoctor.lastName : "Loading..."}</span></span></li>
                  <li className="px-4 cursor-pointer py-2 hover:bg-gray-100">My account</li>
                  <li className="px-4 cursor-pointer py-2 hover:bg-gray-100">My visits to doctors</li>
                  <li className="px-4 cursor-pointer py-2 hover:bg-gray-100">Job offers for doctors</li>
                  <li onClick={handleLogout} className="px-4 cursor-pointer py-2 hover:bg-gray-100">Log out</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>
        ) : ( 
            <div className='flex justify-between w-full p-2'>           
                  <button
                      className='p-2  rounded-md cursor-pointer text-gray-400 '
                      onClick={handleMenuToggle}
                      id='hamburger-button'
                  >
                      {isOpen ? (
                          <LiaTimesSolid className='text-3xl font-extralight animate-menuClose'/>
                              ) : (
                          <CgMenuLeft className='text-3xl animateMenuOpen' />
                  
                        )}
                  
                  </button>
            </div>
        )}

        {/* MOBILE NAVIGATION POPUP  */}
        {!isAboveSmallScreens && isMenuToggled && (
          <div className='fixed top-0 left-0 w-full h-screen z-[99999] bg-white overflow-y-auto border-4xs'>

          <div className=' z-50'>
          <div className='pb-1'>
              <div className='flex justify-between items-center px-4'>
                <img src={logoDarkMode} alt="logo" className="w-8" />
                <button
                  className='p-2 rounded-md cursor-pointer text-gray-400 '
                  onClick={handleMenuToggle}
                  id='hamburger-button'
                >
                  <LiaTimesSolid className='text-3xl font-extralight animate-menuClose' onClose={closeMenu}/>
                </button>
              </div>
            </div>
    
            <div className='text-gray-400 text-2xl p-4 '>
              {/* Icon with tooltip */}
              <div className="flex items-center gap-3">
                <FaRegCalendarAlt className='my-4 cursor-pointer' />
                <Link to={ROUTES.DOCTOR_CALENDAR} className='flex items-center gap-1'>
                  <span  className="text-gray-400 text-[1.1rem] ">
                    Calendar
                  </span>
                </Link>
                
              </div>
  
              <div className="flex items-center gap-3">
                <RiMessage2Fill className='my-4 cursor-pointer'/>
                <span className="text-gray-400 text-[1.1rem] ">
                  News
                </span>
              </div>
  
              <div className=" flex items-center gap-3">
                <HiMiniUsers className='my-4 cursor-pointer text-gray-400'/>
                <span className="text-gray-400 text-[1.1rem] ">
                  Patients
                </span>
              </div>
  
              <div className="flex items-center gap-3 z-[10000]">
                <IoStatsChart className='my-4 cursor-pointer '/>
                <span className="text-gray-400 text-[1.1rem] ">
                  Statatistics
                </span>
              </div>
  
              <div className="flex items-center gap-3">
                <FaGooglePlay className='my-4 cursor-pointer'/>
                <span className="text-gray-400 text-[1.1rem] ">
                  Campaings
                </span>
              </div>
            </div>

            
            
            <div>
              <div  ref={dropdownRef}  className={`text-2xl mb-3  px-4 ${isProfileActive? 'bg-gray-100' : ''}`}>
                <div className='flex items-center gap-3' onClick={(e) => toggleDropdown2(e)}>
                  <GiNurseMale className='my- cursor-pointer text-gray-400' />
                  <span className="text-gray-400 text-[1.1rem] ">
                    My profile
                  </span>
                </div>
                {isDropdownOpen2 && (
                  <div
                   
                    className={` text-[1rem] w-full transition-all   duration-300 transform ${
                    isDropdownOpen2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                  }`}
                  >
                    <ul className="ml-10 py-4">
                      {/* Profile Section */}
                      <li className="px-4 py-2">
                        Profile
                        {/* Submenu */}
                        <ul className=" py-2">
                          
                            <li className="px-4 cursor-pointer py-1 hover:bg-gray-200">
                              <Link to={ROUTES.DOCTOR_PROFILE_INFO} onClick={(e) => e.stopPropagation()}>
                                Edit Profile
                              </Link>
                            </li>
                  
                          <li className="px-4 cursor-pointer py-1 hover:bg-gray-200 whitespace-nowrap">Public profile</li>
                          <li className="px-4 cursor-pointer py-1 hover:bg-gray-200">Addresses</li>
                        </ul>
                      </li>
                      {/* Additional Items */}
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Appointment channels</li>
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Profile statistics</li>
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Promotions</li>
                      <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">Certificates</li>
                    </ul>
  
                    <div className='bg-[#00b39be6] p-2 rounded  mx-4'>
                      <button className='w-full cursor-pointer bg-white text-[#00b39be6] py-2 rounded font-medium'>Discover Medi Pulso Pro</button>
                    </div>
                  </div>
                )}
              </div>
  
              <div className="flex items-center gap-3 text-2xl  px-4">
                <RiSecurePaymentLine className='cursor-pointer my-4 text-gray-400'/>
                <span className="text-gray-400 text-[1.1rem] ">
                  Chooose your plan
                </span>
              </div>
            </div>
          </div>

          <hr className='my-4 w-full '/>
          
          <div className='text-2xl mt'>
            <div 
              className={`flex items-center gap-3 p-4 `}>
              <FaRegQuestionCircle className=' cursor-pointer text-gray-400'/>
              <span className="text-gray-400 text-[1.1rem] ">
                  Help
                </span>
            </div>
  
            <div ref={profileRef} className={`${isAccountActive ? 'bg-gray-100' : ''}`}>
              <div className='flex items-center gap-3 p-4'>
                <FaUser className=' cursor-pointer text-gray-400' onClick={toggleDropdown}/>
                <span className="text-gray-400 text-[1.1rem]" onClick={toggleDropdown}>
                   Profile
                </span >
              </div>
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className=" ml-6     rounded  ">
                  <ul className="ml-10 text-[1rem] ">
                    <li className="px-4 cursor-pointer py-2">My account</li>
                    <li className="px-4 cursor-pointer py-2">My visits to doctors</li>
                    <li className="px-4 cursor-pointer py-2 ">Job offers for doctors</li>
                    <li className="px-4 cursor-pointer py-2 ">Log out</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
          </div>
        )}

          
          
    </div>
  )
}

export default WithLogout(DoctorProfileHeader)