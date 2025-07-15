import express from 'express'
import {
    createAppointment,
    getAppointmentsByDoctor,
    getAppointmentsByUser,
    updateAppointmentStatus,
    rescheduleAppointment,
    cancelAppointment,
    getAppointmentsByDate,
    getAppointmentsByWeek,
    getAppointmentsByMonth,
    getUpcomingAppointment,
    getUpcomingAppointmentForDoctor,
    test

} from '../controllers/appointment.controller.js'
import { verifyToken } from '../utils/verifyDoctor.js'
import { verifyUserToken } from '../utils/verifyUserToken.js'
import { verifyUserOrDoctor } from '../utils/verifyUserOrDoctor.js'




const router = express.Router()

 // appointment routes
router.get('/test', test)
router.post('/create', verifyUserToken, createAppointment)
router.get('/user/:userId', verifyUserToken, getAppointmentsByUser)
router.get('/doctor/:doctorId', verifyToken, getAppointmentsByDoctor)
router.get('/upcoming/doctor/:doctorId', verifyToken, getUpcomingAppointmentForDoctor)

router.get('/upcoming/:userId', verifyUserToken, getUpcomingAppointment)
router.patch('/:appointmentId/status', verifyToken, updateAppointmentStatus)
router.delete('/:appointmentId', verifyUserOrDoctor, cancelAppointment)
router.delete("/cancel/:appointmentId", verifyUserOrDoctor, cancelAppointment)
router.put("/reschedule/:appointmentId", verifyUserOrDoctor, rescheduleAppointment)

// Calendar route
router.get('/calendar/doctor/:doctorId', verifyUserOrDoctor, getAppointmentsByDate)
router.get('/calendar/doctor/:doctorId/week', verifyUserOrDoctor, getAppointmentsByWeek)
router.get('/calendar/doctor/:doctorId/month', verifyUserOrDoctor, getAppointmentsByMonth)




export default router