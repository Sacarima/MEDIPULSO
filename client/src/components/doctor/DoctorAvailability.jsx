
import DoctorCalendar from './DoctorCalendar'

const DoctorAvailability = ({isSubmitting, handleSubmit, errorMessage, successMessage, handleBack, setAvailability, doctorId})=>  {
  return (
    <div>
        <DoctorCalendar />
        {errorMessage && <p className='text-red-500 text-center'>{errorMessage}</p>}
        {successMessage && <p className='text-green-500 text-center'>{successMessage}</p>}
        <div className='flex justify-between'>
                    <button onClick={handleBack} className='bg-[#00c3a5] text-white py-2 px-4 rounded mt-4 ml-4'>
                    Back
                  </button>
                  <button onClick={handleSubmit} className='bg-[#00c3a5] text-white py-2 px-4 rounded mt-4 mr-4' disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                 
                </div>
    </div>
  )
}

export default DoctorAvailability
