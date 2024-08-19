import { useState, useEffect} from 'react'
import { Alert, Label, Spinner } from 'flowbite-react'
import { TbStarsFilled } from "react-icons/tb"
import { HiMiniUsers } from "react-icons/hi2"
import { TiTick } from "react-icons/ti"
import { IoDiamond } from "react-icons/io5"
import { MdOutlineStarPurple500 } from "react-icons/md"
import SignupDoctorInfo from '../components/SignupDoctorInfo'
import SignupDoctorMoreInfo from '../components/SignupDoctorMoreInfo'
import SignupClinicInfo from '../components/SignupClinicInfo'
import SignupClinicMoreInfo from '../components/SignupClinicMoreInfo'
import DoctorHeader from '../components/DoctorHeader'
import doctorImg from '../assets/doc.jpg'
import doctorImage from '../assets/doc-1.jpg'

const ClinicForm = () => {

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    medicalCategory: '',
    city: '',
    profile: 'patient',
    countryCode: '',
    phoneNumber: '',
    email: '',
    password: '',
    termsConditions: false,
    profileStatistcs: false,

  })
  const [page, setPage] = useState(0)
  const titles = ['Personal information', 'Complete the details' ]

  const PageDisplay = () => {
    if (page === 0) {
      return <SignupClinicInfo formData={formData} setFormData={setFormData}/>
    } else if (page === 1) {
      return <SignupClinicMoreInfo formData={formData} setFormData={setFormData}/>
    }
  }


  // Set the default profile based on the page
  // useEffect(() => {
  //   if (page === 0) {
  //     setFormData((prevData) => ({ ...prevData, profile: 'doctor' }));
  //   } else if (page === 1) {
  //     setFormData((prevData) => ({ ...prevData, profile: 'facility' }));
  //   }
  // }, [page]);


  return (
    <div className=''>
        <DoctorHeader />
        
        <div className='w-full sm:flex h-screen min-h-full md:h-screen '>
           <div className='sm:w-[55%] p-4'>
                <div className=' sm:w-[70%] sm:ml-auto sm:mr-9 sm:mt-8'>
                  
                  <div>
                      <h1 className='text-2xl sm:w-full font-semibold pb-3 sm:text-start'>{titles[page]}</h1>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-600">
          <div
          className="bg-green-600 p-0.5 mb-2 text-center text-xs font-medium leading-none text-slate-100"
          style={{ width: "25%" }}
          >
          25%
          </div>
          </div>
                      <div className='sm:mt-2'>{PageDisplay()}</div>
                  </div>
                  <div className='flex  flex-col sm:flex sm:flex-col gap-3 sm:w-full sm:ml-auto sm:mr-8'>
                      <div className='sm:flex flex gap-2 mt-6 w-full'>
                        <button
                        className='bg-blue-500 w-full text-white px-4 py-2 rounded-sm'
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                            style={{ display: page === 0 ? 'none' : 'block' }}
                        >
                            Prev
                        </button>
                        <button
                        className='bg-blue-500 w-full text-white px-4 py-2 rounded-sm'
                            onClick={() => setPage(page + 1)}
                            disabled={page === titles.length - 1}
                        >
                            {page === titles.length - 1 ? 'Submit' : 'Next'}
                        </button>
                      </div>
                      <span className='text-center  text-gray-400 pb-3'>*Required fields</span>
                  </div>
                </div>
            </div>

           { page === 0 && ( 
              <div className=' sm:w-[45%]'>
                <section className='bg-gray-100 sm:h-screen sm:w-full' style={{ display: page === 1 ? 'none' : 'block'}}>
                <div className='sm:max-w-[80%] xl:[85%] lg:w-[80%] p-4 pb-36 sm:p-12'>
                <div className='flex flex-col sm:max-w-[75%]'>
                  <div className='flex'>
                    <TbStarsFilled className='text-5xl text-teal-500' />
                    <div className='flex flex-col pl-2 pb-4'>
                      <span className='font-semibold'>Join over 22,000 medical offices and facilities!</span>
                      <span className='text-gray-500 text-sm'>Create a free account and develop your office with us!</span>
                    </div>
                  </div>
                  <div className='flex justify-start'>
                    <HiMiniUsers className='text-6xl text-teal-500' />
                    <div className='flex flex-col pl-2 pb-4'>
                      <span className='font-semibold'>Be found by over 13 million patients.</span>
                      <span className='text-gray-500 text-sm'>Showcase your doctors and make it easier for patients to find your facility.</span>
                    </div>
                  </div>
                  <div className='flex justify-start'>
                    {/* <IoDiamond className='text-4xl text-teal-500' /> */}
                    <TiTick className='text-6xl text-teal-500'/>
                    <div className='flex flex-col pl-2'>
                      <span className='font-semibold'>Make it easier for patients to get to your facility.</span>
                      <span className='text-gray-500 text-sm'>Reduce the number of patients who forget about appointments by up to 65%.</span>
                    </div>
                  </div>
                </div>
                </div>
            </section>
            </div>
           )}
            
            { page === 1 && (
              <div className='sm:w-[45%]'>
              <section
                className='bg-gray-100 sm:h-screen sm:w-full'
                style={{ display: page === 0 ? 'none' : 'block'}}
              >
                <div className='sm:w-[60%] xl:[85%] md lg:w-[80%] p-4 pb-36 sm:p-12'>
                <div className='flex flex-col sm:max-w-[75%]'>
                <h3 className='text-lg font-semibold'>How do we help our specialists?</h3>
                <p className='text-[0.9rem] italic mt-3'>The appointment management system is a really convenient solution - I no longer have to deal with a constantly ringing phone. Medi-Pulso offers real support for busy doctors.</p>
                  <div className='flex mt-4 '>
                    <div className='pr-4'>
                      <img src={doctorImage} alt="doctors image" style={{height: '100px', width: '70px', borderRadius: '10px'}}/>
                    </div>
                    <div className=''>
                      <h3 className='text-blue-500 mt-4 mb-2 text-xl'>Marina Punhao</h3>
                      <span className=''>physiotherapist, Elk</span>
                      <div className='flex items-center gap-2'>
                        <div className='flex mt-1'>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                        </div>
                        
                        <span className='mt-'>1547 reviews</span>
                      </div>
                    </div>
                  </div>

                  <div className='border-b-[1px] mt-8'></div>
                  <p className='text-[0.9rem] italic mt-6'>Right after I launched Calendar, my work became easier and I had more time for other activities. Patients had access to all appointments and I didn't have to worry about registration.</p>
                  <div className='flex mt-4'>
                    <div className='pr-4'>
                      <img src={doctorImg} alt="doctors image" style={{height: '100px', width: '70px', borderRadius: '10px'}}/>
                    </div>
                    <div className=''>
                      <h3 className='text-blue-500 mt-4 mb-2 text-xl'>Lukasz Klos</h3>
                      <span className=''>family doctor, Wejherowo</span>
                      <div className='flex items-center gap-2'>
                        <div className='flex mt-1'>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                          <MdOutlineStarPurple500 className='text-xl text-green-400'/>
                        </div>
                        
                        <span className='mt-'>392 reviews</span>
                      </div>
                    </div>
                  </div>
                
                </div>
                </div>
              </section>
            </div>
          )}

        </div>
    </div>
  )
}

export default ClinicForm