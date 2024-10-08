import express from 'express'
import { test, logout, getUser, updateUser, deleteUser } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'



const router = express.Router()

router.use('/test', test)
router.post('/logout', logout)
router.get('/:userId', getUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.put('/update/:userId', verifyToken, updateUser)



export default router