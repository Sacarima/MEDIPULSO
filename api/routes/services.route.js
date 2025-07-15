import express from 'express'
import { test, getServices} from '../controllers/services.controller.js'

const router = express.Router()

router.use('/test', test)
router.get('/services', getServices)

export default router