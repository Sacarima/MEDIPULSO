import express from 'express'
import { verifyUserToken } from '../utils/verifyUserToken.js'
import { 
    addReview, 
    getDoctorReviews, 
    getDoctorsWithLatestReview 
    
} from '../controllers/review.controller.js'

const router = express.Router()

router.get('/doctors-with-latest-reviews', getDoctorsWithLatestReview)
router.post('/:doctorId', verifyUserToken, addReview)
router.get('/:doctorId', getDoctorReviews)


export default router