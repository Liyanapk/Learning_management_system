import express from 'express';
import { AddSubject, deleteSubject, findAndUpdatesubject, findsubject, findSubjectById } from '../../controller/v1/subjectController.js';


const router=express.Router()





router.post('/addsubject',AddSubject)
router.get('/subject/:subject_name',findsubject)
router.get('/subject/:id',findSubjectById)
router.patch('/subject/update/:id',findAndUpdatesubject)
router.delete('/subject/delete/:id',deleteSubject)

export default router;