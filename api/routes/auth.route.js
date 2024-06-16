import express from 'express'
import { signup, login, google, signupClinic, signupDoctor } from '../controllers/auth.controller.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/signup/doctor', signupDoctor)
router.post('/signup/clinic', signupClinic)
router.post('/login', login)
router.post('/google', google)


export default router