import { useState, useEffect } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'



const DoctorServices = ({  handleNext, handleBack, setServices }) => {
  const { currentDoctor } = useSelector((state) => state.doctor)
  const [treatments, setTreatments] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [customService, setCustomService] = useState([])
  const [errors, setErrors ] = useState(false)

  useEffect(() => {
    if (currentDoctor?.medicalCategory) {
        fetchTreatments(currentDoctor.medicalCategory);
    }
}, [currentDoctor])



const fetchTreatments = async (medicalCategory) => {
  try {
      const response = await axios.get(`http://localhost:7500/api/specialties/treatments/${medicalCategory}`);
      if (response.data.success) {
          setTreatments(response.data.treatments);
      } else {
          setErrors('No treatments found for this specialty.');
      }
  } catch (error) {
      setErrors('Failed to fetch treatments. Please try again.');
  }
}

const handleCheckboxChange = (service) => {
  if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
  } else {
      setSelectedServices([...selectedServices, service]);
  }
};

const handleAddCustomService = () => {
  if (customService.trim() && !selectedServices.includes(customService)) {
      setSelectedServices([...selectedServices, customService.trim()])
      setTreatments([...treatments, customService.trim()])
      setCustomService('');
  }
}

const handleNextStep = () => {
  if (selectedServices.length === 0) {
      setErrors('Please select at least one service.');
      return;
  }

  setErrors(''); 
  setServices(selectedServices); 
  handleNext();  
}


  return (
    <div>
        <section className='lg:pr-24 p-6 mt-4 lg:mt-24 '>
        <h2 className='text-3xl'>Select the services you provide</h2>
        <p className='text-sm my-4 text-gray-400'>The form includes the most popular services for your specialization. If a service is missing , add it to the list</p>
        
        <span className='font-medium'>Select services</span>
       
        {/* Display fetched treatments & added custom services */}
        {errors && <p className="text-red-500">{errors}</p>}
                <div className='mt-4'>
                    {treatments.map((service, index) => (
                        <div key={index} className='flex items-center gap-2 mt-2'>
                            <input
                                type="checkbox"
                                id={`service-${index}`}
                                name="service"
                                className='rounded mt-2 text-3xl p-2 mb-2'
                                checked={selectedServices.includes(service)}
                                onChange={() => handleCheckboxChange(service)}
                            />
                            <label htmlFor={`service-${index}`} className=''>{service}</label>
                        </div>
                    ))}
                </div>


              {/* Input for custom service */}
              <div className='mt-5'>
                    <input
                        type="text"
                        className="border border-gray-300 p-2 rounded w-full"
                        placeholder="Add a custom service..."
                        value={customService}
                        onChange={(e) => setCustomService(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
                        onClick={handleAddCustomService}
                    >
                        Add Service
                    </button>
                </div>
            
          
          <div className='flex justify-between items-end mt-5'>
            <button 
                 className=' text-gray-500 border-[1px] w-24 mt-5 mb-2 py-2 rounded shadow-md'
                onClick={handleBack}
            >
                Back
            </button>
            <button
              className='text-white bg-blue-500 w-24 mt-5 mb-2 py-2 rounded'
              onClick={handleNextStep}
              
            >
                Next
            </button>
          </div>
        
      </section>
    </div>
  )
}

export default DoctorServices
