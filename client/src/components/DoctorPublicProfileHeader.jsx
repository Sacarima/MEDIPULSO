import { useState, useEffect, useRef, useMemo } from 'react'
import { Navbar, Button, Dropdown } from 'flowbite-react'
import { Link, useLocation } from 'react-router-dom'
import { FaMoon} from 'react-icons/fa'
import { RxSun } from "react-icons/rx"
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

   useEffect(() => {
    if (currentUser) {
        console.log('Currnet user after login: ', currentUser)
    }
   }, [currentUser])
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
        } catch (error) {
          console.error("Search failed:", error.message);
        }
      };
      
 // bg-[#00c3a5]   bg-[#00c3a5]
  return (
        <div className='border-b-[1px dark:bg-gray-800 bg-[#00c3a5]'>
            <Navbar className=' sm:px-0 lg:w-[70%] w-full m-auto lg:py-3 bg-[#00c3a5]'>
                <div className='flex gap-4 grow items-center  justify-between'>
                    <div className=''>
                        <Link to="/">
                            <img src={theme === 'dark' ? logoDarkMode : logo} alt="logo" className='w-[12.2rem]' />
                          
                        </Link>
                    </div>
                    <form className='hidden lg:block w-full justify-between sm:flex-row items-center lg:flex-row '>
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
                    </form>

                </div>
                <div className='flex gap-4'>
                    {/* DESKTOP NAVIGATION */}
                    {isAboveSmallScreens ? (
                        <div className='flex items-center'>
                            <Navbar.Collapse>
                                {!currentUser && (
                                <div className='text-white'>
                                
                                </div>
                                )}  
                            </Navbar.Collapse>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-4'>
                                    <Button
                                        className='w-12 h-10 sm:inline'
                                        color=''
                                        pill
                                        onClick={() => dispatch(toogleTheme())}
                                    >
                                        {theme === 'light' ? <RxSun className='text-white cursor-pointer'/> : <FaMoon />}
                                    </Button>
                                    
                                    {currentUser ? (
                                        <div className='relative' ref={dropdownRef}>
                                            <span
                                                className='text-white cursor-pointer flex items-center'
                                                onClick={toggleDropdown}
                                            >
                                                {currentUser.email ? truncateEmail(currentUser.email) : 'No email found'}
                                                <MdKeyboardArrowDown className='ml-1 text-2xl'/>
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
                    ) : (
                        <div className=' flex'>
                            <Button
                                className='w-12 h-10 sm:inline mr-5'
                                color=''
                                pill
                                onClick={() => dispatch(toogleTheme())}
                            >
                                {theme === 'light' ? <RxSun className='text-white text-2xl cursor-pointer'/> : <FaMoon />}
                            </Button>

                            <button
                                className='p-2  rounded-md text-white cursor-pointer'
                                onClick={handleMenuToggle}
                                id='hamburger-button'
                            >
                                {isOpen ? (
                                    <FaTimes className='text-2xl animate-menuClose' />
                                ) : (
                                    <FaAlignRight className='text-2xl animate-menuOpen' />
                                )}
                            </button>

                            <Link to='/login'>
                                <Button outline gradientDuoTone="greenToBlue" size='sm' className='hidden'>
                                    Login
                                </Button>
                            </Link>
                        </div>
                    )}

                    {/* MOBILE NAVIGATION */}
                    {!isAboveSmallScreens && isMenuToggled && (
                        <div className="fixed right-0 bottom-0 h-full bg-[#00b39b] text-white w-[100%] transition-all duration-3000 z-50">
                            {/* CLOSE ICON */}
                            <header className="px-5">
                                <div className="flex justify-between items-center w-[100%] m-auto py-4">
                                    <img src={mobileLogo} alt='logo' className='w-[9%]' />
                                    <button onClick={handleMenuToggle} className='text-2xl font-bold'>
                                        <FaTimes />
                                    </button>
                                </div>
                            </header>
                            {/* CONDITIONAL RENDERING */}
                            {showDropdownContent ? (
                                <MobileDropdownContent onBack={() => setShowDropdownContent(false)} onClose={closeMenu} />
                            ) : (
                                <nav>
                                    <div className='flex flex-col m-auto justify-start list-none w-[93%]'>
                                        <div className='flex flex-col divide-y divide-[#343a4018] divide-y-reverse'>
                                          
                                            <Navbar.Link active={path === '/questions'} as='div' className='border-b-[1px] border-[#343a4018] bg-transparent hover:bg-transparent py-5'>
                                                <Link to="/login"><span className=' text-white hover:font-extrabold'>Log in</span></Link>
                                            </Navbar.Link>
                                           
                                            <div className='py-4'>
                                                <button
                                                    className='w-full flex items-center pl-2 justify-between gap-1 rounded-lg tracking-wider border-4 border-transparent'
                                                    onClick={() => setShowDropdownContent(true)}
                                                >
                                                    <span>Register for free</span> <FaAngleRight />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </nav>
                            )}
                        </div>
                    )}
                </div>
            </Navbar>
        </div>
)

}


export default WithLogout(DoctorPublicProfileHeader)