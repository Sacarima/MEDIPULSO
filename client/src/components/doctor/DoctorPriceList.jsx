import { useState, useEffect} from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const DoctorPriceList = ({  handleNext, handleBack, setPriceList }) => {
    const { currentDoctor } = useSelector((state) => state.doctor);
    const [treatments, setTreatments] = useState([]);
    const [selectedPrices, setSelectedPrices] = useState({});
    const [errors, setErrors] = useState('');

    useEffect(() => {
        if (currentDoctor?.medicalCategory) {
            fetchTreatments(currentDoctor.medicalCategory);
        }
    }, [currentDoctor]);

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

    // Function to handle service selection
    const handleCheckboxChange = (service) => {
        setSelectedPrices(prev => {
            const updated = { ...prev };
            if (updated[service]) {
                delete updated[service];  // Remove if already selected
            } else {
                updated[service] = '';  // Add with an empty price
            }
            return updated;
        });
    }

    //Handle price input change
    const handlePriceChange = (service, value) => {
        setSelectedPrices(prev => ({
            ...prev,
            [service]: value
        }));
    };

    const handleNextStep = () => {
        const validEntries = Object.keys(selectedPrices).filter(service => selectedPrices[service]?.trim() !== '');

        if (validEntries.length === 0) {
            setErrors('Please select at least one service and provide a price.');
            return;
        }

        setErrors('');
        setPriceList(selectedPrices);
        handleNext();
    }



  return (
    <div>
        <section className='lg:pr-24 p-6 lg:mt-24'>
        <h2 className='text-3xl'>What are the prices for your services?</h2>
        <p className='text-sm my-4 text-gray-400'>If you don't want to list all prices, list the most important ones, i.e for consultations and the most popular treatments.</p>
        
        {errors && <p className="text-red-500">{errors}</p>}

        <div className='flex justify-between mt-4 border-b-[1px]  border-gray-300 p-2'>
            <span className='font-semibold'>Service</span>
            <span className='font-semibold '>Price</span>
        </div>


                 <section>
                    {treatments.map((service, index) => (
                        <div 
                            key={index} 
                            className={`flex w-full items-center gap-1 mt-1 p-2 ${index % 2 === 0 ? 'bg-gray-100' : ''}`}
                        >
                            <div className='w-[65%]'>
                                <p>{service}</p>
                            </div>
                            <div className='flex grow bg-white items-center gap-1 border-[1px] pl-2 border-gray-300 rounded h-8 w-[35%]'>
                                <div className='flex items-center gap-1'>
                                    <input
                                        type="checkbox"
                                        id={`service-${index}`}
                                        name={`service-${index}`}
                                        className='rounded mt-2 text-3xl p-2 mb-2 border-gray-400'
                                        checked={selectedPrices.hasOwnProperty(service)}
                                        onChange={() => handleCheckboxChange(service)}
                                    />
                                    <label htmlFor={`service-${index}`} className='border-r-[1px] border-gray-300 text-gray-400 px-1 pr-4'>From</label>
                                </div>
                                <input
                                    type="text"
                                    id={`price-input-${index}`}
                                    name={`price-input-${index}`}
                                    className='rounded mt-2 p-2 mb-2 w-20 h-7 border-none outline-none focus:ring-0'
                                    value={selectedPrices[service] || ''}
                                    onChange={(e) => handlePriceChange(service, e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </section>
          
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

export default DoctorPriceList