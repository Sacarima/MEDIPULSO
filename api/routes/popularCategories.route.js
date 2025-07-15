import express from 'express'
import { getPopularCategories } from '../controllers/popularCategories.controller.js'

const router = express.Router()

router.get('/popular-categories', getPopularCategories)

export default router