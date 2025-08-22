import { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { Label } from 'flowbite-react'
import MedicalCategoryDropdown from '../components/MedicalCategoryDropdown';
import { Alert, Spinner } from 'flowbite-react';
//import { medicalCategories } from '../data/medicalCategories'
import axios from 'axios';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// UPDATE WITH REDUX FOR STATE MANAGEMENT

const SignupDoctorInfo = ({formData, setFormData, invalidFields, isInvalid, setInvalidFields}) => {
    //Helper function to determine if a field is invalid
    const isFieldInvalid = (field) => invalidFields.includes(field)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [specLoading, setSpecLoading] = useState(true)
    const [specError, setSpecError] = useState(null)
    const [specialtyOptions, setSpecialtyOptions] = useState([])

    const navigate = useNavigate()

    const handleRadioChange = (e) => {
      const profile = e.target.value
      setFormData({ ...formData, profile })

      // navigate based on the selected profile type
      if (profile === 'doctor') {
        navigate('/signup/doctor-form');
      } else if (profile === 'facility') {
        navigate('/signup/clinic-form');
      } else if (profile === 'patient') {
        navigate('/signup');
      }
    }

    const handleCategorySelect = (selectedCategory) => {
        setFormData({
          ...formData,
          medicalCategory: selectedCategory
        })
      }

      const handleInputChange = (field, value) => {
        setFormData({
          ...formData,
          [field]: value,
        })
      
        // Remove the field from invalidFields when the user starts typing
        if (invalidFields.includes(field) && value.trim() !== '') {
          setInvalidFields(invalidFields.filter((item) => item !== field));
        }
      }

      // Toggle the checkbox when a individual checkbox is clicked
      const handleCheckbox = (e) => {
        const { name, checked } = e.target
        setFormData({
          ...formData,
          [name]: checked,
        })
      }

      useEffect(() => {
      let cancelled = false;
      const fetchSpecialties = async () => {
        try {
          setSpecLoading(true);
          setSpecError(null);

          const res = await axios.get(`${API_BASE_URL}/api/specialties`, { withCredentials: true });

          // Expecting: res.data.specialties = array of { _id, name } or strings
          const raw = res?.data?.specialties ?? [];
          const normalized = raw
            .map(s => {
              if (typeof s === 'string') return s.trim();
              if (s && typeof s === 'object') return s.name ?? s.title ?? s.label ?? '';
              return '';
            })
            .filter(Boolean);

          if (!cancelled) setSpecialtyOptions(normalized);
        } catch (err) {
          if (!cancelled) setSpecError(err?.response?.data?.message || 'Failed to fetch specialties');
          console.error('Failed to fetch specialties:', err?.response?.data || err?.message);
        } finally {
          if (!cancelled) setSpecLoading(false);
        }
      };
      fetchSpecialties();
      return () => { cancelled = true; };
    }, []);

        


  return (
    <div>
         <div className='sm:w-full sm:ml-auto sm:mr-8'>
            <form className='flex flex-col gap-4' >
              <h1 className='text-lg font-semibold'>Select profile type: *</h1>
              <div>
                  <input 
                    type='radio' 
                    id='doctor' 
                    name='profile' 
                    value='doctor'
                    checked={formData.profile === 'doctor'}
                    onChange={handleRadioChange}
                    className='cursor-pointer'
                  />
                  <label 
                    htmlFor='doctor' 
                    className='ml-2'
                  >
                    doctor / specialist
                  </label>
                
              </div>
              <div>
                  <input 
                    type='radio' 
                    id='facility' 
                    name='profile' 
                    value='facility'
                    checked={formData.profile === 'facility'}
                    onChange={handleRadioChange}
                    className='cursor-pointer'
                  />
                  <label 
                    htmlFor='facility' 
                    className='ml-2'
                  >
                    medical facility
                  </label>
              </div>
              <div>
                  <input 
                    type='radio' 
                    id='patient' 
                    name='profile' 
                    checked={formData.profile === 'patient'}
                    onChange={handleRadioChange}
                    value='patient'
                    className='cursor-pointer'
                  />
                  <label 
                    htmlFor='patient' 
                    className='ml-2'
                  >
                    patient
                  </label>
              </div>

              <div className='mt-8 flex flex-col'>
                <Label 
                  value="Main medical category" 
                  className='mb-2'
                />
                <MedicalCategoryDropdown
                  options={specialtyOptions}
                  selected={formData.medicalCategory}
                  onSelect={(selectedCategory) => handleInputChange('medicalCategory', selectedCategory)}
                  isInvalid={isFieldInvalid('medicalCategory')}
                  value={formData.medicalCategory}
                  id='medicalCategory'
                  name='medicalCategory'
                  className={`block w-full mt-1 px-3 py-2 border rounded-md ${isFieldInvalid('medicalCategory') ? 'border-red-500' : 'border-gray-300'}`}
                  onChange={(e) => setFormData({ ...formData, medicalCategory: e.target.value })}
                  disabled={specLoading || !!specError}
                  placeholder={specLoading ? 'Loading specialties...' : (specError ? 'Could not load specialties' : 'Select a specialty')}
                />
              </div>

              <div className='flex justify-between w-full'>
                <div className='flex flex-col w-[46%]'>
                  <Label 
                    value="Name*" 
                  />
                  <input
                    type="text"
                    className={`block w-full mt-1 px-3 py-2 border rounded-md ${isFieldInvalid('firstName') ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Name"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    
                  />
                </div>
                <div className='flex flex-col w-[46%]'>
                  <Label 
                    value="Last name*" 
                  />
                  <input
                    type="text"
                    className={`block w-full mt-1 px-3 py-2 border rounded-md ${isFieldInvalid('lastName') ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Last name"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    
                  />
                </div>
              </div>

            </form>

            {specError && (
              <Alert className='mt-3' color='warning'>
                {String(specError)}
              </Alert>
            )}
    </div>
    </div>
    )

} 




export default SignupDoctorInfo