import React from 'react'
import { LiaTimesSolid } from "react-icons/lia"
import { IoIosWarning } from "react-icons/io"
import { RiDeleteBin6Line } from "react-icons/ri"

 const DeleteConfirmation = ()  => {
  return (
    <div className='grid place-items-center m-auto lg:w-[22%] bg-white rounded-lg p-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]'>
        <div className='flex flex-col'>
            <div className='flex justify-end'>
                <LiaTimesSolid className='text-2xl text-gray-500 cursor-pointer'/>
            </div>
            <div className='text-center'>
                <h3 className=' font-semibold text-black text-xl mb-2'>Confirm user removal</h3>
                <span className='text-gray-500'>Are you sure you want to delete this user from</span>
                <span className='text-gray-500'> Multi-Pulse platform?</span>
            </div>
            <div className='bg-orange-100 p-5 rounded-lg mt-4'>
                <div className='flex items-center gap-2 text-orange-700'>
                    <IoIosWarning />
                    <span className='font-semibold'>Warning</span>
                </div>
                <span className='text-orange-700 text-sm'>Once you delete this user, all of their data will be permanently removed from the system. This action cannot be undone.</span> 
            </div>
            <div className='flex items-center justify-center gap-4 mt-4'>
                <button className='border-[1px] rounded-md py-1 px-2 font-semibold text-gray-500'>No, cancel</button>

                <div className='flex items-center gap-2 '>
                    <button className='flex items-center  gap-2 font-semibold  text-white  bg-red-600 rounded-md py-1 px-2'> <RiDeleteBin6Line />Yes, confirm delete</button>
                </div>
            </div>
        </div>
   </div>     
  )
}

export default DeleteConfirmation