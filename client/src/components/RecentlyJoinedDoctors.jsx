import { useState, useEffect} from 'react'
import { MdLocationOn } from 'react-icons/md'
import Slider from 'react-slick'
import { useNavigate } from 'react-router-dom'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import '../styles/CustomCarousel.css'


const  RecentlyJoinedDoctors = () => {
    const [recentDoctors, setRecentDoctors] = useState([])
    const navigate = useNavigate()

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

    useEffect(() => {
        const fetchRecentDoctors = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/doctor-form/recently-added-public`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
    
                if (!response.ok) {
                    throw new Error(`HTTP Error! status: ${response.status}`)
                }
    
                const data = await response.json()
                //setRecentDoctors(data)
                if (Array.isArray(data)) {
                  setRecentDoctors(data);  // If it's an array, set it to state
              } else if (data && Array.isArray(data.data.doctors)) {
                  setRecentDoctors(data.data.doctors); // Update this based on actual structure
              } else {
                  console.error('Unexpected data format:', data);
              }
            } catch (error) {
                console.error('Failed to fetch recent doctors:', error)
            }
        }
        fetchRecentDoctors()
    }, [])


  const handleDoctorProfile = (doctor) => {
    
    // navigate(`/profile-info/${doctor._id}`)
    const profileUrl = `/profile-info/${doctor._id}`;

    // Use window.location to navigate and reload the page
    window.location.href = profileUrl;
    
}

  

    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1
              }
            }
          ],
      }


  return (
    <div className=' mt-4'>
        <Slider {...settings}>
        {recentDoctors.map((doctor) => (
            <div key={doctor._id} className='carousel-slide' onClick={() => handleDoctorProfile(doctor)}>
                <div  className='bg-white flex items-center gap-2 shadow-sm  transition-shadow overflow-hidden border-gray-200 border p-3 rounded-lg w-full sm:w-full'>
                <img
                    src={doctor.profilePicture || doctorImage}
                    alt={`Doctor ${doctor.firstName} ${doctor.lastName}`}
                    className='w-[70px] h-[70px] rounded-full object-cover cursor-pointer'
                />
                <div>
                    <div className='flex items-center gap-2 mt-3'>
                    <span className='text-sm text-gray-500'>Dr. </span>
                    <span className='text-md font-semibold hover:underline hover:cursor-pointer' onClick={() => handleDoctorProfile(doctor)}>{doctor.firstName} {doctor.lastName}</span>
                    </div>
                    <span className='text-[13.5px]'>{doctor.medicalCategory}</span>
                    <div className='flex items-center gap-1 mt-1'>
                    <MdLocationOn className='text-gray-400'/>
                    <span className='text-sm text-gray-500'>{doctor.city}, Poland</span>
                    </div>
                    <span className='text-blue-800 cursor-pointer' onClick={() => handleDoctorProfile(doctor)}>Show profile</span>
                </div>
                </div>
            </div>))}
        </Slider>
  </div>
  )
}

export default RecentlyJoinedDoctors