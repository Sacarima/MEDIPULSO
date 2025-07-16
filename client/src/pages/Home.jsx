import { useState, useEffect} from 'react'
import Header from '../components/Header'
import doctorBackground from '../assets/thumbs.png'
import doctorBackground2 from '../assets/thumbs1.png'
import { HiBuildingOffice2 } from "react-icons/hi2"
import { BsCameraReelsFill } from "react-icons/bs"
import { FaThumbsUp } from "react-icons/fa6"
import { BsFileEarmarkPost } from "react-icons/bs"
import { FaClock } from "react-icons/fa6"
import { FaSearch } from "react-icons/fa"
import statistic from '../assets/one.jpg'
import LocationSearch from '../components/LocationSearch'
import MedicalSpecialtyDropdown from '../components/MedicalSpecialtyDropdown'
import useMediaQuery from '../hooks/useMediaQuery'
//import RecentlyJoinedDoctorsCarousel from '../components/RecentlyJoinedDoctorsCarousel'
import RecentlyJoinedDoctors from '../components/RecentlyJoinedDoctors'
import Footer from '../components/Footer'






export default function Home() {
  const [formData, setFormData] = useState({})
  const isSmallScreen = useMediaQuery('(max-width: 640px)')
  const isMediumScreen = useMediaQuery('(min-width: 641px)) and (max-width: 1024px)')
  const isLargeScreen = useMediaQuery('(min-width: 1025px)')

  const backgroundSize = isSmallScreen ? 'cover' : isMediumScreen ? '30%' : '40%'
  const backgroundImage = isSmallScreen ? doctorBackground2 : doctorBackground

  
  const medicalSpecialties = [
    "Allergy",
    "Anesthesiology",
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Endocrinology",
    "Family Medicine",
    "Gastroenterology",
    "General Surgery",
    "Geriatrics",
    "Hematology",
    "Infectious Disease",
    "Internal Medicine",
    "Nephrology",
    "Neurology",
    "Neurosurgery",
    "Obstetrics and Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedic Surgery",
    "Otolaryngology (ENT)",
    "Pathology",
    "Pediatrics",
    "Plastic Surgery",
    "Psychiatry",
    "Pulmonology",
    "Radiation Oncology",
    "Radiology",
    "Rheumatology",
    "Sports Medicine",
    "Thoracic Surgery",
    "Urology",
    "Vascular Surgery"
  ];
  
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


  return (
    <div className=' '>
      <Header />
      <section  
        className='pb-14 pt-12 px-2  bg-[#00b39be6] sm:bg-[#00c3a5] sm:py-32 '
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: isSmallScreen ? 'center top' : '80% bottom',
          backgroundRepeat: 'no-repeat',
          backgroundSize: backgroundSize,
        }}
      >

        <div className=''>
          <div className='sm:w-[70%] m-auto'>
            <div className='text-center  sm:text-start b-2 py-3'>
              <h1 className='text-2xl sm:text-4xl sm:max-w-1/2 text-white tracking-wide font-semibold align-baseline py-2'>Find a doctor & make an appointment</h1>
            </div>
            <div className='text-center sm:text-start sm:mb-4 mb-8'>
              <span className='text-[#ffffffe2] text-xl font-medium'>
                Search among 146,000 doctors.
              </span>
            </div>
            <div className='bg-[#00b39b] bg-opacity-50 sm:w-[70%] p-3 rounded-md'>
                <div className='flex gap-2 mb-2'>
                  <div className='flex  items-center gap-2 bg-white rounded-3xl px-3 py-2'>
                    <HiBuildingOffice2 className='text-blue-500'/>
                    <span>In the office</span>
                  </div>
                  <div className='flex border-[1px] text-white items-center gap-[4px] rounded-3xl px-3 py-2 border-white'>
                    <BsCameraReelsFill />
                    <span>Online</span>
                  </div>
                </div>

                <div className='lg:flex '>
                  
                  <div className='mb-2 sm:w-[40%] sm:mr-2 bg-white'>
                    <MedicalSpecialtyDropdown 
                      className=""
                      options={medicalSpecialties}
                      selected={formData.speciality}
                      onSelect={handleSpecialitySelect}
                      value={formData.speciality}
                      id='speciality'
                      name='speciality'
                    />
                  </div>

                  <div className='mb-2 lg:w-[40%] bg-white'>
                    <LocationSearch 
                      //isInvalid={isFieldInvalid('city')}
                      onSelect={(city) => handleInputChange('city', city)}
                      options={formData.city}
                      //onSelect={(city) => handleInputChange('city', city)}
                      value={formData.city}
  
                      id="city"
                      name="city"
                    />
                  </div>
                  <div className='bg-blue-500 flex sm:w-[20%] h-[55px]'>
                    <button className='flex w-full text-white justify-center items-center '>
                      <FaSearch className='mr-2' />
                      Search
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>

      </section>

      <div className='sm:w-[70%] m-auto p-6 mt-10 rounded-md bg-[#f7f9fa]'>
        <ul className='flex flex-wrap'>
          <li className=' mr-4'>Gynocologist</li>
          <li className=' mr-4'>Orthopaedist</li>
          <li className=' mr-4'>Psychologist</li>
          <li className=' mr-4'>Dentist</li>
          <li className=' mr-4'>Psychiatrist</li>
          <li className=' mr-4'>Dermatologist</li>
          <li className=' mr-4'>Surgeon</li>
          <li className=' mr-4'>Laryngologist</li>
          <li className=' mr-4'>Physiotherapist</li>
          <li className=' mr-4'>Neurologist</li>
          <li className=' mr-4'>Eye doctor</li>
          <li className=' mr-4'>Pediatrician</li>
          <li className=' mr-4'>Urologist</li>
          <li className=' mr-4'>Cardiologist</li>
          <li className=' mr-4'>Dietician</li>
          <li className=' mr-4'>More...</li>
        </ul>
      </div>

      <div className='sm:w-[70%] m-auto p-6 mt-5 rounded-md bg-[#f7f9fa]'>
        <ul className='flex flex-wrap'>
          <li className=' mr-4'>Teeth whiting</li>
          <li className=' mr-4'>Ultrasound</li>
          <li className=' mr-4'>Rehabilitation</li>
          <li className=' mr-4'>Massage</li>
          <li className=' mr-4'>Abdominal ultrasound</li>
          <li className=' mr-4'>Echo of the heart</li>
          <li className=' mr-4'>Holter ekg</li>
          <li className=' mr-4'>Computed tomography</li>
          <li className=' mr-4'>Spirometry</li>
          <li className=' mr-4'>Gastroscopy</li>
          <li className=' mr-4'>Petranal tests</li>
          <li className=' mr-4'>Colonoscopy</li>
          <li className=' mr-4'>Magnetic resonance Imaging</li>
          <li className=' mr-4'>Laser hair removal</li>
          <li className=' mr-4'>More...</li>
        </ul>
      </div>

      <div className=' pb-6'>
        <div className='sm:w-[70%] m-auto px-3 sm:flex mt-8'>
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

      <div className='sm:w-[70%] m-auto mt-10'>
        <h2 className='text-2xl font-medium'>Recently joined on Medi-Pulso</h2>
        <div className=''>
          <RecentlyJoinedDoctors/>
        </div>
      </div>
       
      <section className='bg-[#e0f7f4] sm:w-[70%] px-4 py-6 m-auto gap-6 sm:flex sm:p-12 mt-14'>
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
      <hr className='mt-12'/>
      <Footer />
    </div>
  )
}
