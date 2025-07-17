import React, { useState } from 'react'
import { MdKeyboardArrowRight } from "react-icons/md"
import Carousel from '../Carousel'
import { LiaTimesSolid } from 'react-icons/lia'
import { IoCheckmarkDone } from "react-icons/io5"

const VisitOptionsSelection = ({ doctorId, appointmentSelection, setAppointmentSlot,  handleNextStep, setAppointmentSelection, doctorData, showCalendar, onBack}) => {
    const [showModal, setShowModal] = useState(false)

    const handleChange = (e) => {
        const newValue = parseInt(e.target.value, 10)
        setAppointmentSelection(prev => newValue)
      }
                                                                                                                                                                                                                                                                           
    return (
    <div>
        <h1 className='text-3xl mb-10 font-bold'>Select your visit options</h1>

        
        <section className='mr-8'>
            <span className='text-lg font-semibold'>Visit type*</span>
            <div className='flex justify-between items-center gap-4 mt-4 border-[.5px] border-gray-200 p-4 rounded-md mb-6'>
                <div className='w-3/4'>
                    <span className='font-semibold'>{doctorData?.medicalSpecialtyCategory} consultation <span className='font-semibold'>PLN 200.00</span></span>
                    <p className='text-gray-500'>Consultation lasts 50 minutes. It is intended for people over 16 years of age.
                        Choose this service as a first, one-time or subsequent visit
                    </p>
                </div>
                <button 
                    className='text-blue-500'
                    onClick={() => setShowModal(true)}
                >
                    Change
                </button>
                
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    className='fixed top-0 inset-0 left-0 w-full h-full bg-blue-200 bg-opacity-50 z-50'
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowModal(false)
                        }
                    }}
                >
                    <div className='bg-white w-[30%] m-auto mt-20 p-6 rounded-md shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
                        <div className='flex justify-between'>
                            <h2 className='text-xl font-medium mb-4'>Select visit type</h2>
                            <LiaTimesSolid className='text-gray-500 cursor-pointer text-2xl ' onClick={() => setShowModal(false)}/>
                        </div>
                        <div className='border-b-[.5px] border-gray-300  '>
                            <span className='font-medium'>Available on selected date</span>
                            <div className='flex items-start gap-4 justify-between mt-2'>
                                <span style={{ whiteSpace: 'pre-wrap' }}>
                                    {doctorData?.medicalSpecialtyCategory} consultation PLN 200.00
                                    <p className='text-gray-400 mt-1 mb-2'>duration 50 min</p>
                                </span>
                                <div className='flex items-center gap-2 text-[#00c3a5]'>
                                    <IoCheckmarkDone />
                                    <p>Selected</p>
                                </div>
                            </div>
                        </div>

                        <div className='border-b-[.5px] border-gray-300  mt-2'>
                            
                            <div className='flex items-start gap-4 justify-between mt-2'>
                                <span style={{ whiteSpace: 'pre-wrap' }}>
                                    Adult {doctorData?.medicalSpecialtyCategory} consultation PLN 200.00
                                    <p className='text-gray-400 mt-1 mb-2'>duration 50 min</p>
                                </span>
                                <div className=''>
                                    <button className='bg-blue-500 text-white rounded-sm py-2 px-3'>Choose</button>
                                </div>
                            </div>
                        </div>

                        <div className=' mt-2'>
                            
                            <div className='flex items-start gap-4 justify-between mt-2'>
                                <span style={{ whiteSpace: 'pre-wrap' }}>
                                    {doctorData?.medicalSpecialtyCategory} for adolescents aged 14 and over PLN 200.00
                                    <p className='text-gray-400 mt-1 mb-2'>duration 50 min</p>
                                </span>
                                <div className=''>
                                    <button className='bg-blue-500 text-white rounded-sm py-2 px-3'>Choose</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
        <div className=''>
            <div className=''>
                <p className='font-semibold'>Is this your first visit to this specialist? *</p>
                <div className='flex  gap-4'>
                    <div >
                        <input
                             type="radio"
                             id="in-person"
                             name="appointmentType"
                             value="1"
                             checked={appointmentSelection === 1}
                             onChange={handleChange} 
                             className='mr-2 w-5 h-5 accent-blue-500 cursor-pointer'
                        />
                        <label htmlFor="in-person">Yes</label>
                    </div>
                    <div>
                        <input
                            type="radio"
                            id="virtual"
                            name="appointmentType"
                            value="2"
                            checked={appointmentSelection === 2}
                            onChange={handleChange} 
                            className='mr-2 w-5 h-5 accent-blue-500 cursor-pointer'
                        />
                        <label htmlFor="virtual">No</label>
                    </div>
                </div>
            </div>

            {/* APPOINTMMENT CALENDAR */}
            {showCalendar && (
                 <div className='mt-8'>
                    <Carousel 
                        doctorId={doctorId}
                        onDateSelect={ (selectedSlot) => setAppointmentSlot(selectedSlot)}
                    />
                </div>
            )}

            <div className='mr-8 mt-10'>
                <button
                    disabled={!appointmentSelection} // Disable if fields are empty
                    onClick={handleNextStep}
                    className={
                        `text-white px-3 py-2 w-full rounded-sm flex justify-center items-center gap-1 transition-colors
                        ${!appointmentSelection
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`
                    }
                >
                    Continue <MdKeyboardArrowRight className='text-2xl'/>
                </button>
            </div>

            <p className='text-center mt-4 text-gray-400 mr-8 mb-10'>* Required fields</p>
    </div>

    
    </div>
  )  
}

export default VisitOptionsSelection

