import express from 'express'
import { test } from '../controllers/clinic.controller.js'
import { logout } from '../controllers/auth.controller.js'


const router = express.Router()

router.use('/test', test)
router.post('/logout', logout)

export default router