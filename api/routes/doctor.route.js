import express from 'express'
import { test } from '../controllers/doctor.controller.js'

const router = express.Router()

router.use('/test', test)

export default router