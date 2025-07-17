import React, { useState } from 'react'
import { MdOutlineStarBorder, MdOutlineStarPurple500, MdThumbUp, MdThumbDown } from 'react-icons/md'
import { useDoctor } from '../context/DoctorContext'
import { format } from 'date-fns'
import art from '../../assets/artista.png'
import { useNavigate } from 'react-router-dom'

const ReviewsSection = ({ reviews, doctorAddress }) => {
    const [sortBy, setSortBy] = useState('Newest')
    const doctorData = useDoctor()
    const navigate = useNavigate()

    const calculateOverallRating = (reviews) => {
        if (!reviews.length) return 0
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
        return (totalRating / reviews.length).toFixed(1)
    }

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating)
        const emptyStars = 5 - fullStars

        return (
            <>
                {[...Array(fullStars)].map((_, index) => (
                    <MdOutlineStarPurple500 key={`full-${index}`} className='text-[#00c3a5]' />
                ))}
                {[...Array(emptyStars)].map((_, index) => (
                    <MdOutlineStarBorder key={`empty-${index}`} className='text-[#00c3a5]' />
                ))}
            </>
        )
    }

    const renderPatientInitial = (name) => {
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-purple-500']
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        return (
            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${randomColor}`}>
                <span className='text-white font-semibold'>{name[0]}</span>
            </div>
        )
    }

    const formattedDate = (date) => format(new Date(date), 'MMMM d, yyyy')

    const sortReviews = (reviews, sortBy) => {
        if (sortBy === 'Top Rating') {
            return [...reviews].sort((a, b) => b.rating - a.rating)
        }
        if (sortBy === 'Lowest Rating') {
            return [...reviews].sort((a, b) => a.rating - b.rating)
        }
        return [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // handle add review
    const handleAddReview = () => {
        if (doctorData?._id) {
            navigate(`/doctor-review/${doctorData._id}`);
        } else {
            console.error("Doctor ID is missing.");
            alert("Doctor ID is not available. Please try again.");
        }
    }

    const sortedReviews = sortReviews(reviews, sortBy)
    const overallRating = calculateOverallRating(reviews)

    return (
        <div className="reviews-section">
        <div className='flex justify-between items-center mb-6'>
            <h2 className="text-2xl font-semibold ">{reviews.length} Patient Reviews</h2>
                <button className='bg-blue-500 py-2 rounded-md px-3 text-white' onClick={handleAddReview}>Add your review</button>
        </div>
        <div className='flex items-center gap-4 my-10 border-[.5px] border-gray-300 p-4 rounded-md bg-gray-50'>
            <div className='p-4'>
                <span className='font-semibold '>We keep our finger on the pulse</span>
                <p className='mt-2'>We review all reviews. Professionals cannot pay to modify or delete reviews.</p>
            </div>
            <img src={art} alt="art" className=" w-[20%]" />
        </div>
        <div className="">
            <div className='flex text-2xl'>
                {renderStars(overallRating)}
            </div>
            <span className='text-sm'>Overall Rating: {overallRating}</span>
        </div>

        <div>

        </div>

        <div className="mt-4">
            <label htmlFor="sort-reviews" className="mr-2 font-semibold text-lg">Sort reviews by:</label>
            <select
                id="sort-reviews"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded p-1"
            >
                <option>Newest</option>
                <option>Top Rating</option>
                <option>Lowest Rating</option>
            </select>
        </div>

        <div className="mt-6">
    {sortedReviews.map((review) => (
      <div key={review._id}>
        <div className="flex gap-3 mb-4 p-4 items-start">
          <div>{renderPatientInitial(review.user.firstName)}</div>
          <div className="-4 mb-2">
            <div className="mt-2">
              <p className="font-medium">
                {review.user.firstName} {review.user.lastName}
              </p>
              <div className="flex items-center gap-2 mt-4">
                {renderStars(review.rating)}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                {formattedDate(review.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">
                Location: {doctorAddress}
              </p>
              <p className="mt-4 text-[14px] text-gray-800">{review.comment}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 px-4 ml-4 mb-2">
          <button className="flex items-center gap-1 text-gray-500 focus:text-gray-700">
            <MdThumbUp /> Useful
          </button>
          <button className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
            <MdThumbDown /> Not Useful
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
  )
}

export default ReviewsSection