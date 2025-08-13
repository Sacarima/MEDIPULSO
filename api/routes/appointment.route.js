// import express from 'express'
// import {
//     createAppointment,
//     getAppointmentsByDoctor,
//     getAppointmentsByUser,
//     updateAppointmentStatus,
//     rescheduleAppointment,
//     cancelAppointment,
//     getAppointmentsByDate,
//     getAppointmentsByWeek,
//     getAppointmentsByMonth,
//     getUpcomingAppointment,
//     getUpcomingAppointmentForDoctor,
//     getBookedSlotsPublic,
//     test

// } from '../controllers/appointment.controller.js'
// import { verifyToken } from '../utils/verifyDoctor.js'
// import { verifyUserToken } from '../utils/verifyUserToken.js'
// import { verifyUserOrDoctor } from '../utils/verifyUserOrDoctor.js'




// const router = express.Router()

//  // appointment routes
// router.get('/test', test)
// // routes/appointment.route.js
// router.get('/doctor/:doctorId/slots/public', getBookedSlotsPublic);
// router.post('/create', verifyUserToken, createAppointment)
// router.get('/user/:userId', verifyUserToken, getAppointmentsByUser)
// router.get('/doctor/:doctorId', verifyToken, getAppointmentsByDoctor)
// router.get('/upcoming/doctor/:doctorId', verifyToken, getUpcomingAppointmentForDoctor)

// router.get('/upcoming/:userId', verifyUserToken, getUpcomingAppointment)
// router.patch('/:appointmentId/status', verifyUserOrDoctor, updateAppointmentStatus)
// router.delete('/:appointmentId', verifyUserOrDoctor, cancelAppointment)
// router.delete("/cancel/:appointmentId", verifyUserOrDoctor, cancelAppointment)
// router.put("/reschedule/:appointmentId", verifyUserOrDoctor, rescheduleAppointment)

// // Calendar route
// router.get('/calendar/doctor/:doctorId', verifyUserOrDoctor, getAppointmentsByDate)
// router.get('/calendar/doctor/:doctorId/week', verifyUserOrDoctor, getAppointmentsByWeek)
// router.get('/calendar/doctor/:doctorId/month', verifyUserOrDoctor, getAppointmentsByMonth)




// export default router

import express from 'express';
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
  getBookedSlotsPublic,
  test,
} from '../controllers/appointment.controller.js';

import { verifyToken } from '../utils/verifyDoctor.js';          // doctor-only
import { verifyUserToken } from '../utils/verifyUserToken.js';    // user-only
import { verifyUserOrDoctor } from '../utils/verifyUserOrDoctor.js'; // either

const router = express.Router();

// Health/check
router.get('/test', test);

// Public: booked slots used by Carousel to subtract availability
router.get('/doctor/:doctorId/slots/public', getBookedSlotsPublic);

// Create (patient)
router.post('/create', verifyUserToken, createAppointment);

// Lists
router.get('/user/:userId', verifyUserToken, getAppointmentsByUser);
router.get('/doctor/:doctorId', verifyToken, getAppointmentsByDoctor);

// Upcoming
router.get('/upcoming/doctor/:doctorId', verifyToken, getUpcomingAppointmentForDoctor);
router.get('/upcoming/:userId', verifyUserToken, getUpcomingAppointment);

// Status changes / lifecycle
router.patch('/:appointmentId/status', verifyUserOrDoctor, updateAppointmentStatus);
router.patch('/cancel/:appointmentId', verifyUserOrDoctor, cancelAppointment); // <-- accepts body { reason }
router.put('/reschedule/:appointmentId', verifyUserOrDoctor, rescheduleAppointment);

// Calendar views
router.get('/calendar/doctor/:doctorId', verifyUserOrDoctor, getAppointmentsByDate);
router.get('/calendar/doctor/:doctorId/week', verifyUserOrDoctor, getAppointmentsByWeek);
router.get('/calendar/doctor/:doctorId/month', verifyUserOrDoctor, getAppointmentsByMonth);

export default router;
