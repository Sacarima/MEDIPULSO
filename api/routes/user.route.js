import express from 'express'
import { test, logout, getUser, updateUser } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js'



const router = express.Router()

router.use('/test', test)
router.post('/logout', logout)
router.get('/:userId', getUser)
router.put('/update/:userId', verifyToken, updateUser)



export default router