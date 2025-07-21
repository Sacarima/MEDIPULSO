import React from 'react'
import { BiX } from 'react-icons/bi'

const ImageModal = ({ isOpen, imageUrl, onClose }) => {
    if (!isOpen) return null

  return (
    <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70'
        onClick={onClose}
    >
        <div className='relative p-4 bg-white rounded-lg shadow-lg'>
            <img 
                src={imageUrl}
                alt="Enlarged Image"
                className='w-full h-full object-cover max-w-2xl max-h-2xl rounded' 
            />
            <button
                onClick={onClose}
                className='absolute top-4 right-4 p-2 text-white bg-gray-700 rounded-full shadow-lg hover:bg-gray-800 transition duration-300 ease-in-out'
            >
                <BiX size={24} />
            </button>
        </div>
    </div>
  )
}

export default ImageModal