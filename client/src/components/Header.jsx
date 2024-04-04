import { useState } from 'react';
import { Navbar, Button, Dropdown } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon } from 'react-icons/fa';
import logo from '../assets/medipulso.png';
import useMediaQuery from '../hooks/useMediaQuery';
import toggleImage from '../assets/menu-icon.svg';
import toggleCloseImage from '../assets/close-icon.svg';
import DropdownMenu from './Dropdown';


export default function Header() {
    const path = useLocation().pathname;
    const [isMenuToggled, setIsMenuToggled] = useState(false);
    const isAboveSmallScreens = useMediaQuery('(min-width: 768px)');

    return (
        <Navbar className='flex border-b-2 '>
            <Link to="/">
                <img src={logo} alt="logo" className=' w-32 md:-w-[50%]' />
            </Link>

            <div className='flex gap-4'>
             
                {/* DESKTOP NAVIGATION */}
                {isAboveSmallScreens ? (
                    <div className='flex'>
                        <Navbar.Collapse>
                            <div className='flex sm:flex-row items-center gap-4 flex:row lg:flex-row'>
                                <Navbar.Link active={path === '/data-privacy'} as='div'>
                                    <Link to="/data-privacy">Data Privacy</Link>
                                </Navbar.Link>
                                <Navbar.Link active={path === '/questions'} as='div'>
                                    <Link to="questions">Questions</Link>
                                </Navbar.Link>
                            </div>
                            <div >

                                <Dropdown
                                    color={'gradientDuoTone'}
                                    label='Register for free'
                                >
                                    <Dropdown.Header >
                                        <span>Register for free</span>
                                    </Dropdown.Header>
                                    <Link to="/as-doctor">
                                        <Dropdown.Item>as a doctor</Dropdown.Item>
                                    </Link>
                                    <Link to="/as-patient">
                                        <Dropdown.Item>as a patient</Dropdown.Item>
                                    </Link>
                                    <Link to="/as-facility"><Dropdown.Item>as a facility</Dropdown.Item></Link>
                                </Dropdown>
                            </div>
                        </Navbar.Collapse>
                        <div className='flex items-center gap-4'>
                            <div className='flex gap-4'>
                                <Button
                                    className='w-12 h-10 sm:inline'
                                    color='gray'
                                    pill
                                    
                                >
                                    <FaMoon />
                                </Button>
                                <Link to='/login' >
                                    <Button outline gradientDuoTone="greenToBlue" size='sm'>
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex gap-4'>
                        <div className='flex gap-4'>
                                <Button
                                    className='w-12 h-10 sm:inline'
                                    color='gray'
                                    pill
                                >
                                    <FaMoon />
                                </Button>
                                <Link to='/login'>
                                    <Button outline gradientDuoTone="greenToBlue">
                                        Login
                                    </Button>
                                </Link>
                            </div>
                        <button
                            className='bg-[#68c5b0] p-2  rounded-md cursor-pointer'
                            onClick={() => setIsMenuToggled(!isMenuToggled)} // Fix: Wrap setIsMenuToggled in a function
                            id='hamburger-button'
                        >
                            <img src={toggleImage} alt="menu icon" />
                        </button>
                        
                    </div>
                )}
                {/* MOBILE NAVIGATION */}
                {!isAboveSmallScreens && isMenuToggled && (
                    <div className="fixed right-0 bottom-0 h-full bg-gradient-to-l from-[#68c5b0] to-emerald-600 text-white w-[100%] transition-all duration-3000">
                
                        {/* CLOSE ICON */}
                        <div className="flex justify-end p-12">
                            <button onClick={() => setIsMenuToggled(!isMenuToggled)}>
                                <img src={toggleCloseImage} alt="close mobile menu icon" />
                            </button>
                        </div>
                        <div>
                            <div className='flex flex-col m-auto items-center list-none'>
                                <div className='flex flex-col justify-center p-4 items-center'>
                                    <Navbar.Link active={path === '/data-privacy'} as='div' className='border-none list-none hover:bg-transparent bg-transparent'>
                                        <Link to="/data-privacy" ><span className='text-lg mb-4 text-white border-none hover:font-semibold '>Data Privacy</span></Link>
                                    </Navbar.Link>
                                    <Navbar.Link active={path === '/questions'} as='div' className='border-none bg-transparent hover:bg-transparent'>
                                        <Link to="/questions" ><span className='text-lg text-white hover:font-semibold'>Questions</span></Link>
                                    </Navbar.Link>
                                </div>
                                <DropdownMenu />
                            </div>
                        </div>
                    </div>
                )}
            </div>

        </Navbar>
    );
}

