import React, { useState } from 'react'
import { MdOutlineStarBorder, MdOutlineStarPurple500 } from 'react-icons/md'
import { PiStarThin, PiStarFill  } from "react-icons/pi"
//import { PiStarFill } from "react-icons/pi"
import { FaArrowRight } from 'react-icons/fa'

const RatingStep = ({ selectedRating, onRatingSelect, onContinue }) => {
  const [hoverRating, setHoverRating] = useState(0)
  const stars = [1, 2, 3, 4, 5]

  const displayRating = hoverRating > 0 ? hoverRating : selectedRating
  let scaleFactor = 1
  if (displayRating === 1) scaleFactor = 0.9
  else if (displayRating > 1) scaleFactor = 0.8

  return (
    <div>
      <span className='font-medium text-xl block mb-4'>Overall rating for this appointment</span>
      <div
        className='flex'
        style={{ gap: '1rem', height: '4rem' }}
        onMouseLeave={() => setHoverRating(0)}
      >
        {stars.map((star) => {
          const isFilled = star <= displayRating
          return (
            <div
              key={star}
              className='cursor-pointer relative'
              style={{ width: '4rem', height: '4rem', flex: '0 0 auto' }}
              onMouseEnter={() => setHoverRating(star)}
              onClick={() => onRatingSelect(star)}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) scale(${isFilled ? scaleFactor : 1})`,
                  transformOrigin: 'center',
                  transition: 'transform 0.2s ease'
                }}
              >
                {isFilled ? (
                  <PiStarFill className='text-7xl text-[#00c3a5]' />
                ) : (
                  <PiStarThin className='text-6xl text-[#00c3a5]' />
                )}
              </div>
            </div>
          )
        })}
      </div>
      <p className='text-gray-400 mt-4'>On a scale of 1 to 5, how would you rate your visit?</p>
      <div className='flex justify-end mt-4'>
        <button
          disabled={selectedRating === 0}
          onClick={onContinue}
          className={
            `text-white px-3 py-2 rounded-sm flex items-center gap-1 transition-colors
             ${selectedRating === 0 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 cursor-pointer'}`
          }
        >
          Continue <FaArrowRight className='text-2xl'/>
        </button>
      </div>
    </div>
  )
}

export default RatingStep
