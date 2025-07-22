import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { Label } from 'flowbite-react'
import MedicalCategoryDropdown from '../components/MedicalCategoryDropdown';
import { Alert } from 'flowbite-react'
import LocationSearchFree from './LocationSearchFree';


const SignupClinicInfo = ({formData, setFormData, invalidFields, setInvalidFields}) => {
    const [errorMessage, setErrorMessage] = useState(null)
    const navigate = useNavigate()

    // Helper function to determine if a field is valid
    const isFieldInvalid = (field) => invalidFields.includes(field)


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

    const handleCategorySelect = (field, value ) => {
        setFormData({
          ...formData,
          [field]: value,
        });
      };

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

      const numberOfDoctorsSpecialist = [
        "1","2","3","4","5","6-10", "11-20", "21-50", "51-100", "101-500", "501-1000"
      ]

      const facilityProgramsList = [
         "Blue-note", "Books", "Camarch", "Dr.Eryk", "Dr.Medd", "ereception", "Estomed", "Ezmed", "EUROSODTw"
        ]
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
                
              
              <div className='flex flex-col w-full mt-8'>
                  <h2 className='text-2xl font-semibold mb-3'>Branch account details</h2>
                  <Label value="Name of facility*" />
                  <input
                    type="text"
                    className={`block w-full mt-1 px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-300 focus:ring-gray-300 hover:border-gray-400 transition duration-300 ease-in-out rounded-md ${isFieldInvalid('facilityName') ? 'border-red-600' : 'border-gray-300'}`}
                    value={formData['facilityName']}
                    id="facilityName"
                    onChange={(e) => handleInputChange('facilityName', e.target.value)}
                    
                  />
                </div>
              <div className='mt-4 flex flex-col'>
                <Label 
                    value="Program used by the facility (optional)" 
                    className='mb-3'
                />
                
                <MedicalCategoryDropdown
                  options={facilityProgramsList}                       // Pass the list of options
                  selected={formData.facilityPrograms}                // Control the selected value
                  onSelect={(selectedCategory) => handleInputChange('facilityPrograms', selectedCategory)} // Handle selection
                  isInvalid={isFieldInvalid('facilityPrograms')}      // Handle invalid state
                  id='facilityPrograms'                               // Pass any additional props
                  name='facilityPrograms'
                  className={`block w-full mt-1 px-3 py-2 border rounded-md ${isFieldInvalid('facilityPrograms') ? 'border-red-600' : 'border-gray-300'}`}
                />
              </div>

                <div>
                  <Label value="City*" />

                  <LocationSearchFree 
                    isInvalid={isFieldInvalid('city')}
                    onSelect={(city) => handleInputChange('city', city)}
                    options={formData.city}
                    value={formData.city}
                    className={`block w-full mt-1 px-3 py-2 rounded-md border ${isFieldInvalid('city') ? 'border-red-600' : 'border-gray-300'}`}
                    id="city"
                    name="city"
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                  {/* <AutoPlacesComplete /> */}
                </div>
                <div className='mt-4 flex flex-col'>
                <Label 
                    value="How many doctors and specialists does the facility employ?*" 
                    className='mb-3'
                />

              <MedicalCategoryDropdown
                options={numberOfDoctorsSpecialist}
                selected={formData.numberOfDoctorsSpecialist}
                onSelect={(numberOfDoctorsSpecialist) => handleInputChange('numberOfDoctorsSpecialist', numberOfDoctorsSpecialist)}
                isInvalid={isFieldInvalid('numberOfDoctorsSpecialist')}
                id="numberOfDoctorsSpecialist"
                name="numberOfDoctorsSpecialist"
                className={`block w-full mt-1 px-3 py-2 border rounded-md ${isFieldInvalid('numberOfDoctorsSpecialist') ? 'border-red-600' : 'border-gray-300'}`}
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