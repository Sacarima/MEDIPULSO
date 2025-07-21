import React, { useState, useEffect, useRef } from 'react'
import { FaRegHeart } from "react-icons/fa"
import { FaRegCalendarAlt } from "react-icons/fa"
import { FaHeart } from "react-icons/fa"
import { GrStatusGood } from "react-icons/gr"
import { IoLocationSharp } from "react-icons/io5"
import { BsCalendarCheck } from "react-icons/bs"
import { GiMoneyStack } from "react-icons/gi"
import { MdPrivacyTip } from "react-icons/md"
import { BsTelephoneForwardFill } from "react-icons/bs"
import { CiStethoscope } from "react-icons/ci"
import { LiaGlobeAfricaSolid } from "react-icons/lia"
import { PiIdentificationCardThin } from "react-icons/pi"
import { IoIosArrowDown } from "react-icons/io"
import { IoIosArrowUp } from "react-icons/io"
import { IoSendSharp } from "react-icons/io5"
import { throttle } from 'lodash'
import { MdOutlineKeyboardArrowRight } from "react-icons/md"
import { MdKeyboardArrowUp } from "react-icons/md"
import { LiaTimesSolid } from "react-icons/lia"
import { useParams } from 'react-router-dom'
import DoctorPublicProfileHeader from './DoctorPublicProfileHeader'
import DoctorLocation from './DoctorLocation'
import ReviewsSection from './review/ReviewsSection'
import { useNavigate } from 'react-router-dom'
import { DoctorProvider } from './context/DoctorContext'
import Carousel from './Carousel'
import { ROUTES } from '../config/routes'
import useMediaQuery from '../hooks/useMediaQuery'
import Footer from './Footer'





const DoctorPublicProfile = ({ isLoaded }) => {
    const [isFavourite, setIsFavourite] = useState(false)
    const [activeSection, setActiveSection] = useState('addresses')
    const [showMore, setShowMore] = useState(false)
    const [isSticky, setIsSticky] = useState(false)
    const [doctorData, setDoctorData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showMoreContentDetails, setShowMoreContentDetails] = useState({})
    const [open, setOpen] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [faqFirst, setFaqFirst] = useState(true)
    const [reviews, setReviews] = useState([])
    const navigate = useNavigate()
    const [isFocused, setIsFocused] = useState(false)
    const isMobile = useMediaQuery('(max-width: 768px)')



    const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri']
    const dates = ['22 Nov', '23 Nov', '24 Nov', '25 Nov', '26 Nov', '27 Nov', '28 Nov']

    
    const navbarRef = useRef(null)
    const addressRef = useRef(null)
    const priceListRef = useRef(null)
    const experienceRef = useRef(null)
    const reviewsRef = useRef(null)

    const { doctorId } = useParams()

    // concat about me information
    const maxLength = 350
    const fullText = doctorData?.aboutMe || ''
    const truncatedText = fullText.length >  maxLength ? fullText.substring(0, maxLength) + '...' : fullText


    const handleOverlayClick = () => {
        setIsFocused(false) // deactivate appointment overlay
    }

    const handleAppointmentClick = (e) => {
        e.stopPropagation() // Prevent triggering the overlay click
        setIsFocused(true) // activate appointment overlay
    }


    // fetch doctor data
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const [doctorResponse, reviewResponse] = await Promise.all([
                    fetch(`http://localhost:7500/api/doctor-form/profile-info/${doctorId}`, {
                        headers: { 'Content-Type': 'application/json' },
                    }),
                    fetch(`http://localhost:7500/api/reviews/${doctorId}`, {
                        headers: { 'Content-Type': 'application/json' },
                    }),
                ])
    
                if (!doctorResponse.ok || !reviewResponse.ok) {
                    throw new Error('Failed to fetch data')
                }
    
                const doctor = await doctorResponse.json()
                const reviews = await reviewResponse.json()
            
                setDoctorData(doctor)
                setReviews(reviews)
            } catch (error) {
                console.error('Error fetching doctor details:', error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }
    
        if (doctorId) {
            fetchDoctorDetails()
        }
    }, [doctorId])


        useEffect(() => {
        const handleLoad = () => {
            
            handleScroll()
        }
    
        window.addEventListener('load', handleLoad)
        window.addEventListener('scroll', handleScroll)
    
        return () => {
            window.removeEventListener('load', handleLoad)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    useEffect(() => {
        if (showModal) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }
        return () => {
            document.body.classList.remove('overflow-hidden')
        }
    }, [showModal])

    // function show more content details
    const handleShowMoreContentDetails = (contentId) => {
        setShowMoreContentDetails((prev) => ({
            ...prev,
            [contentId]: !prev[contentId]
        }))
        setOpen((prev) => ({
            ...prev,
            [contentId]: !prev[contentId]
        }))
    }
    

    //function to show more content
    const handleShowMore = () => {
        setShowMore(!showMore)
    }

    // function to scroll to the selected section
    const scrollToSection = (ref) => {
        ref.current.scrollIntoView({ behavior: 'smooth' })
    }
 

    const handleScroll = throttle(() => {
        if (!navbarRef.current) return

        const navbarPosition = navbarRef.current.offsetTop
        const scrollPosition = window.scrollY
        const atTop = scrollPosition >= navbarPosition
    
        if (isSticky !== atTop) {
            setIsSticky(atTop)
        }
    
        const sectionPositions = {
            addresses: addressRef.current.offsetTop ,
            priceList: priceListRef.current.offsetTop - 50,
            experience: experienceRef.current.offsetTop - 50,
            reviews: reviewsRef.current.offsetTop -50,
        }
    
        const newActiveSection = (
            scrollPosition < sectionPositions.priceList ? 'addresses' :
            scrollPosition < sectionPositions.experience ? 'priceList' :
            scrollPosition < sectionPositions.reviews ? 'experience' :
            'reviews'
        )
    
        if (newActiveSection !== activeSection) {
            setActiveSection(newActiveSection)
        }else if(atTop) {
            setActiveSection('addresses')
        }
    }, 100)
    

    const handleFavourite = () => {
        setIsFavourite(!isFavourite)
    }

    const handleFrequentlyAskedQuestions = () => {
        setFaqFirst(!faqFirst)
    }


     // Handle add review navigation
     const handleAddReview = () => {
    
        if (doctorData?._id) {
            navigate(`/doctor-review/${doctorData._id}`);
        } else {
            console.error("Doctor ID is missing.");
            alert("Doctor ID is not available. Please try again.");
        }
    }

    // prevent scrolling when modal is opened



   

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>


  return (
    <div>
         {isFocused && (
            <div
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />
        )}
        <div className='bg-[#eef4fd] min-h-screen'>
            <DoctorPublicProfileHeader />
            <section className='lg:w-[70%] m-auto'>
                <div  className='flex gap-6'>
                    <div className='lg:w-[55%]'>
                                <section className=' flex flex-col lg:flex-row mt-6 bg-white w-full p-4 rounded-t-sm shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>
                                    <div className='pr-2 mr-3 relative'>
                                        <img className='w-[100px] h-[120px] ' src={doctorData?.profilePicture} alt="" />
                                    </div>
                                    <div className='grow mt-4'>
                                        <div className='flex justify-between'>
                                            <div className='flex gap-1 items-center'>
                                                <span className='font-bold'>Dr.</span>
                                                <p className='font-bold'>{doctorData?.firstName}</p>
                                                <p className='font-bold'>{doctorData?.lastName}</p>
                                                <p className='font-bold'>{doctorData?.degree}</p>
                                                <GrStatusGood className='text-[#00c3a5] text-sm' />
                                            </div>
                                           
                                        </div>
                                        <div className='flex gap-1 mt-2'>
                                            <p>{doctorData?.medicalCategory}</p>
                                            <p>Pediatrician</p>
                                            <p className='cursor-pointer underline'>more</p>
                                        </div>
                                        <div className='flex gap-4 mt-2'>
                                            <p>{doctorData?.city}</p>
                                            <p className='underline cursor-pointer' onClick={() => scrollToSection(addressRef)}>1 address</p>
                                        </div>
                                        <div className='mt-2'>
                                            <p>PWZ No. {doctorData?.license}</p>
                                        </div>
                                        <div className='flex flex-col lg:flex-row lg:gap-3'>
                                            <button onClick={handleAppointmentClick} className='flex items-center cursor-pointer gap-4 bg-blue-500 text-white px-4 py-2 rounded-[3.5px] my-4'>
                                                <FaRegCalendarAlt className='text-xl' />
                                                <span >Book an appointment</span>
                                            </button>
                                            <button className='flex items-center cursor-pointer gap-4 border-[1px] px-4 py-2 rounded-[3.5px] my-4 '>
                                                <IoSendSharp className='text-xl' />
                                                <span>Send a message</span>
                                            </button>
                                        </div>
                                    </div>
        
                                </section>
        
                                {/* NAVIGATION  */}
                                <nav ref={navbarRef} className={`w-full border-t bg-white shadow z-10 ${isSticky ? 'sticky top-0 z-10' : 'relative'}`}>
                                    <ul className='flex justify-between text-center px-4 py-1'>
                                        {['addresses', 'priceList', 'experience', 'reviews'].map((section) => (
                                            <li key={section}
                                                className={`cursor-pointer flex-1 p-2 ${activeSection === section ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}
                                                onClick={() => scrollToSection({ addresses: addressRef, priceList: priceListRef, experience: experienceRef, reviews: reviewsRef }[section])}
                                            >
                                                {/* Capitalize firstletter */}
                                                {section.charAt(0).toUpperCase() + section.slice(1)}
                                                {/* Add total review next to reviews */}
                                                {section === 'reviews' && reviews.length > 0 && ` (${reviews.length})`}
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
        
                        {/* DOCTORS' ADDRESS */}
        
                        <section ref={addressRef} className=' mt-4 bg-white w-full  p-4 rounded-t-sm shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>
                        <h2 className='text-xl font-medium py-2 mb-4'>Address</h2>
        
                            <div className='flex gap-4 items-start'>
                                <div className='flex gap-4 flex-1'>
                                    <div className='mt-1'>
                                        <IoLocationSharp className='text-gray-400'/>
                                    </div>
                                    <div className='w-full   text-silver-500 pb-4'>
                                            <p className='font-medium'>{doctorData?.location}</p>
                                            <div className='flex gap-2'>
                                                <p className='text-gray-900'>{doctorData?.address},</p>
                                                <p className='text-gray-400'>{doctorData?.city}</p>
                                            </div>
                                    </div>
                                </div>
                                <div className=' flex-2'>
                                    <DoctorLocation address={doctorData?.address} isLoaded={isLoaded}/>
                                </div>
                            </div>
                            <div className='flex items-center gap-4 text-gray-400 '>
                                <BsCalendarCheck />
                                <div className='grow  p-4 border-t-[.5px]'>
                                    <span className='bg-blue-50 py-1 px-3 cursor-pointer rounded-sm text-blue-500 font-medium'>Show calendar</span>
                                </div>
                            </div>
                            <div className='flex items-center gap-4 text-gray-400'>
                                <MdPrivacyTip />
                                <span className='border-t-[.5px] grow  p-4'>Private patients "without insurance"</span>
                            </div>
                            <div className='flex items-center gap-4 text-gray-400'>
                                <GiMoneyStack />
                                <span className='border-t-[.5px] grow  p-4'>Cash, Card payment</span>
                            </div>
                            <div className='flex items-center gap-4 text-gray-400'>
                                <BsTelephoneForwardFill />
                                <span className='border-t-[.5px] grow  p-4'>+48 {doctorData?.phoneNumber}</span>
                            </div>
                            <div className='flex items-center gap-4 text-gray-400'>
                                <LiaGlobeAfricaSolid />
                                <span className='border-t-[.5px] grow  p-4'>www.sorriso.pl</span>
                            </div>
                            <div className='flex items-center gap-4 text-gray-400'>
                                <CiStethoscope className='text-gray-700'/>
                                <span className='border-y-[.5px] grow  p-4'>Orthodontic consultation from PLN 250</span>
                            </div>
                             {showMore && (
                                    <>
                                        <div className='flex items-center gap-4 text-gray-400'>
                                            <PiIdentificationCardThin className='text-gray-700'/>
                                            <div className='border-t-[.5px grow p-2'>
                                                <span className='text-gray-700'>Tax Identification Number</span>
                                                <p className='text-sm'>8938493894894893</p>
                                            </div>
                                        </div>
                                        <div className='flex  gap-4 text-gray-400 '>
                                            <div className='mt-5'>
                                                <IoLocationSharp />
                                            </div>
                                            <div className='border-y-[.5px] grow  p-4 mb-2'>
                                                <span className='text-gray-700'>Company Address</span>
                                                <p className='text-sm'>123 Main Street, Michasl kliedon </p>
                                            </div>
                                        </div>
                                    </>
                                   )}
        
                            <div
                                className='flex items-center justify-between my-4'>
        
                                <span onClick={handleShowMore} className=' underline cursor-pointer '>{showMore ? "Show less" : "Show more"}</span>
                                { showMore ? <IoIosArrowUp className='text-gray-400 cursor-pointer' onClick={handleShowMore}/> : <IoIosArrowDown className='text-gray-400 cursor-pointer' onClick={handleShowMore}/>}
                            </div>
                        </section>
                        {/* DOCTORS' PRICE LIST AND SERVICES*/}
                        <section ref={priceListRef} className=' mt-4 bg-white w-full  p-4 rounded-t-sm shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>
                            <h2 className='text-xl font-medium '>Services and prices</h2>
                            <span className='text-gray-500 text-sm'>Prices are for private visits.</span>
                            <p className='mt-5 mb-3 text-[12px] text-gray-400 '>Other services</p>
                            <div className=''>
                                <div className=''>
                                    {/* FIX THIS HERE */}
                                    <div className='flex gap-2 cursor-pointer py-4 border-b-[.5px] border-gray-200' onClick={() => handleShowMoreContentDetails('first')}>
                                        <MdOutlineKeyboardArrowRight className={`transition-transform text-gray-400 text-xl cursor-pointer ${open['first'] ? 'rotate-90 ease-in' : 'rotate-0 ease-out'}`}  />
                                        <p>Psychological consultation for children and adolescents</p>
                                    </div>
                                    {showMoreContentDetails['first'] && (
                                        <div className='border-b-[.5px] ml-7 border-gray-200 pb-5'>
                                            <div className='flex justify-between mt-2' >
                                                <span className='text-gray-700 font-medium -2'>Bishop 6b, Wroclaw</span>
                                                <span className='text-gray-700 font-medium -2'>200 PLN</span>
                                            </div>
                                            <span className='text-gray-400'>GYNEMEDICA</span>
                                            <p className='text-sm text-gray-500 mt-4'>The visit must be paid for within an hour of the booking time,
                                            a payment link will be sent to the email provided when booking.
                                            If payment is not made in time, the visit will be automatically deleted
                                            // Please note that if the visit is cancelled less than 24 hours before the
                                            planned date, the prepayment is not refundable or transferable to another date.
                                            Full payment regulations are available on our website.
                                            </p>
                                        </div>
                                    )}
        
                                    <div className='flex cursor-pointer gap-2 py-4 border-b-[.5px] border-gray-200' onClick={() => handleShowMoreContentDetails('second')}>
                                        <MdOutlineKeyboardArrowRight className={`transition-transform text-gray-400 text-xl ${open['second'] ? 'rotate-90 ease-in' : 'rotate-0 ease-out'}`}/>
                                        <p>Individual psychotherapy for adults</p>
                                    </div>
                                    {showMoreContentDetails['second'] && (
                                        <div className='border-b-[.5px] ml-7 border-gray-200 pb-5'>
                                            <div className='flex justify-between mt-2'>
                                                <span className='text-gray-700 font-medium'>Bishop 6b, Wroclaw</span>
                                                <span className='text-gray-700 font-medium'>200 PLN</span>
                                            </div>
                                            <span className='text-gray-400'>CLINICA DOCE LAR</span>
                                            <p className='text-sm text-gray-500 mt-4'>The visit must be paid for within an hour of the booking time,
                                            a payment link will be sent to the email provided when booking.
                                            If payment is not made in time, the visit will be automatically deleted
                                            // Please note that if the visit is cancelled less than 24 hours before the
                                            planned date, the prepayment is not refundable or transferable to another date.
                                            Full payment regulations are available on our website.
                                            </p>
                                        </div>
                                    )}
                                 </div>
        
                                <div className='flex cursor-pointer gap-2 py-4 border-b-[.5px] border-gray-200' onClick={() => handleShowMoreContentDetails('third')}>
                                    <MdOutlineKeyboardArrowRight className={`transition-transform text-gray-400 text-xl ${open['third'] ? 'rotate-90 ease-in' : 'rotate-0 ease-out'}`}/>
                                    <p>Partner psychotherapy</p>
                                </div>
                                {showMoreContentDetails['third'] && (
                                    <div className='border-b-[.5px] ml-7 border-gray-200 pb-5'>
                                        <div className='flex justify-between mt-2'>
                                            <span className='text-gray-700 font-medium'>Bishop 6b, Wroclaw</span>
                                            <span className='text-gray-700 font-medium'>290 PLN</span>
                                        </div>
                                        <span className='text-gray-400'>MULTI-PERFIL</span>
                                        <p className='text-sm text-gray-500 mt-4'>The visit must be paid for within an hour of the booking time,
                                        a payment link will be sent to the email provided when booking.
                                        If payment is not made in time, the visit will be automatically deleted
                                        // Please note that if the visit is cancelled less than 24 hours before the
                                        planned date, the prepayment is not refundable or transferable to another date.
                                        Full payment regulations are available on our website.
                                        </p>
                                    </div>
                                )}
                                    <div className='flex cursor-pointer gap-2 py-4 border-b-[.5px] border-gray-200' onClick={() => handleShowMoreContentDetails('fourth')}>
                                        <MdOutlineKeyboardArrowRight className={`transition-transform text-gray-400 text-xl ${open['fourth'] ? 'rotate-90 ease-in' : 'rotate-0 ease-out'}`}/>
                                        <p>Individual psychotherapy for adults</p>
                                    </div>
                                    {showMoreContentDetails['fourth'] && (
                                    <div className='border-b-[.5px] ml-7 border-gray-200 pb-5'>
                                        <div className='flex justify-between mt-2'>
                                            <span className='text-gray-700 font-medium'>Bishop 6b, Wroclaw</span>
                                            <span className='text-gray-700 font-medium'>200 PLN</span>
                                        </div>
                                        <span className='text-gray-400'>CLINICA DOCE LAR</span>
                                        <p className='text-sm text-gray-500 mt-4'>The visit must be paid for within an hour of the booking time,
                                        a payment link will be sent to the email provided when booking.
                                        If payment is not made in time, the visit will be automatically deleted
                                        // Please note that if the visit is cancelled less than 24 hours before the
                                        planned date, the prepayment is not refundable or transferable to another date.
                                        Full payment regulations are available on our website.
                                        </p>
                                    </div>
                                )}
                                <div className='flex cursor-pointer gap-2 py-4 border-b-[.5px] border-gray-200' onClick={() => handleShowMoreContentDetails('fifth')}>
                                        <MdOutlineKeyboardArrowRight className={`transition-transform text-gray-400 text-xl ${open['fifth'] ? 'rotate-90 ease-in' : 'rotate-0 ease-out'}`}/>
                                        <p>Individual psychotherapy for adults</p>
                                    </div>
                                    {showMoreContentDetails['fifth'] && (
                                    <div className='border-b-[.5px] ml-7 border-gray-200 pb-5'>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-700 font-medium'>Bishop 6b, Wroclaw</span>
                                            <span className='text-gray-700 font-medium'>200 PLN</span>
                                        </div>
                                        <span className='text-gray-400'>CLINICA DOCE LAR</span>
                                        <p className='text-sm text-gray-500 mt-4'>The visit must be paid for within an hour of the booking time,
                                        a payment link will be sent to the email provided when booking.
                                        If payment is not made in time, the visit will be automatically deleted
                                        // Please note that if the visit is cancelled less than 24 hours before the
                                        planned date, the prepayment is not refundable or transferable to another date.
                                        Full payment regulations are available on our website.
                                        </p>
                                    </div>
                                )}
                                <div className='flex cursor-pointer gap-2 py-4 ' onClick={() => handleShowMoreContentDetails('sixth')}>
                                        <MdOutlineKeyboardArrowRight className={`transition-transform text-gray-400 text-xl ${open['sixth'] ? 'rotate-90 ease-in' : 'rotate-0 ease-out'}`}/>
                                        <p>Individual psychotherapy for adults</p>
                                    </div>
                                    {showMoreContentDetails['sixth'] && (
                                    <div className=' ml-7  pb-5'>
                                        <div className='flex justify-between'>
                                            <span className='text-gray-700 font-medium'>Bishop 6b, Wroclaw</span>
                                            <span className='text-gray-700 font-medium'>200 PLN</span>
                                        </div>
                                        <span className='text-gray-400'>CLINICA DOCE LAR</span>
                                        <p className='text-sm text-gray-500 mt-4'>The visit must be paid for within an hour of the booking time,
                                        a payment link will be sent to the email provided when booking.
                                        If payment is not made in time, the visit will be automatically deleted
                                        // Please note that if the visit is cancelled less than 24 hours before the
                                        planned date, the prepayment is not refundable or transferable to another date.
                                        Full payment regulations are available on our website.
                                        </p>
                                    </div>
                                )}
                                <p className='text-gray-400 text-sm pl-2'>
                                    Prices and information related to prices are the responsibility of specialists or facilities.<br></br>
                                    Medi-Pulso has no influence on prices and is not responsible for determining them.
                                </p>
                            </div>
                            </section>


                            {/* DOCTORS' EXPERIENCE */}
                            <section ref={experienceRef} className=' mt-4 bg-white w-full  p-4 rounded-t-sm shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>
                            <h2 className='text-2xl font-medium py-2'>My experience</h2>
        
                            <div className='mt-2'>
                                <div className='w-auto mb-6'>
                                    <img className='h-[300px] w-full object-fill rounded-md' src={doctorData?.photo} alt="" />
                                </div>
        
                                <p className=''>{truncatedText}</p>
                                {/* Show more text when there's more text than the truncated */}
                                {fullText.length > maxLength && (
                                    <button
                                    onClick={() => setShowModal(true)}
                                    className=" font-medium underline"
                                    >
                                    more
                                    </button>
                                )}
                            </div>
                                <button className='border w-full py-2 mt-4 rounded-sm cursor-pointer'>Show more</button>
                                {/* Modal */}
                                {showModal && (
                                    <div
                                        className='fixed top-0 inset-0 left-0 w-full h-full bg-gray-100 bg-opacity-90 z-50'
                                        onClick={(e) => {
                                            if (e.target === e.currentTarget) {
                                                setShowModal(false)
                                            }
                                        }}
                                    >
                                        <div className='bg-white w-[30%] m-auto mt-20 p-6 rounded-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                                            <div className='flex justify-between'>
                                                <h2 className='text-xl font-medium mb-4'>About me</h2>
                                                <LiaTimesSolid className='text-gray-500 cursor-pointer text-2xl ' onClick={() => setShowModal(false)}/>
                                            </div>
                                            <p style={{ whiteSpace: 'pre-wrap' }}>
                                                {doctorData?.aboutMe}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </section>


                            {/* DOCTORS' REVIEWS */}
                           <section ref={reviewsRef} className='mt-4 bg-white w-full p-4 rounded-t-sm shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px]'>
                            {reviews.length > 0 ? (
                                <DoctorProvider doctorData={doctorData}>
                                    <ReviewsSection reviews={reviews} doctorAddress={doctorData?.address} />
                                </DoctorProvider>
                            ) : (
                                <div>
                                    <h2 className='text-xl font-semibold p-4 border-b-[.5px] border-gray-200'>Reviews coming soon</h2>
                                    <div className='p-4'>
                                        <span className='font-medium'>Write the first review</span>
                                        <p className='mt-4'>
                                            Have you visited {doctorData?.firstName} {doctorData?.lastName}? Let us know what you think.
                                            Other patients will be grateful for your help in choosing the best specialist.
                                        </p>
        
                                            <button
                                                className='mt-3 bg-blue-500 text-white px-3 py-1 rounded-sm cursor-pointer'
                                                onClick={handleAddReview}
                                            >
                                                Add your review
                                            </button>
        
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>


                    {/* DOCTORS' APPOINTMENT SECTION */}
                    <section 
                        onClick={handleAppointmentClick}
                        className={`   sticky hidden lg:block  text-white text-center ${
                            isFocused ? "z-50" : ""} font-bold mt-6 w-[45%] self-start ${isSticky ? 'sticky top-0 z-40' : 'relative'}`}>
                        <div className='bg-blue-500 py-2 text-start'>
                            <h2 className='text-2xl p-[.6px] ml-6 font-medium'>Make an appointment</h2>
                        </div>
                        <div className="bg-white p-4 text-gray-700">
                            <div className="">
                                <div className="flex gap-2 mb-5">
                                    <div className="p-2 mt-">
                                        <GrStatusGood className="text-green-500" />
                                    </div>
                                    {/* Doctor's address */}
                                    <div className='text-start py-1'>
                                        <span className=''>Address</span>
                                        <p>{doctorData?.address}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 ">
                                    <div className="p-2">
                                        <GrStatusGood className="text-green-500" />
                                    </div>
        
                                    {/* Select consultation type */}
                                    <div className='flex flex-col grow'>
                                        <span className='self-start'>Reason for visiting</span>
                                        <select className="border border-gray-300 rounded min-w-[100px]">
                                            <option value="select">Select</option>
                                            <option className='text-red-400' value="consultation">Consultation</option>
                                            <option value="surgery">Surgery</option>
                                            <option value="therapy">Therapy</option>
                                            <option value="therapy">General Checkup</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-4 relative">
                        <Carousel
                            doctorId={doctorId}
                            onDateSelect={(date) => {
                                fetchAvailableTimes(date)
                            }}
                        />
        
                        </div>
                    </section>

                    {isFocused && (
                    <>
                        {/* Dark Overlay */}
                        <div 
                        onClick={() => setIsFocused(false)} 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        />

                        {/* Modal Content */}
                        <section 
                        className="fixed inset-0 z-50 bg-white p-4 overflow-y-auto lg:hidden"
                        >
                        <button
                            onClick={() => setIsFocused(false)}
                            className="absolute top-4 right-4 text-white text-2xl"
                        >
                            ✕
                        </button>

                        <div className='bg-blue-500 py-2 text-white'>
                            <h2 className='text-2xl p-[.6px] ml-6 font-medium'>Make an appointment</h2>
                        </div>

                        <div className="bg-white p-4 text-gray-700">
                            <div className="flex gap-2 mb-5">
                            <div className="p-2">
                                <GrStatusGood className="text-green-500" />
                            </div>
                            <div className='text-start py-1'>
                                <span>Address</span>
                                <p>{doctorData?.address}</p>
                            </div>
                            </div>

                            <div className="flex gap-2">
                            <div className="p-2">
                                <GrStatusGood className="text-green-500" />
                            </div>
                            <div className='flex flex-col grow'>
                                <span className='self-start'>Reason for visiting</span>
                                <select className="border border-gray-300 rounded min-w-[100px]">
                                <option value="select">Select</option>
                                <option value="consultation">Consultation</option>
                                <option value="surgery">Surgery</option>
                                <option value="therapy">Therapy</option>
                                <option value="general">General Checkup</option>
                                </select>
                            </div>
                            </div>
                        </div>

                        <div className="bg-white p-4 relative">
                            <Carousel
                            doctorId={doctorId}
                            onDateSelect={(date) => {
                                fetchAvailableTimes(date)
                            }}
                            />
                        </div>
                        </section>
                    </>
                    )}

                </div>
            </section>
            {/* FREQUENTLY ASKED QUESTION */}
            <section className='lg:w-[70%] m-auto'>
                <div className='lg:w-[60%]'>
                <section  className=' mt-4 w-full  p-4'>
                    <h2 className='text-xl font-medium py-2'>Frequently asked question</h2>
                    {/* FIRST QUESTION */}
                    <div className='flex justify-between cursor-pointer gap-2 py-2' onClick={handleFrequentlyAskedQuestions}>
                        <p className={`${faqFirst ? 'text-gray-400':'text-gray-700'}`}>What is the scope of advice offered by {doctorData?.firstName} {doctorData?.lastName}?</p>
                        <MdKeyboardArrowUp className={`transition-transform text-gray-400 text-xl ${faqFirst ? 'rotate-180 ease-in' : 'rotate-0 ease-out'}`}/>
                    </div>
                        {faqFirst && (
                            <div>
                                <p className='text-sm text-gray-700 mb-4'>The visit must be paid for within an hour of the booking time,
                                a payment link will be sent to the email provided when booking.
                                If payment is not made in time, the visit will be automatically deleted
                                Please note that if the visit is cancelled less than 24 hours before the
                                planned date, the prepayment is not refundable or transferable to another date.
                                </p>
                            </div>
                        )}
                    {/* SECOND QUESTION */}
                    <div className='flex justify-between cursor-pointer gap-2 py-2' onClick={() => handleShowMoreContentDetails('seventh')}>
                        <p className={`${open['seventh'] ? 'text-gray-400':'text-gray-700'}`}>Where does  {doctorData?.firstName} {doctorData?.lastName}have an office?</p>
                        <MdKeyboardArrowUp className={`transition-transform text-gray-400 text-xl ${open['seventh'] ? 'rotate-180 ease-in' : 'rotate-0 ease-out'}`}/>
                    </div>
                        {showMoreContentDetails['seventh'] && (
                            <div>
                                <p className='text-sm text-gray-700 mb-4'>{doctorData?.firstName} {doctorData?.lastName} is available at the following address: <br />
                                    {doctorData?.address}, {doctorData?.city}
                                </p>
                            </div>
                        )}
                    {/* THIRD QUESTION */}
                    <div className='flex justify-between cursor-pointer gap-2 py-2' onClick={() => handleShowMoreContentDetails('eigth')}>
                        <p className={`${open['eigth'] ? 'text-gray-400':'text-gray-700'}`}>Does {doctorData?.firstName} {doctorData?.lastName}  accept patients online, without having to come to the facility? </p>
                        <MdKeyboardArrowUp className={`transition-transform text-gray-400 text-xl ${open['eigth'] ? 'rotate-180 ease-in' : 'rotate-0 ease-out'}`}/>
                    </div>
                        {showMoreContentDetails['eigth'] && (
                            <div>
                                <p className='text-sm text-gray-700 mb-4'>No, at this time {doctorData?.firstName} {doctorData?.lastName} does not offer online consultations. <br /></p>
                            </div>
                        )}
        
                    {/* FOURTH QUESTION */}
                    <div className='flex justify-between cursor-pointer gap-2 py-2' onClick={() => handleShowMoreContentDetails('nineth')}>
                        <p className={`${open['nineth'] ? 'text-gray-400':'text-gray-700'}`}>
                            How does {doctorData?.firstName} {doctorData?.lastName}  accept payments after the appointmet?
                        </p>
                        <MdKeyboardArrowUp className={`transition-transform text-gray-400 text-xl ${open['nineth'] ? 'rotate-180 ease-in' : 'rotate-0 ease-out'}`}/>
                    </div>
                        {showMoreContentDetails['nineth'] && (
                            <div>
                                <p className='text-sm text-gray-700 mb-4'>The payment methods accepted by {doctorData?.firstName} {doctorData?.lastName} are: Cash, Card payment, Bank transfer, installment payment, and Blik.  <br /></p>
                            </div>
                        )}
                    {/* FIFTH QUESTION 5 */}
                    <div className='flex justify-between cursor-pointer gap-2 py-2' onClick={() => handleShowMoreContentDetails('tenth')}>
                        <p className={`${open['tenth'] ? 'text-gray-400':'text-gray-700'}`}>
                            What languages does {doctorData?.firstName} {doctorData?.lastName}  consult in?
                        </p>
                        <MdKeyboardArrowUp className={`transition-transform text-gray-400 text-xl ${open['tenth'] ? 'rotate-180 ease-in' : 'rotate-0 ease-out'}`}/>
                    </div>
                        {showMoreContentDetails['tenth'] && (
                            <div>
                                <p className='text-sm text-gray-700 mb-4'>The languages spoken by {doctorData?.firstName} {doctorData?.lastName} are: {doctorData?.languages}.  <br /></p>
                            </div>
                        )}
                    {/* SIXTH QUESTION */}
                    <div className='flex justify-between cursor-pointer gap-2 py-2' onClick={() => handleShowMoreContentDetails('eleventh')}>
                        <p className={`${open['eleventh'] ? 'text-gray-400':'text-gray-700'}`}>
                            How does {doctorData?.firstName} {doctorData?.lastName} arrange appointments?
                        </p>
                        <MdKeyboardArrowUp className={`transition-transform text-gray-400 text-xl ${open['eleventh'] ? 'rotate-180 ease-in' : 'rotate-0 ease-out'}`}/>
                    </div>
                        {showMoreContentDetails['eleventh'] && (
                            <div>
                                <p className='text-sm text-gray-700 mb-4'>{doctorData?.firstName} {doctorData?.lastName} uses the Medi-Pulse calendar, which is why you can see current appointments on the website. Just choose the date and time that suit you best. Making an appointment is free, and we will send you a reminder just before the appointment..  <br /></p>
                            </div>
                        )}
                    {/* SEVENTH QUESTION */}
                    <div className='flex justify-between cursor-pointer gap-2 py-2' onClick={() => handleShowMoreContentDetails('twelveth')}>
                        <p className={`${open['twelveth'] ? 'text-gray-400':'text-gray-700'}`}>
                            What are {doctorData?.firstName} {doctorData?.lastName} working hours?
                        </p>
                        <MdKeyboardArrowUp className={`transition-transform text-gray-400 text-xl ${open['twelveth'] ? 'rotate-180 ease-in' : 'rotate-0 ease-out'}`}/>
                    </div>
                        {showMoreContentDetails['twelveth'] && (
                            <div>
                                <p className='text-sm text-gray-700 mb-4'>
                                {doctorData?.firstName} {doctorData?.lastName}
                                may have available dates this week or the coming week.
                                The dates you see in the calendar are available because we update it continuously.
                                If the first available date doesn't work for you,
                                check the next one. Booking a date is immediate, with no additional fees.
                                </p>
                            </div>
                        )}
        
                </section>
                </div>
                 </section>
                {/* FOOTER */}
                <div className='bg-white'>
                    <Footer />
                </div>
        </div>
    </div>
  )
}

export default DoctorPublicProfile
