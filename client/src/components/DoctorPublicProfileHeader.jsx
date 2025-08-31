import { useState, useEffect, useRef, useMemo } from 'react'
import { Navbar, Button, Dropdown } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { IoSearchOutline } from "react-icons/io5"
import { CiSearch } from "react-icons/ci";
import { MdKeyboardArrowDown } from "react-icons/md"
import logo from '../assets/lggo.png'
import logoDarkMode from '../assets/logoDarkMode-1.png'
import useMediaQuery from '../hooks/useMediaQuery'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { toogleTheme } from '../redux/theme/themeSlice'
import MobileDropdownContent from './MobileDropdownContent'
import { FaAngleRight, FaAlignRight, FaTimes } from "react-icons/fa"
import MedicalSpecialtyDropdownForHeader from './MedicalSpecialtyDropdownForHeader'
import { medicalSpecialtyCategory } from '../data/medicalSpecialtyCategory'
import { location } from '../data/location'
import LocationDropdownForHeader from './LocationDropdownForHeader'
import LocationSearchFree from './LocationSearchFree'
import mobileLogo from '../assets/fivicon.png'
import WithLogout from './WithLogout'
import { ROUTES } from '../config/routes'

const DoctorPublicProfileHeader = ({ handleLogout, setShowSpecialtyFilter }) => {
    const path = useLocation().pathname
    const [formData, setFormData] = useState({})
    const [isMenuToggled, setIsMenuToggled] = useState(false)
    const [showDropdownContent, setShowDropdownContent] = useState(false)
    const { currentUser } = useSelector(state => state.user)
    const dropdownRef = useRef(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dispatch = useDispatch()
    const isAboveSmallScreens = useMediaQuery('(min-width: 768px)')
    const { theme } = useSelector(state => state.theme)
    const navigate = useNavigate()
    const [searchFormOpen, setSearchFormOpen] = useState(false)

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

    const [isOpen, setIsOpen] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }


    // Use useMemo to optimize performance when rending dropdown options
    const memoizedMedicalSpecialtyCategory = useMemo(() => medicalSpecialtyCategory, [])
    const memoizedLocation = useMemo(() => location, [])

    // Handle medical specialty category selection
    const handleMedicalSpecialtyCategorySelect = (selectedSpecialtyCategory) => {
        setFormData((prev) => ({ 
            ...prev,
            medicalSpecialtyCategory: 
            selectedSpecialtyCategory 
        }))
    }

    // Handle location selection
    const handleLocationSelect = (selectedLocation) => {
        setFormData((prev) => ({
            ...prev,
            location: selectedLocation
        }))
    }


    // Close menu handler
    const closeMenu = () => {
        setIsMenuToggled(false)
        setShowDropdownContent(false)
    }

    // Toggle menu and icon state
    const handleMenuToggle = () => {
        setIsMenuToggled(!isMenuToggled)
        setIsOpen(!isOpen)
    }

    const truncateEmail = (email, maxLength = 15) => {
        if (!email) return '' 
        if (email.length <= maxLength) return email
    
        const [name, domain] = email.split('@')
        const truncatedName = name.length > maxLength ? name.slice(0, maxLength - domain.length - 3) : name
        
        return `${truncatedName}...@${domain}`
    }

    // function to toggle the dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    // Close the dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false)
        }
    }

    // Add event listener for clicks outside the dropdown
    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isDropdownOpen])

    const handleSearch = async () => {
        if (!formData.medicalSpecialtyCategory && !formData.location) {
          console.log(" Please select at least a specialty or location.");
          return;
        }
      
        try {
          const queryParams = new URLSearchParams();
      
          if (formData.medicalSpecialtyCategory) {
            queryParams.append("specialty", formData.medicalSpecialtyCategory);
          }
      
          if (formData.location) {
            queryParams.append("location", formData.location);
          }
      
          const requestUrl = `${API_BASE_URL}/api/doctor-form/search?${queryParams.toString()}`;
         
      
          const response = await fetch(requestUrl);
          const data = await response.json();
      
          if (response.ok && data.doctors?.length > 0) {
            navigate("/search-results", {
              state: {
                specialty: formData.medicalSpecialtyCategory || "",
                locationQuery: formData.location || "",
                results: data.doctors,
                timestamp: Date.now()
              },
              
            });

            setShowSpecialtyFilter(true)
          } else {
            console.warn(" No results found.");
            navigate("/search-results", {
              state: {
                specialty: formData.medicalSpecialtyCategory || "",
                locationQuery: formData.location || "",
                results: [],
              },
            });
          }
           setSearchFormOpen(false)
        } catch (error) {
          console.error("Search failed:", error.message);
        }
      };

      const handleSearchFormToggle = () => {
        setSearchFormOpen(!searchFormOpen);
      };


      return (
        <div className="bg-[#00c3a5]">
          <nav className="lg:w-[70%] w-full px-2 m-auto lg:py-3 py-2 bg-[#00c3a5]">
    
    {/* ======= HEADER ROW (logo + desktop nav OR hamburger) ======= */}
    <div className="flex items-center justify-between">
      
      {/* Logo */}
        <Link to={ROUTES.HOME} className=''>                  
            <img
                src={isAboveSmallScreens ? logo : mobileLogo}
                alt="logo"
                className={`${
                isAboveSmallScreens
                    ? "w-[12.2rem] brightness-110"  
                    : "w-[2.2rem] opacity-80"         
            }`}
            />                  
        </Link>

      {isAboveSmallScreens ? (
        // ================= DESKTOP VIEW =================
        <>
          {/* Desktop Search Form */}
          <div className=''>
            <form className="w-full ">
              <div className="flex  justify-center items-center bg-[#158a783] gap-[1.5px]">
                <div className="bg-[#158a7838] text-white">
                  <MedicalSpecialtyDropdownForHeader
                    options={memoizedMedicalSpecialtyCategory}
                    selected={formData.medicalSpecialtyCategory}
                    onSelect={handleMedicalSpecialtyCategorySelect}
                    isInvalid={false}
                    handleChange={handleChange}
                  />
                </div>
                <div className="bg-[#158a7838] ">
                  <LocationDropdownForHeader
                    options={memoizedLocation}
                    selected={formData.location}
                    onSelect={handleLocationSelect}
                    isInvalid={false}
                    handleChange={handleChange}
                  />
                </div>
                <div className="bg-[#158a7838] py-[10px] px-4">
                  <button onClick={handleSearch} type="button">
                    <CiSearch className="text-white font-bold" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Desktop Auth Section */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <span
                  className="text-white cursor-pointer flex items-center"
                  onClick={toggleDropdown}
                >
                  {currentUser.email
                    ? truncateEmail(currentUser.email)
                    : "No email found"}
                  <MdKeyboardArrowDown className="text-2xl" />
                </span>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-5 w-48 bg-white border rounded-md shadow-lg z-50">
                    <ul className="py-1">
                      <li>
                        <Link
                          to="/patient-profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Account
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/patient-profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/notifications"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Notifications
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login">
                <Button outline gradientDuoTone="greenToBlue" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </>
      ) : (

        // ================= MOBILE VIEW =================
        <div className="flex grow">
          <div className='flex w-full  items-center justify-between'>
            <div className=' bg-[#00b39b] grow flex items-center mx-4 cursor-pointer' onClick={handleSearchFormToggle}>
                <input type="text" placeholder='What are you looking for?' className='border-none bg-transparent placeholder:text-slate-200 placeholder:text-sm grow w-full' />
                <CiSearch className='text-white mr-1' />
            </div>     
          </div>

          <button
            className="p-2 rounded-md text-white cursor-pointer"
            onClick={handleMenuToggle}
            id="hamburger-button"
          >
            {isOpen ? (
              <FaTimes className="text-2xl animate-menuClose text-white" />
            ) : (
              <FaAlignRight className="text-2xl animate-menuOpen text-white" />
            )}
          </button>
        </div>
      )}
    </div>
    
   {/* ======= FULLSCREEN MOBILE MENU ======= */}
  {!isAboveSmallScreens && isMenuToggled && (
    <div className="fixed inset-0 z-50 text-gray-800 h-screen w-screen overflow-y-auto bg-[#00b39b]">
      {/* Header (logo + close button) */}
      <div className="flex justify-between items-center px-4 py-3 ">
        <Link to={ROUTES.HOME}>
          <img src={mobileLogo} alt="logo" className="w-8 opacity-80" />
        </Link>
        <button onClick={handleMenuToggle}>
          <FaTimes className="text-2xl text-white" />
        </button>
      </div>

      <Link to={ROUTES.LOGIN}>
        <span 
          className="block w-full text-left px-4 py-4 text-sm text-white hover:bg-white/10 border-b-[.5px] border-white/30"
        >
          Login
        </span>
      </Link>

         {/* Menu content */}
        {currentUser && (

        <ul className="mt-6 text-white">
          <li className='border-b-[.5px] border-white/30'>
            <Link
              to="/patient-profile"
              className="block px-6 py-3 text-lg hover:bg-[rgba(255,255,255,0.1)]"
            >
              My Account
            </Link>
          </li>
          <li className='border-b-[.5px] border-white/30'>
            <Link
              to="/settings"
              className="block px-6 py-3 text-lg hover:bg-[rgba(255,255,255,0.1)]"
            >
              Settings
            </Link>
          </li>
          <li className='border-b-[.5px] border-white/30'>
            <Link
              to="/notifications"
              className="block px-6 py-3 text-lg hover:bg-[rgba(255,255,255,0.1)]"
            >
              Notifications
            </Link>
          </li>

          
            <li className='border-b-[.5px] border-white/30'>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-6 py-3 text-lg hover:bg-[rgba(255,255,255,0.1)]"
              >
              Logout
            </button>
          </li>
       
      </ul>
       )}
    </div>
  )}




{/* Search Form */}
{!isAboveSmallScreens && searchFormOpen && (
    <div className="fixed inset-0 z-50 text-gray-800 h-screen w-screen overflow-y-auto bg-[#00b39b]">
      <div className="p-4 space-y-4">
        <button onClick={handleSearchFormToggle} >
          <FaTimes className="text-2xl text-white mr-auto" />
        </button>
        <div className='bg-white rounded text-black '>
            <MedicalSpecialtyDropdownForHeader
                options={memoizedMedicalSpecialtyCategory}
                selected={formData.medicalSpecialtyCategory}
                onSelect={handleMedicalSpecialtyCategorySelect}
                className='text-gray-500'
            />
        </div>
        <div className='bg-[#02a993] rounded'>
            <LocationSearchFree
                options={memoizedLocation}
                selected={formData.location}
                onSelect={handleLocationSelect}
                className='text-gray-500 bg-[#02a993]'
            />
        </div>
        <button
            type="button"
            onClick={handleSearch} 
            className="w-full bg-white text-[#00b39b] font-medium rounded-lg px-4 py-2"
        >
            Search
        </button>
        </div> 
    </div>


)}
  </nav>
</div>

   )

}


export default WithLogout(DoctorPublicProfileHeader)
  {/* Navigation Logo section */}
                {/* <div className='flex grow lg:shrink-0 gap-4 items-center py-1  justify-between'>
                    {/* Logo */}
                    {/* <div className=' flex w-full items-center justify-between'>
                        <Link to="/" className='flex items-center justify-between'>
                            
                                <img
                                    src={isAboveSmallScreens ? logo : mobileLogo}
                                    alt="logo"
                                    className={`${
                                    isAboveSmallScreens
                                        ? "w-[12.2rem] brightness-110"  
                                        : "w-[2.2rem] opacity-80"         
                                }`}
                                />
                            
                          
                        </Link> */} 
                        
                        {/* No issues here, all clear */}
                        {/* 
                          <div className='flex w-full flex-1  items-center justify-between'>
                            <div className=' bg-[#00b39b] grow flex items-center mx-4 cursor-pointer' onClick={handleMenuToggle}>
                                <input type="text" placeholder='What are you looking for?' className='border-none bg-transparent placeholder:text-slate-200 placeholder:text-sm grow w-full' />
                                <CiSearch className='text-white mr-1' />
                            </div>
                            
                        </div>

                        <div className='lg:hidden block'>
                            <button
                                className='p-2  rounded-md text-white cursor-pointer'
                                onClick={handleMenuToggle}
                                id='hamburger-button'
                            >
                                {isOpen ? (
                                    <FaTimes className='text-2xl animate-menuClose text-white' />
                                ) : (
                                    <FaAlignRight className='text-2xl animate-menuOpen' />
                                )}
                            </button>
                        </div>
                    
                    </div> */}

                    {/* Search Form */}
                    {/* {/* {isAboveSmallScreens && 
                        <form className=' lg:block w-full justify-between sm:flex-row items-center lg:flex-row '>
                        <div className='flex flex-shri justify-center items-center bg-[#158a783 gap-[1.5px]' >
                            <div className=' basis-[35%] bg-[#158a7838]'>
                                <MedicalSpecialtyDropdownForHeader
                                    options={memoizedMedicalSpecialtyCategory}
                                    selected={formData.medicalSpecialtyCategory}
                                    onSelect={handleMedicalSpecialtyCategorySelect}
                                    isInvalid={false}
                                    handleChange={handleChange}
                                />
                            </div>
                            <div className='basis-[35%] bg-[#158a7838]'>
                                <LocationDropdownForHeader
                                        options={memoizedLocation}
                                        selected={formData.location}
                                        onSelect={handleLocationSelect}
                                        isInvalid={false}
                                        handleChange={handleChange}
                                    />
                            </div>
                            <div className='bg-[#158a7838] py-[10px] px-4'>
                                <button 
                                    className=''
                                     onClick={handleSearch}
                                    type="button"
                                >
                                    <CiSearch
                                        className='text-white font-bold'
                                    />
                                </button>
                            </div>
                        </div>
                    </form>}

               </div> */}

                {/* <div className='flex gap-4'> */} 

                    {/* Navigation  items open on toggle  for none logged*/}
                    {/* {isAboveSmallScreens ? (
                        <div className='flex items-center '>
                            <Navbar.Collapse>
                                {!currentUser && (
                                <div className='text-white'>
                                
                                </div>
                                )}  
                            </Navbar.Collapse>
                            <div className='flex items-center gap-4 '>
                                <div className='flex items-center gap-4'> */}
                                    {/* Logged in user */}
                                    {/* {currentUser ? (
                                        <div className='relative' ref={dropdownRef}>
                                            <span
                                                className='text-white cursor-pointer flex items-center'
                                                onClick={toggleDropdown}
                                            >
                                                {currentUser.email ? truncateEmail(currentUser.email) : 'No email found'}
                                                <MdKeyboardArrowDown className='ml-1 text-2xl'/>
                                            </span> */}

                                            {/* Dropdown Menu */}
                                            {/* {isDropdownOpen && (
                                                <div className="absolute right-0 mt-5 w-48 bg-white border rounded-md shadow-lg z-50">
                                                    <ul className="py-1">
                                                        <li>
                                                            <Link
                                                                to="/patient-profile"
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                My Account
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                to="/settings"
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Settings
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                to="/notifications"
                                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Notifications
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <button
                                                                onClick={handleLogout}
                                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            >
                                                                Logout
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link to='/login'>
                                            <Button outline gradientDuoTone="greenToBlue" size='sm'>
                                                Login
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ):(<></>) } */}

                
                    {/* MOBILE NAVIGATION */}
                    {/* {!isAboveSmallScreens && isMenuToggled && (
                    <div className="fixed inset-0 bg-[#00b39b]  w-full h-full z-50 overflow-y-auto">
                        {/* Header */}
                        {/* <header className="flex justify-between items-center px-4 py-3 border-b border-white/20">
                        <img src={mobileLogo} alt="logo" className="w-8 opacity-80" />
                        <button onClick={handleMenuToggle} className="text-2xl">
                            <FaTimes className='text-white'/>
                        </button>
                        </header> */}

                        {/* Full Search Form for Mobile */}
                        {/* <div className="p-4 space-y-4">
                        <div className='bg-[#02a993] rounded'>
                            <MedicalSpecialtyDropdownForHeader
                                options={memoizedMedicalSpecialtyCategory}
                                selected={formData.medicalSpecialtyCategory}
                                onSelect={handleMedicalSpecialtyCategorySelect}
                                className='text-gray-500'
                            />
                        </div>
                        <div className='bg-[#02a993] rounded'>
                            <LocationSearchFree
                                options={memoizedLocation}
                                selected={formData.location}
                                onSelect={handleLocationSelect}
                                className='text-gray-500 bg-[#02a993]'
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleSearch}
                            className="w-full bg-white text-[#00b39b] font-medium rounded-lg px-4 py-2"
                        >
                            Search
                        </button>
                        </div> */}

                        {/* Rest of your nav links */}
                       
                    {/* </div>
                    )}


                </div>  */}