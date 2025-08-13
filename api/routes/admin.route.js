import express from 'express'
import { 
    loginAdmin, 
    getAllUsers, 
    createAdmin, 
    getAllDoctors, 
    deleteUser, 
    deleteDoctor, 
    getAllClinics, 
    deleteClinic, 
    logoutAdmin,
    getAdminDashboardOverview,
    updateTreatmentCityPricing,
    updateTreatmentSections,
    updateTreatmentImages,
    updateTreatmentBasics,
    deleteTreatmentImages,
    deleteAllTreatmentImages,
    clearTreatmentImages,


 } from '../controllers/admin.controller.js'
 import { getAppointmentsByDoctor } from '../controllers/appointment.controller.js'
 import { adminHardDeleteAppointment } from '../controllers/appointment.controller.js'
import { verifyAdmin } from '../utils/verifyAdmin.js'

const router = express.Router()

// Admin login
router.post('/login', loginAdmin)

//create admin
router.post('/create', verifyAdmin, createAdmin)

// Admin logout
router.post('/logout', logoutAdmin)

// Admin Actions (protected routes)
router.get('/users', verifyAdmin, getAllUsers)
router.get('/doctors', verifyAdmin, getAllDoctors)
router.get('/clinics', verifyAdmin, getAllClinics)
router.get('/dashboard', verifyAdmin, getAdminDashboardOverview);
router.get('/appointments/doctor/:doctorId', verifyAdmin, getAppointmentsByDoctor)
router.delete('/users/:userId', verifyAdmin, deleteUser)
router.delete('/doctors/:doctorId', verifyAdmin, deleteDoctor)
router.delete('/clinics/:clinicId', verifyAdmin, deleteClinic)
router.delete('/appointments/:appointmentId', verifyAdmin, adminHardDeleteAppointment)
// Update treatment city pricing by slug instead of treatmentId
router.put('/treatments/slug/:slug/city-pricing', verifyAdmin, updateTreatmentCityPricing);
// Update treatment sections by slug instead of treatmentId
router.put('/treatments/slug/:slug/sections', verifyAdmin, updateTreatmentSections)
// Update treatment images (array of Firebase URLs)
router.put('/treatments/:treatmentId/images', verifyAdmin, updateTreatmentImages);
// Update basics (description, priceRange)
router.put('/treatments/:treatmentId/basics', verifyAdmin, updateTreatmentBasics);

// Delete specific images (body: { images: [downloadUrl1, ...] })
router.delete('/treatments/:treatmentId/images', verifyAdmin, deleteTreatmentImages);


// (Optional) Delete ALL images for a treatment
router.delete('/treatments/:treatmentId/images/all', verifyAdmin, clearTreatmentImages);


export default router

