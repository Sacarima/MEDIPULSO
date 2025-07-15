import Review from '../models/review.model.js'
import DoctorForm from '../models/doctorForm.model.js'
import { errorHandler } from '../utils/error.js'

// add a new review for a doctor
// This function allows a user to add a review for a doctor.
// It checks if the rating and comment are provided, validates the rating, checks if the doctor exists,
// and then creates a new review. It also calculates the new average rating for the doctor and saves it.
// If any validation fails or an error occurs, it returns an appropriate error message.
// The function uses async/await for asynchronous operations and handles errors using a try/catch block
export const addReview = async (req, res, next) => {
    try {
        const { doctorId} = req.params
        const { rating, comment } = req.body

        // check if the comment & rating exists
        if (!rating || !comment) {
            return next(errorHandler(400, 'Comment and rating are required'))
        }

        // 
        if (rating < 1 || rating > 5) {
            return next(errorHandler(400, 'Rating must be between 1 and 5'))
        }

        // check if the doctor exists
        const doctor = await DoctorForm.findById(doctorId)
        if (!doctor) {
            return next(errorHandler(404, 'Doctor not found'))
        }

        // create a new review
        const newReview = new Review({
            doctor: doctorId,
            user: req.user.id,
            rating,
            comment,
        })

        // save the review
        await newReview.save()

        // calculate the new average rating for the doctor
        const reviews = await Review.find({ doctor: doctorId })
        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0)
        doctor.averageRating = totalRating / reviews.length
        await doctor.save()

        res.status(201).json(newReview)
    }
    catch (error) {
        next(errorHandler(500, 'Failed to add review'))
    }
}


// get all reviews for a doctor
// This function retrieves all reviews for a specific doctor by their ID.
// It checks if the doctor exists, and if so, it fetches all reviews associated with that doctor.
// The reviews are populated with user details (firstName and lastName) and sorted by creation date in descending order.
// If the doctor is not found, it returns a 404 error.
// If an error occurs during the process, it returns a 500 error.
// The function uses async/await for asynchronous operations and handles errors using a try/catch block
export const getDoctorReviews = async (req, res, next) => {
    try {
        const { doctorId } = req.params

        // check if the doctor exists
        const doctor = await DoctorForm.findById(doctorId)
        if (!doctor) {
            return next(errorHandler(404, 'Doctor not found'))
        }

        // get all reviews for the doctor
        const reviews = await Review.find({ doctor: doctorId })
            .populate('user', 'firstName lastName')
            .sort({ createdAt: -1 })

        res.status(200).json(reviews)
    } catch (error) {
        next(errorHandler(500, 'Failed to get reviews'))
    }
}
  
  
 // getDoctorsWithLatestReview
// This function retrieves doctors along with their latest review.
// It uses MongoDB aggregation to join the doctors with their reviews, unwind the reviews to get the latest one,
// and then group the results to get only the latest review for each doctor.
// The function also populates the user details for the latest review and limits the results to 3 doctors for testing purposes.
// If successful, it returns the doctors with their latest review; if an error occurs, it returns a 500 error.
// The function uses async/await for asynchronous operations 
export const getDoctorsWithLatestReview = async (req, res, next) => {
    console.log("getDoctorsWithLatestReview endpoint hit");
  
    try {
      // Fetch doctors with their latest reviews (limit to 3 for testing)
      const doctorsWithLatestReview = await DoctorForm.aggregate([
        {
          $lookup: {
            from: 'reviews',  // The reviews collection
            localField: '_id',  // The doctor ID
            foreignField: 'doctor',  // The doctor reference in reviews
            as: 'reviews'  // Name of the array field to store matching reviews
          }
        },
        {
          $unwind: {
            path: '$reviews',  // Unwind the reviews array to deal with each review separately
            preserveNullAndEmptyArrays: false  // Skip doctors with no reviews
          }
        },
        {
          $sort: {
            'reviews.createdAt': -1  // Sort by review creation date, descending order (most recent first)
          }
        },
        {
          $group: {
            _id: '$_id',  // Group by doctor ID
            firstName: { $first: '$firstName' },
            lastName: { $first: '$lastName' },
            profilePicture: { $first: '$profilePicture' },
            city: { $first: '$city' },
            specialty: { $first: '$medicalCategory' },
            latestReview: { $first: '$reviews' },  // Take only the latest review
          }
        },
        {
          $lookup: {
            from: 'users',  // Populate user details (firstName, lastName) for each review
            localField: 'latestReview.user',  // Populate the 'user' field in 'latestReview'
            foreignField: '_id',
            as: 'latestReview.user'
          }
        },
        {
          $addFields: {
            'latestReview.user': { $arrayElemAt: ['$latestReview.user', 0] }  // Take the first element from the array
          }
        },
        {
          $project: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            profilePicture: 1,
            city: 1,
            specialty: 1,
            latestReview: {
              comment: 1,
              rating: 1,
              createdAt: 1,
              user: { firstName: 1, lastName: 1 }  // Select the firstName and lastName of the user
            }
          }
        },
        {
          $limit: 3  // Limit to 3 doctors for testing
        }
      ]);
  
      // Send the response with the doctors and their latest review
      res.status(200).json({
        success: true,
        doctors: doctorsWithLatestReview,
      });
    } catch (error) {
      console.error("Error in getDoctorsWithLatestReview:", error);
      next(errorHandler(500, 'Failed to fetch doctors with latest reviews.'));
    }
  };
  
  




  