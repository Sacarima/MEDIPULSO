import express from 'express'
import { 
    addDoctorAvailability,
    getDoctorAvailability,      
    updateDoctorAvailability,
    deleteDoctorAvailability,
    createMonthlyAvailability,
    getDoctorsByAvailability,
    test
} from '../controllers/doctorAvailability.controller.js'
import { verifyUserOrDoctor } from '../utils/verifyUserOrDoctor.js'

const router = express.Router()

router.get('/test', test)
router.post('/add', verifyUserOrDoctor, addDoctorAvailability)
router.post('/monthly', verifyUserOrDoctor, createMonthlyAvailability)
router.get('/search', getDoctorsByAvailability)
router.get('/:doctorId', getDoctorAvailability)
router.put('/update/:doctorId', verifyUserOrDoctor, updateDoctorAvailability)
router.delete('/delete/:doctorId', verifyUserOrDoctor, deleteDoctorAvailability)


export default router