import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { Label } from 'flowbite-react'
import MedicalCategoryDropdown from '../components/MedicalCategoryDropdown';
import { Alert, Spinner } from 'flowbite-react'
import LocationSearch from '../components/LocationSearch'


const SignupClinicInfo = () => {
    const [formData, setFormData] = useState({})
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const navigate = useNavigate()


    const handleRadioChange = (e) => {
      const profile = e.target.value
      setFormData({ ...formData, profile })

      // navigate based on the selected profile type
      if (profile === 'facility') {
        navigate('/signup/clinic-form');
      } else if (profile === 'doctor') {
        navigate('/signup/doctor-form');
      } else if (profile === 'patient') {
        navigate('/signup');
      }
    }

    const handleCategorySelect = (category, facility) => {
        setFormData({
          ...formData,
          category, facility
        });
      };

    const numberOfDoctorsAndSpecialist = [
        "1","2","3","4","5","6-10", "11-20", "21-50", "51-100", "101-500", "501-1000"
      ]

      const facilityPrograms = [
         "Blue-note", "Books", "Camarch", "Dr.Eryk", "Dr.Medd", "ereception", "Estomed", "Ezmed", "EUROSODTw"
        ]
  return (
    <div>
         <div className='sm:w-full sm:ml-auto sm:mr-8'>
            <form className='flex flex-col gap-4' >
              <h1 className='text-lg font-semibold'>Select profile type: *</h1>
              {/* <div>
                <Link to='/signup/doctor-form'>
                  <input type='radio' id='doctor' name='profile' value='doctor' />
                  <label htmlFor='doctor' className='ml-2'>medical specialist</label>
                </Link>
              </div>
              <div>
                <Link to='/signup/clinic-form'>
                  <input type='radio' id='facility' name='profile' value='facility' />
                  <label htmlFor='facility' className='ml-2'>medical facility</label>
                </Link>
              </div>
              <div>
                <Link to="/signup">
                  <input type='radio' id='patient' name='profile' value='patient' />
                  <label htmlFor='patient' className='ml-2'>patient</label>
                </Link>
              </div> */}

              <div>
                  <input 
                    type='radio' 
                    id='doctor' 
                    name='profile' 
                    value='doctor'
                    checked={formData.profile === 'doctor'}
                    //onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                    onChange={handleRadioChange}
                  />
                  <label 
                    htmlFor='doctor' 
                    className='ml-2'
                  >
                    medical specialist
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
                    //onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
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
                  />
                  <label 
                    htmlFor='patient' 
                    className='ml-2'
                  >
                    patient
                  </label>
              </div>
            
              
              <div className='flex flex-col w-full mt-8'>
                  <Label value="Name of facility*" />
                  <input
                    type="text"
                    className='rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                    id="surname"
                    
                  />
                </div>
              <div className='mt-4 flex flex-col'>
                <Label 
                    value="Program used by the facility (optional)" 
                    className='mb-3'
                />
                <MedicalCategoryDropdown
                  options={facilityPrograms}
                  selected={formData.category}
                  onSelect={handleCategorySelect}
                />
              </div>

              <div className='flex flex-col w-full'>
                  <Label 
                    value="City*" 
                  />
                  <input
                    type="text"
                    className='rounded-sm border mt-2 text-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out'
                    id="surname"
                    
                  />
                </div>
                <div>
                  <Label value="Address*" />
                  <LocationSearch />
                  {/* <AutoPlacesComplete /> */}
                </div>

                <div className='mt-4 flex flex-col'>
                <Label 
                    value="How many doctors and specialists does the facility employ?*" 
                    className='mb-3'
                />

                <MedicalCategoryDropdown
                  options={numberOfDoctorsAndSpecialist}
                  selected={formData.facility}
                  onSelect={handleCategorySelect}
                  
                />
              </div>
              
            </form>

            {errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )}
    </div>
    </div>
    )

} 




export default SignupClinicInfo