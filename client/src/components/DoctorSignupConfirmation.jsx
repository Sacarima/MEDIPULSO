

import { useState, useEffect } from 'react'
import { BsCheckCircleFill } from "react-icons/bs";
import { BsCircle } from "react-icons/bs";
import DoctorSignupConfirmationHeader from './DoctorSignupConfirmationHeader'
import doctorImg from '../assets/doctornurse.png'
import { signInDoctorSuccess } from '../redux/doctor/doctorSlice'
import Footer from './Footer'
import { ROUTES } from '../config/routes'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const DoctorSignupConfirmation = () => {
  const { currentDoctor } = useSelector(state => state.doctor)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [heardAboutUs, setHeardAboutUs] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

  const data = {
    heardAboutUs
  }

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/auth/me`, { withCredentials: true })
      .then(response => {
        dispatch(signInDoctorSuccess(response.data));
      })
      .catch(error => {
        console.error("Failed to fetch logged-in doctor:", error);
      });
  }, [dispatch]);
  

  
const handleSubmit = async () => {
  if (!heardAboutUs) {
      setErrorMessage('Please select an option');
      return;
  }

  try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await axios.put(
          `${API_BASE_URL}/api/doctor-form/update/${currentDoctor?._id}`,
          { heardAboutUs },
          {
              withCredentials: true, // Ensure cookies are sent with the request
          }
      );

      if (response.status === 200) {
          setSuccessMessage('Your response has been saved successfully!');
          //setTimeout(() => navigate(ROUTES.DOCTOR_PROFILE_COMPLETION), 2000);
      }
  } catch (error) {
      console.error("Error in API request:", error.response); // Log full error response
      setErrorMessage(error.response?.data?.message || 'Failed to save your response. Please try again.')
  } finally {
      setIsSubmitting(false);
  }
}



  return (
    <div className='bg-gray-100 min-h-screen'>
      <DoctorSignupConfirmationHeader />
      <div className='flex flex-col-reverse lg:flex-row lg:w-[70%] mx-auto justify-between mt-10'>
        <section className='lg:w-[90%] grow p-4 '>
          <div className='bg-blue-100 w-16 p-1'>
            <h2 className='text-blue-600'>Congratulations!</h2>
          </div>
          <h1 className='text-2xl'>Your account has been created</h1>
          <div className='mt-10'>
            <span className='font-medium'>How do you know about us?</span>
            <p className='text-[12px] mt-2'>
              Seriously, we are curious – Answer this simple question and help us become better
            </p>
            <select
              value={heardAboutUs}
              onChange={(e) => setHeardAboutUs(e.target.value)}
              className='w-full p-2 mt-3 border-[1px] border-gray-200 rounded'
              disabled={isSubmitting}
            >
              <option value="">--Select--</option>
              <option value="google">Google</option>
              <option value="social media">Social media</option>
              <option value="email">Email</option>
              <option value="friend">From a friend</option>
              <option value="doctor">From another doctor/specialist</option>
              <option value="advertising">From advertising banners</option>
              <option value="other">Other</option>
            </select>
          </div>

          {errorMessage && <p className='text-red-500 mt-2'>{errorMessage}</p>}
          {successMessage && <p className='text-green-500 mt-2'>{successMessage}</p>}

          {/* Submit Button with disabled/loading states */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`mb-5 mt-8 px-3 py-2 rounded text-white
              ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}
            `}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          {/* Loading Spinner (shown only if isSubmitting) */}
          {isSubmitting && (
            <div role="status" className="mt-4">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142
                  100.591 50 100.591C22.3858 100.591
                  0 78.2051 0 50.5908C0 22.9766 22.3858
                  0.59082 50 0.59082C77.6142 0.59082 100
                  22.9766 100 50.5908ZM9.08144 50.5908C9.08144
                  73.1895 27.4013 91.5094 50 91.5094C72.5987
                  91.5094 90.9186 73.1895 90.9186
                  50.5908C90.9186 27.9921 72.5987 9.67226
                  50 9.67226C27.4013 9.67226 9.08144
                  27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393
                  38.4038 97.8624 35.9116 97.0079
                  33.5539C95.2932 28.8227 92.871
                  24.3692 89.8167 20.348C85.8452
                  15.1192 80.8826 10.7238 75.2124
                  7.41289C69.5422 4.10194 63.2754
                  1.94025 56.7698 1.05124C51.7666
                  0.367541 46.6976 0.446843
                  41.7345 1.27873C39.2613 1.69328
                  37.813 4.19778 38.4501
                  6.62326C39.0873 9.04874
                  41.5694 10.4717 44.0505
                  10.1071C47.8511 9.54855
                  51.7191 9.52689 55.5402
                  10.0491C60.8642 10.7766
                  65.9928 12.5457 70.6331
                  15.2552C75.2735 17.9648
                  79.3347 21.5619 82.5849
                  25.841C84.9175 28.9121
                  86.7997 32.2913 88.1811
                  35.8758C89.083 38.2158
                  91.5421 39.6781 93.9676
                  39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          )}

          <div className='bg-white p-4'>
            <span className='font-semibold'>What's next?</span>
          </div>
          <div className='bg-white p-4 border-t-[.5px] border-t-gray-300 rounded-b shadow'>
            <p className='text-[13px]'>Complete your profile to make it easier for patients to choose your practice</p>
            <div className='flex items-center gap-2 mt-5'>
              <BsCheckCircleFill className='text-[#00c3a5]' />
              <p className='line-through text-gray-500'>Create a free account</p>
            </div>
            <div className='flex items-center gap-2 mt-2'>
              <BsCircle className='text-gray-300' />
              <p className='text-gray-500'>Information about the office</p>
            </div>
            <div className='flex items-center gap-2 mt-2'>
              <BsCircle className='text-gray-300'/>
              <p className='text-gray-500'>Information about you</p>
            </div>
            <div className='flex items-center gap-2 mt-2'>
              <BsCircle className='text-gray-300'/>
              <p className='text-gray-500'>Additional functions</p>
            </div>

            <Link to={ROUTES.DOCTOR_PROFILE_COMPLETION}>
              <button className='text-white bg-blue-500 w-full mt-5 mb-2 py-2 rounded'>
                Complete your profile
              </button>
            </Link>
          </div>
        </section>

        <section className="">
          <img src={doctorImg} alt="doctor" className='w-[100%]' />
        </section>
      </div>
      <div className='bg-white mt-16'>
        <Footer />
      </div>
    </div>
  )
}

export default DoctorSignupConfirmation
