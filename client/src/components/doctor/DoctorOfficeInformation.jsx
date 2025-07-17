import { useState, useEffect }  from 'react'

const DoctorOfficeInformation = ({handleNext, step, setOfficeInformation, officeInformation}) => {
  const [formData, setFormData] = useState({
    officeName: '',
    officeAddress: '',
    officeLocation: '',
    zipcode: '',
  })

  const [errors, setErrors] = useState({})

    // Pre-fill inputs if user comes back to this step
    useEffect(() => {
      if (officeInformation) {
        setFormData(officeInformation);
      }
    }, [officeInformation]);
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value })

      // Remove error as soon as the user types
      setErrors((prevErrors) => ({
        ...prevErrors,
        [e.target.name]: '', // Clears error message when user starts typing
      }))

    }

    const validateForm = () => {
      let newErrors = {};
  
      // Ensure the value is a string before calling trim()
      if (!String(formData.officeName || '').trim()) newErrors.officeName = 'Please fill in this field';
      if (!String(formData.officeAddress || '').trim()) newErrors.officeAddress = 'Please fill in this field';
      if (!String(formData.officeLocation || '').trim()) newErrors.officeLocation = 'Please fill in this field';
      if (!String(formData.zipcode || '').trim()) newErrors.zipcode = 'Please fill in this field';
  
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0; // Returns true if no errors
    };
  
    const handleNextClick = () => {
      if (!validateForm()) return; // Stop proceeding if validation fails
  
      setOfficeInformation(formData); // Save the data in parent state
      handleNext(); // Move to the next step
    }

  return (
    <div>
      <section className='lg:pr-24 mt-6 lg:mt-24'>
        <h2 className='text-3xl'>Provide your office name and address</h2>
        <p className='text-sm mt-4 text-gray-400'>Name and address are required to create a profile</p>
        

        {/* Office Name */}
        <div className='flex flex-col mt-4'>
          <label htmlFor='officeName' className='font-semibold'>Office name</label>
          <input 
            type="text" 
            id="officeName" 
            name="officeName" 
            className={`border p-2 placeholder:text-gray-300 rounded mt-2 ${errors.officeName ? 'border-red-500' : 'border-gray-300'}`}
            value={formData.officeName ?? ''}
            onChange={handleChange}
            placeholder='Office name'
            required 
            />

          {errors.officeName && <p className="text-red-500 text-sm mt-1">{errors.officeName}</p>}
        </div>
          

          {/* Office Address */}
          <div className='flex flex-col mt-4'>
            <label htmlFor="officeAddress" className='font-semibold'>Office Address</label>
            <input 
              type="text" 
              id="officeAddress" 
              name="officeAddress"
              value={formData.officeAddress ?? ''}
              onChange={handleChange}
              className={`border p-2 rounded mt-2 placeholder:text-gray-300 ${errors.officeAddress ? 'border-red-500' : 'border-gray-300'}`}
              placeholder='Street address building and apartment number'
              required 
              />

{           errors.officeAddress && <p className="text-red-500 text-sm mt-1">{errors.officeAddress}</p>}
          </div>

            {/* Location & Zip Code */}
            <div className='lg:flex justify-between mt-5 gap-5'>
              <div className='w-full'>
                <input
                  type="text"
                  id="officeLocation"
                  name="officeLocation"
                  value={formData.officeLocation ?? ''}
                  onChange={handleChange}
                  className={`border w-full p-2 rounded mt-2 placeholder:text-gray-300 ${errors.officeLocation ? 'border-red-500' : 'border-gray-300'}`}
                  required
                  placeholder='Location'
                />

                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.officeLocation}</p>}
              </div>

                <div>
                  <input
                  type="text"
                  id="zipcode"
                  name="zipcode"
                  value={formData.zipcode ?? ''}
                  onChange={handleChange}
                  className={`border w-full p-2 rounded mt-2 placeholder:text-gray-300 ${errors.zipcode ? 'border-red-500' : 'border-gray-300'}`}
                  required
                  placeholder='Zip code'
                  />

                  {errors.zipcode && <p className="text-red-500 text-sm mt-1">{errors.zipcode}</p>}
                </div>

                
            </div>
          <div className='flex items-end mt-5'>
            <button
              className='text-white bg-blue-500 w-24 mt-5 mb-2 py-2 rounded'
              //onClick={handleNext}
              onClick={handleNextClick}
            >
                Next
            </button>
          </div>
        
      </section>
    </div>
  )
}

export default DoctorOfficeInformation