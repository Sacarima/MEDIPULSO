import express from 'express'
import { 
    askQuestion,
  answerQuestion,
  getAllQuestions,
  getQuestionById,
  getUserQuestions,
  getLatestAnsweredQuestions,
  deleteAnswer,
  getPopularQuestions, 
  getMostActiveDoctors
} from '../controllers/question.controller.js'
import { verifyUserOrDoctor } from '../utils/verifyUserOrDoctor.js'

const router = express.Router()

router.get('/most-active-doctors', getMostActiveDoctors)
router.post('/ask', verifyUserOrDoctor, askQuestion)

router.post('/answer/:questionId', verifyUserOrDoctor, answerQuestion)
router.get('/', getAllQuestions)
router.get('/my-questions', verifyUserOrDoctor, getUserQuestions)
router.get('/answered-latest', getLatestAnsweredQuestions); 
router.get('/popular', getPopularQuestions)
router.get('/:questionId', getQuestionById) 
router.delete('/answer/:questionId/:answerIndex', verifyUserOrDoctor, deleteAnswer)



export default router