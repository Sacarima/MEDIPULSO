
import { useState } from 'react';
import { Alert, Label, Spinner } from 'flowbite-react';
import { TbStarsFilled } from "react-icons/tb";
import { HiMiniUsers } from "react-icons/hi2";
import { IoDiamond } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import DoctorHeader from '../components/DoctorHeader';
import MedicalCategoryDropdown from '../components/MedicalCategoryDropdown';

export default function SignDoctor() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    category: '',
    city: '',
    phoneNumber: '',
    medicalCategories: [],
    termsConditions: false,
    profileStatistics: {
      patients: 0,
      opinions: 0,
      visits: 0,
      recommendations: 0
    },
    selectAll: false,
     // Add category to the formData state
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value.trim()
    });
  };

  const handleCategorySelect = (category) => {
    setFormData({
      ...formData,
      category
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.username === '' || formData.email === '' || formData.password === '' || formData.category === '') {
      return setErrorMessage('Please fill in all fields');
    }
    if (formData.email.indexOf('@') === -1) {
      return setErrorMessage('Please enter a valid email');
    }
    if (formData.password.length < 6) {
      return setErrorMessage('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success === false) {
        setErrorMessage(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      if (response.ok) {
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  const medicalCategories = [
    "Dentist", "Cardiologist", "Dermatologist", "Gynecologist",
    "Neurologist", "Ophthalmologist", "Orthopedist", "Pediatrician",
    "Psychiatrist", "Surgeon", "Urologist", "Allergist",
    "Endocrinologist", "Gastroenterologist", "Hematologist",
    "Nephrologist", "Oncologist", "Otolaryngologist", "Pulmonologist",
    "Rheumatologist", "Radiologist", "Anesthesiologist", "Emergency physician",
    "Family physician", "Internist", "Physical therapist", "Occupational therapist",
    "Speech therapist", "Nutritionist", "Psychologist", "Pharmacist",
    "Nurse", "Midwife", "Paramedic", "Medical assistant",
    "Medical laboratory scientist", "Radiologic technologist", "Phlebotomist",
    "Medical coder", "Medical transcriptionist", "Health information technician",
    "Health educator", "Medical illustrator", "Medical writer", "Medical librarian",
    "Medical interpreter", "Medical scribe", "Medical ethicist",
    "Bariatrician", "Geriatrician", "Hospitalist"
  ];

  return (
    <>
      <DoctorHeader />
      
      <div className='min-h-screen w-full sm:flex'>
        <div className='w-full bg-white p-4 sm:p-12'>
          <div className='sm:w-[70%] sm:ml-auto sm:mr-8'>
          <div className="w-full bg-neutral-200 dark:bg-neutral-600">
          <div
          className="bg-green-600 p-0.5 mb-2 text-center text-xs font-medium leading-none text-slate-100"
          style={{ width: "25%" }}
          >
          25%
          </div>
      </div>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
              <h1 className='text-2xl font-semibold'>Select profile type: *</h1>
              <div>
                <input type='radio' id='doctor' name='profile' value='doctor' />
                <label htmlFor='doctor' className='ml-2'>medical specialist</label>
              </div>
              <div>
                <input type='radio' id='facility' name='profile' value='facility' />
                <label htmlFor='facility' className='ml-2'>medical facility</label>
              </div>
              <div>
                <Link to="/signup">
                  <input type='radio' id='patient' name='profile' value='patient' />
                  <label htmlFor='patient' className='ml-2'>patient</label>
                </Link>
              </div>

              <div className='mt-8 flex flex-col'>
                <Label value="Main medical category" />
                <MedicalCategoryDropdown
                  options={medicalCategories}
                  selected={formData.category}
                  onSelect={handleCategorySelect}
                />
              </div>

              <div className='flex justify-between w-full'>
                <div className='flex flex-col w-[46%]'>
                  <Label value="Name*" />
                  <input
                    type="text"
                    className='rounded-sm border text-sm mt-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                    placeholder="Name"
                    id="username"
                    onChange={handleChange}
                  />
                </div>
                <div className='flex flex-col w-[46%]'>
                  <Label value="Last name*" />
                  <input
                    type="text"
                    className='rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                    placeholder="Last name"
                    id="surname"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button
                className="w-full flex justify-center mt-2 items-center py-2 px-4 rounded-sm bg-blue-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-blue-600 hover:bg-blue-700 hover:text-white hover:shadow-lg transition duration-300 ease-in-out"
                type='submit'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : (
                  'Next step'
                )}
              </button>
              <span className='text-center text-gray-400'>*Required fields</span>
            </form>

            {errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>

        <section className='bg-gray-100 sm:w-[80%]'>
          <div className='sm:w-[60%] xl:[85%] lg:w-[80%] p-4 pb-36 sm:p-12'>
            <div className='flex flex-col'>
              <div className='flex'>
                <TbStarsFilled className='text-4xl text-teal-500' />
                <div className='flex flex-col pl-2 pb-4'>
                  <span className='font-semibold'>Join over 170,000 doctors</span>
                  <span className='text-gray-500 text-sm'>Create a free account and develop your office with us!</span>
                </div>
              </div>
              <div className='flex justify-start'>
                <HiMiniUsers className='text-4xl text-teal-500' />
                <div className='flex flex-col pl-2 pb-4'>
                  <span className='font-semibold'>Let yourself be found by over 14 million patients</span>
                  <span className='text-gray-500 text-sm'>Promote your services and make it easier for patients to reach your office.</span>
                </div>
              </div>
              <div className='flex justify-start'>
                <IoDiamond className='text-4xl text-teal-500' />
                <div className='flex flex-col pl-2'>
                  <span className='font-semibold'>Take care of your reputation on the Internet</span>
                  <span className='text-gray-500 text-sm'>Create a professional business card and stand out among specialists in your area.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}