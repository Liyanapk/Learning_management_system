import express from 'express';
import { addQuestions, deleteQuestion, listQuestions, oneQuestion, updateQuestion } from '../../../controller/v1/admin/questionController.js';
import { adminAuth } from '../../../middleware/authCheck.js';

const router=express.Router()


router.use(adminAuth)


router.post('/',addQuestions)
router.get('/',listQuestions)
router.get('/:id',oneQuestion)
router.patch('/:id',updateQuestion)
router.delete('/:id',deleteQuestion)






export default router;