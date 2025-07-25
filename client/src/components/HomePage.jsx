import { useState, useEffect} from 'react'
import axios from 'axios'
import officeImage from '../assets/thumbs.png'
import doctorBackground2 from '../assets/thumbs1.png'
import doctorBackground from '../assets/thumbs1.png'
import { HiBuildingOffice2 } from "react-icons/hi2"
import { BsCameraReelsFill } from "react-icons/bs"
import { FaThumbsUp } from "react-icons/fa6"
import { BsFileEarmarkPost } from "react-icons/bs"
import onlineImage from '../assets/online-doc.png'
import { FaClock } from "react-icons/fa6"
import { FaSearch } from "react-icons/fa"
import statistic from '../assets/one.jpg'
import LocationSearch from '../components/LocationSearch'
import LocationSearchFree from './LocationSearchFree.jsx'
import MedicalSpecialtyDropdown from '../components/MedicalSpecialtyDropdown'
import useMediaQuery from '../hooks/useMediaQuery'
import { useNavigate } from 'react-router-dom'
import RecentlyJoinedDoctors from './RecentlyJoinedDoctors'
import { Spinner } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleShowMore, toggleShowMoreService, setShowMore, setShowMoreService } from '../redux/shared/visibilitySlice'
import LatestQuestionsFeed from './questions/LatestQuestionsFeed.jsx'
import { ROUTES } from '../config/routes.js'
import DoctorLatestReview from './review/DoctorLatestReview.jsx'
import { times } from 'lodash'



const  HomePage = () => {
    const [formData, setFormData] = useState({})
    const isSmallScreen = useMediaQuery('(max-width: 640px)')
    const isMediumScreen = useMediaQuery('(min-width: 768px)')
    const isLargeScreen = useMediaQuery('(min-width: 1024px)) and (max-width: 1444px)')

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [showMoree, setShowMoree] = useState(true);
    const [showMoreServices, setShowMoreServices] = useState(true)

    const [specialties , setSpecialties] = useState([])
    const [displayedSpecialties, setDisplayedSpecialties] = useState(10); // Number of specialties shown initially
    const [displayedTreatments, setDisplayedTreatments] = useState(10); 
    const [treatments , setTreatments] = useState([])


    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [onlineConsultation, setOnlineConsultation] = useState(false)
    
  
    const backgroundSize = isSmallScreen ? 'cover' : isMediumScreen ? '30%' : '40%'
    const backgroundImage = isSmallScreen ?  doctorBackground2 : doctorBackground
    const backgroundImage2 = isSmallScreen ? onlineConsultation : doctorBackground2

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

    const handleOnlineConsultationToggle = () => {
      setOnlineConsultation(prev => !prev);
      setFormData(prev => ({
        ...prev,
        onlineConsultation: !prev.onlineConsultation
      }));
    }


 
    const handleSearch = async () => {
    if (!formData.speciality && !formData.city) {
      setErrorMessage("Please select at least a specialty or location.");
      return;
    }

  setIsLoading(true);
  setErrorMessage("");

  try {
    const queryParams = new URLSearchParams();
    if (formData.speciality) queryParams.append("specialty", formData.speciality);
    if (formData.city) queryParams.append("location", formData.city);
    if (onlineConsultation) queryParams.append("onlineConsultation", "true");

    const requestUrl = `${API_BASE_URL}/api/doctor-form/search?${queryParams.toString()}`;
    const response = await axios.get(requestUrl);
    const doctors = response.data.doctors || [];

    // Always navigate, even if no doctors
    navigate("/search-results", {
      state: {
        specialty: formData.speciality || "",
        locationQuery: isOnlineSearch ? "" : formData.city || "",
        results: doctors,
        message: doctors.length > 0 ? "" : "No doctors found for the selected criteria.",
        isOnlineSearch: true,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    const errorMsg = error.response?.data?.message || "No doctors found for the selected criteria.";
    console.error("Search Error:", errorMsg);

    //  avigate with empty results
    navigate("/search-results", {
      state: {
        specialty: formData.speciality || "",
        locationQuery: "",
        results: [],
        message: error.response?.data?.message || "No online doctors found.",
        isOnlineSearch: true,
        timestamp: Date.now(),
      },
    });
  } finally {
    setIsLoading(false);
  }
}

    
    useEffect(() => {
      const fetchSpecialties = async () => {
          try {
              const response = await axios.get(`${API_BASE_URL}/api/specialties`);
              setSpecialties(response.data.specialties || []);
             
          } catch (error) {
              console.error("Failed to fetch specialties:", error.response?.data || error.message);
          }
      };
      fetchSpecialties();
    }, []);

    // Fetch Treatments
    useEffect(() => {
      const fetchTreatments = async () => {
          try {
              const response = await axios.get(`${API_BASE_URL}/api/treatments`);
              setTreatments(response.data.treatments || []);
          } catch (error) {
              console.error(" Failed to fetch treatments:", error.response?.data || error.message);
          }
      };
      fetchTreatments();
    }, []);



    const handleToggleExpand = () => dispatch(toggleShowMore());
    const handleToggleExpandService = () => dispatch(toggleShowMoreService())

    
    const handleSpecialitySelect = (SelectedSpeciality) => {
      setFormData({
        ...formData,
        speciality: SelectedSpeciality
      })
    }
  
    const handleInputChange = (field, value) => {
      setFormData({
        ...formData,
        [field]: value,
      })
    }


    const handleShowMore = () => {
      setDisplayedTreatments(treatments.length); // Show all treatments
      setShowMoreServices(false); // Hide "More" button
  }
  
  
    return (
      <div className=' '>
        <section  
          className='pb-14 pt-12 px-2  bg-[#00b39be6] sm:bg-[#00c3a5] sm:py-32 '
          style={{
            backgroundImage: `url(${onlineConsultation ? onlineImage :officeImage })`, //`url(${backgroundImage})`,
            backgroundPosition: isLargeScreen
            ? 'center top'
            : isMediumScreen
            ? 'right top'
            : 'center top',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            opacity: 5,
          }}
        >
  
          <div className=''>
            <div className=' 2xl:w-[85%] md:ml-5  xl:ml-auto'>
              <div className='text-center  sm:text-start b-2 py-3'>
                <h1 className='text-2xl 2xl:text-4xl  sm:max-w-1/2 text-white tracking-wide font-semibold align-baseline py-2'>Find a doctor & make an appointment</h1>
              </div>

              {/* Filter search doctor form */}
              <div className='text-center sm:text-start sm:mb-4 mb-8'>
                <span className='text-[#ffffffe2] text-xl font-medium'>
                  Search among 146,000 doctors.
                </span>
              </div>
            
              <div className="bg-[#00b39b] bg-opacity-50 2xl:w-[70%] md:w-[90%] p-3 rounded-md">
              {/* Toggle Buttons */}
              <div className="flex gap-2 mb-2">
                {/* In the office */}
                <button
                  onClick={() => setOnlineConsultation(false)}
                  className={`flex items-center gap-2 rounded-3xl px-3 py-2 transition 
                    ${!onlineConsultation ? 'bg-white text-blue-500 border border-blue-500' : ' text-white font-extrabold border border-white'}`}
                >
                  <HiBuildingOffice2 className='t' />
                  <span className=''>In the office</span>
                </button>
              
                {/* Online */}
                <button
                  onClick={() => setOnlineConsultation(true)}
                  className={`flex items-center gap-2 rounded-3xl px-3 py-2 transition 
                    ${onlineConsultation ? 'bg-white text-blue-500 border border-blue-500' : 'text-white font-extrabold border border-white'}`}
                >
                  <BsCameraReelsFill />
                  <span>Online</span>
                </button>
              </div>
              
              {/* ===== Search Form (Shared Specialty) ===== */}
              <div className="lg:flex w-full">
                <div
                   className={`mb-4 bg-white ${
                    onlineConsultation ? 'w-full' : 'lg:w-[40%] w-full sm:mr-2'
                }`}
                >
                  <MedicalSpecialtyDropdown
                    className=""
                    options={specialties.map((specialty) => specialty.name)}
                    selected={formData.speciality}
                    onSelect={handleSpecialitySelect}
                    value={formData.speciality}
                    id="speciality"
                    name="speciality"
                  />
                </div>

                {/* Only show location input for in-person */}
                {!onlineConsultation && (
                  <div className="mb-4 lg:w-[40%] grow bg-white">
                    <LocationSearchFree
                      onSelect={(city) => handleInputChange('city', city)}
                      options={formData.city}
                      value={formData.city}
                      id="city"
                      name="city"
                    />
                  </div>
                )}

                <div className="bg-blue-500  flex lg:w-[20%] h-[52px]">
                  <button
                    className="flex w-full text-white justify-center items-center gap-2"
                    onClick={handleSearch}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner show={isLoading} />
                        <span>Searching...</span>
                      </>
                    ) : (
                      <>
                        <FaSearch className="mr-2" />
                        Search
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>


            </div>
          </div>
  
        </section>


          <div>
            {/* Show Loading if Data is Empty */}
            {specialties.length === 0 ? (
                <p className="text-center text-gray-500">Loading specialties...</p>
            ) : (
            showMoree && (
                <div className="container-visible 2xl:w-[70%] md:w-[90%] m-auto p-6 mt-10 rounded-md bg-[#f7f9fa]">
                    <h2 className="text-lg font-semibold mb-4">Medical Specialties</h2>
                    <ul className="flex flex-wrap">
                        {specialties.slice(0, displayedSpecialties).map((specialty, index) => (
                            <li key={specialty._id || index} className="mr-4 hover:underline cursor-pointer">
                                {specialty.name || "Unknown"}
                            </li>
                        ))}
                        {specialties.length > displayedSpecialties && (
                            <li className="mr-4 underline cursor-pointer" onClick={() => setDisplayedSpecialties(specialties.length)}>
                                More
                            </li>
                        )}
                    </ul>
                </div>
            )
        )}

 

        {/*  Show Loading if Data is Empty */}
        <div className="container-visible 2xl:w-[70%] md:w-[90%] m-auto p-6 mt-5 rounded-md bg-[#f7f9fa]">
                    <h2 className="text-lg font-semibold mb-4">Medical Treatments</h2>

                {/* Show treatments if data is available */}
                {treatments.length > 0 ? (
                    <ul className="flex flex-wrap">
                        {treatments.slice(0, displayedTreatments).map((treatment, index) => (
                            <li key={index} className="mr-4 hover:underline cursor-pointer">
                                {typeof treatment === "string" ? treatment : treatment.name || "Unknown Treatment"}
                            </li>
                        ))}
                        
                        {/* Show "More" Button Only If There Are More Treatments */}
                        {showMoreServices && treatments.length > displayedTreatments && (
                            <li 
                                className="mr-4 underline cursor-pointer text-blue-600 font-medium"
                                onClick={handleShowMore}
                            >
                                More
                            </li>
                        )}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500">Loading treatments...</p>
                )}
            </div>

        </div>
        
        <div className=' pb-6 border-b-[.5px] border-gray-200'>
          <div className='lg:w-[70%] md:flex md:wrap md:w-[90%] m-auto px-3  mt-8'>
              <div className='p-3'>
                <div className='flex items-center gap-2 mb-2'>
                  <FaSearch className='text-[#00b39be6]'/>
                  <span className='text-black font-semibold'>Find a specialist</span> 
                </div>
                <p>Choose from over 146,000 doctors and specialists. Browse reviews from other patients.</p>
              </div>
  
              <div className='p-3'>
                <div className='flex items-center gap-2 mb-2'>
                <BsFileEarmarkPost className='text-[#00b39be6]'/>
                  <span className='text-black font-semibold'>Easily book an appointment</span>
                </div>
                <p>Choose a date that suits you, provide your details, confirm... and that's it. Appointment scheduled!</p>
              </div>
  
              <div className='p-3'>
                <div className='flex items-center gap-2'>
                <FaClock className='text-[#00b39be6]'/>
                  <span className='text-black font-semibold'>Come for a visit</span>
                </div>
                <p>We will remind you automatically about the selected date via text message and email.</p>
              </div>
  
              <div className='p-3'>
                <div className='flex items-center gap-2'>
                  <FaThumbsUp className='text-[#00b39be6]'/>
                  <span className='text-black font-semibold'>Free service</span>
                </div>
                <p>Using the Medi-Pulse service is completely free for patients.</p>
              </div>
          </div>
        </div>

        <div className='2xl:w-[70%] lg:flex  m-auto mt-10 gap-8'>
          <div className='lg:w-[50%] lg:mx-4'>
            <span className='ml-4 text-xl font-semibold'>Tips</span>
            <LatestQuestionsFeed />
          </div>
          
          <div className='lg:w-[50%] mx-4'>
          <span className='text-xl font-semibold'>Latest reviews</span>
            <DoctorLatestReview />
          </div>
        </div>
  
        <div className='2xl:w-[70%] md:w-[90%] mx-auto mt-10 '>
          <h2 className='text-2xl font-medium mx-4 lg:mx-0'>Recently joined on Medi-Pulso</h2>
          <div className='mx-4 lg:mx-0'>
            <RecentlyJoinedDoctors />
          </div>
        </div>
         
        <section className='bg-[#e0f7f4] 2xl:w-[70%] md:w-[90%] px-4 py-6 m-auto gap-6 sm:flex sm:p-12 mt-14'>
          <div className='sm:w-[50%]'>
            <img 
              src={statistic} 
              alt=" doctors statistic" 
              className='w-full'
            />
          </div>
          <div className='-4 flex flex-col justify-between'>
            <h2 className='text-black sm:text-2xl my-6'>Do you run your own practice or facility and are looking for new patients?</h2>
            <div className='mb-'>
              <ul className='pl-4 text-gray-500'>
                <li className='list-disc mb-4'>Reach patients who are looking for specialists in your area.</li>
                <li className='list-disc mb-4'>Let them book an appointment at any time of the day or night. No more waiting for the reception to open.</li>
                <li className='list-disc'>Build your online reputation by getting trustworthy reviews.</li>
              </ul>
            </div>
            <button className='bg-blue-500 text-white py-2 px-3 sm:self-start rounded mt-6' type='button'>Discover Medi Pulso Pro</button>
          </div>
  
        </section>
        <hr className='mt-20'/>
      </div>
    )
  }

export default HomePage