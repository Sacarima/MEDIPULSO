import express from 'express'
import { 
    test, 
    getDoctor, 
    updateDoctor, 
    getRecentlyAddedDoctors, 
    getDoctorPublicProfile, 
    getDoctorPublicProfileInfo,
    updateDoctorProfileCompletion,
    searchDoctors, 
    getRandomDoctors,
    deleteDoctorPhoto,
    changeDoctorPassword,     
    deleteDoctorAccount, 
} from '../controllers/doctorForm.controller.js'
import { logout } from '../controllers/auth.controller.js'
import { verifyToken } from '../utils/verifyDoctor.js'
import { getDoctorTreatments, updateDoctorTreatments } from '../controllers/doctorForm.controller.js'
import { verifyUserOrDoctor } from '../utils/verifyUserOrDoctor.js'


const router = express.Router()

router.use('/test', test)
router.get('/random-doctors', getRandomDoctors)
router.get('/profile-info/:doctorId', getDoctorPublicProfileInfo)
router.get('/profile/:firstName-:lastName/:medicalCategory/:city', getDoctorPublicProfile)
router.get('/recently-added-public', getRecentlyAddedDoctors)
router.get('/:doctorId/treatments', getDoctorTreatments)
router.get('/search', searchDoctors)
router.put('/:doctorId/treatments', verifyUserOrDoctor, updateDoctorTreatments)
router.post('/logout', logout)



router.get('/:doctorId', verifyToken, getDoctor)
router.put('/update/:doctorId', verifyToken, updateDoctor)
router.put("/profile-completion/:doctorId", verifyUserOrDoctor, updateDoctorProfileCompletion)
router.put('/:doctorId/password', verifyToken, changeDoctorPassword); 
router.delete('/:doctorId', verifyToken, deleteDoctorAccount);          
router.delete('/photo/:filePath(*)', verifyUserOrDoctor, deleteDoctorPhoto)




export default router