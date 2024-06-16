import express from 'express'
import { test } from '../controllers/clinic.controller.js'

const router = express.Router()

router.use('/test', test)

export default router