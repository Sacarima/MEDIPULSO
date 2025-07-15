import express from 'express'
import { 
    getSpecialties,
     getSpecialtyById,
     addSpecialty,
     updateSpecialty,
     getTreatmentsBySpecialty

 } from '../controllers/specialty.controller.js'
import { verifyAdmin } from '../utils/verifyAdmin.js'


const router = express.Router()


 router.get('/', getSpecialties)
 router.get('/:specialtyId', getSpecialtyById)
 router.get('/treatments/:medicalCategory', getTreatmentsBySpecialty)
 router.post('/', verifyAdmin, addSpecialty)
 router.put('/:specialtyId', verifyAdmin, updateSpecialty)

 export default router