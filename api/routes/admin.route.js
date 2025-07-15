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
    getAdminDashboardOverview

 } from '../controllers/admin.controller.js'
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
router.delete('/users/:userId', verifyAdmin, deleteUser)
router.delete('/doctors/:doctorId', verifyAdmin, deleteDoctor)
router.delete('/clinics/:clinicId', verifyAdmin, deleteClinic)

export default router

