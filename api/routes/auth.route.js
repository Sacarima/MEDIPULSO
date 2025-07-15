import express from 'express'
import { 
    signup, 
    login, 
    google, 
    signupClinic, 
    signupDoctor, 
    apple, 
    logout
    
} from '../controllers/auth.controller.js'
import { getLoggedInDoctor } from '../controllers/auth.controller.js'



const router = express.Router()

// Routes
router.post('/signup', signup)
router.post('/signup/doctor', signupDoctor)
router.post('/signup/clinic-form', signupClinic)
router.post('/signup/doctor-form', signupDoctor)
router.get('/me', getLoggedInDoctor)
router.post('/login', login)
router.post('/google', google)
router.post('/apple', apple)
router.post('/logout', logout)


export default router