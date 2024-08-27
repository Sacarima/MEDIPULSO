import { useState, useEffect, useRef } from 'react';
import { Navbar, Button, Dropdown } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun, FaUser, FaCaretDown } from 'react-icons/fa';
import { MdKeyboardArrowDown } from "react-icons/md";
import logo from '../assets/medipulso.png';
import logoDarkMode from '../assets/logoDarkMode-1.png';
import useMediaQuery from '../hooks/useMediaQuery';
import { useSelector, useDispatch } from 'react-redux';
import { toogleTheme } from '../redux/theme/themeSlice';
import MobileDropdownContent from './MobileDropdownContent'
import { logoutUserSuccess } from '../redux/user/userSlice'
import { FaAngleRight, FaAlignRight, FaTimes } from "react-icons/fa"; // Import FaTimes

export default function Header() {
    const path = useLocation().pathname;
    const [isMenuToggled, setIsMenuToggled] = useState(false);
    const [showDropdownContent, setShowDropdownContent] = useState(false);
    const { currentUser } = useSelector(state => state.user)
    const dropdownRef = useRef(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const isAboveSmallScreens = useMediaQuery('(min-width: 768px)');
    const { theme } = useSelector(state => state.theme);

    const [isOpen, setIsOpen] = useState(false); // State for icon toggle

    // Close menu handler
    const closeMenu = () => {
        setIsMenuToggled(false);
        setShowDropdownContent(false);
    };

    // Toggle menu and icon state
    const handleMenuToggle = () => {
        setIsMenuToggled(!isMenuToggled);
        setIsOpen(!isOpen);
    };

    // Function to truncate the email address
    const truncateEmail = (email, maxLength = 15) => {
        if (email.length <= maxLength) return email;

        const [name, domain] = email.split('@');
        const truncatedName = name.length > maxLength ? name.slice(0, maxLength - domain.length - 3) : name;
        
        return `${truncatedName}...@${domain}`
    }

    // function to toggle the dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close the dropdown when clicking outside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsDropdownOpen(false);
        }
    };

    // Add event listener for clicks outside the dropdown
    useEffect(() => {
        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // handle logout
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:7500/api/user/logout', {
                method: 'POST',
            })
            const data = await response.json();
            if (!response.ok) {
                console.log(data.message)
            }else {
                dispatch(logoutUserSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    };

    return (
        <div className='border-b-[1px]'>
            <Navbar className='flex sm:px-0 sm:w-[70%] m-auto lg:py-3'>
                <Link to="/">
                    <img src={theme === 'dark' ? logoDarkMode : logo} alt="logo" className='w-32' />
                </Link>
                <div className='flex gap-4'>
                    {/* DESKTOP NAVIGATION */}
                    {isAboveSmallScreens ? (
                        <div className='flex'>
                            <Navbar.Collapse>
                                <div className='flex sm:flex-row items-center gap-4 lg:flex-row'>
                                    <Navbar.Link active={path === '/job-offers-for-doctors'} as='div'>
                                        <Link to="/job-offers-for-doctors">Job offers for doctors</Link>
                                    </Navbar.Link>
                                    <Navbar.Link active={path === '/data-privacy'} as='div'>
                                        <Link to="/data-privacy">Data Privacy</Link>
                                    </Navbar.Link>
                                    <Navbar.Link active={path === '/questions'} as='div'>
                                        <Link to="questions">Questions</Link>
                                    </Navbar.Link>
                                </div>
                                <div>
                                    <Dropdown label='Register for free' color='white' className='py-5 mt-1'>
                                        <Link to="/signup/doctor-form">
                                            <Dropdown.Item>As a doctor</Dropdown.Item>
                                        </Link>
                                        <Link to="/signup">
                                            <Dropdown.Item>As a patient</Dropdown.Item>
                                        </Link>
                                        <Link to="/signup/clinic-form"><Dropdown.Item>As a facility</Dropdown.Item></Link>
                                    </Dropdown>
                                </div>
                            </Navbar.Collapse>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-4'>
                                    <Button
                                        className='w-12 h-10 sm:inline'
                                        color='gray'
                                        pill
                                        onClick={() => dispatch(toogleTheme())}
                                    >
                                        {theme === 'light' ? <FaSun /> : <FaMoon />}
                                    </Button>
                                    
                                    {currentUser ? (
                                        <div className='relative' ref={dropdownRef}>
                                            <span
                                                className='text-slate-500 cursor-pointer flex items-center'
                                                onClick={toggleDropdown}
                                            >
                                                {truncateEmail(currentUser.email)}
                                                <MdKeyboardArrowDown className='ml-1 text-2xl'/>
                                            </span>

                                            {/* Dropdown Menu */}
                                            {isDropdownOpen && (
                                                <div className="absolute right-0 mt-5 w-48 bg-white border rounded-md shadow-lg z-50">
                                                    <ul className="py-1">
                                                        <li>
                                                            <Link
                                                                to="/my-account"
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
                        <div className=' flex -200'>
                            <Button
                                className='w-12 h-10 sm:inline mr-5'
                                color='gray'
                                pill
                                onClick={() => dispatch(toogleTheme())}
                            >
                                {theme === 'light' ? <FaSun /> : <FaMoon />}
                            </Button>

                            <button
                                className='p-2  rounded-md cursor-pointer'
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
                        <div className="fixed right-0 bottom-0 h-full bg-[#00b39b] text-white w-[100%] transition-all duration-3000">
                            {/* CLOSE ICON */}
                            <header className="px-5">
                                <div className="flex justify-between items-center w-[100%] m-auto py-4">
                                    <img src={logoDarkMode} alt='logo' className='w-[35.5%]' />
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
                                            <div className='border-b-[1px] border-[#343a4018]'>
                                                <Navbar.Link active={path === '/job-offers-for-doctors'} as='div' className='border-none list-none py-5 hover:bg-transparent bg-transparent'>
                                                    <Link to="/job-offers-for-doctors"><span className=' mb-4  text-white border-none hover:font-semibold'>Job offers for doctors</span></Link>
                                                </Navbar.Link>
                                            </div>
                                            <Navbar.Link active={path === '/questions'} as='div' className='border-none bg-transparent hover:bg-transparent py-5'>
                                                <Link to="/questions"><span className=' text-white hover:font-semibold'>Data privacy</span></Link>
                                            </Navbar.Link>
                                            <Navbar.Link active={path === '/questions'} as='div' className='border-none bg-transparent hover:bg-transparent py-5'>
                                                <Link to="/login"><span className=' text-white hover:font-extrabold'>Log in</span></Link>
                                            </Navbar.Link>
                                            <Navbar.Link active={path === '/questions'} as='div' className='border-none py-5 bg-transparent hover:bg-transparent'>
                                                <Link to="/questions"><span className=' text-white hover:font-semibold'>Ask your doctor</span></Link>
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
    );
}
