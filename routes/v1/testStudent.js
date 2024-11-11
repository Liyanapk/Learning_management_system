import express from 'express';

import { upload } from '../../middleware/multer.js';
import { Addstudent, deleteStudent, findAndUpdateStudent, findstudent, findStudentById } from '../../controller/v1/studentController.js';
const router=express.Router()





router.post('/addstudent',upload.single('pic'),Addstudent)
router.get('/student/:first_name/:second_name',findstudent)
router.get('/student/id/:id',findStudentById)
router.patch('/student/update/:id',upload.single('pic'),findAndUpdateStudent)
router.delete('/student/delete/id/:id',deleteStudent)



export default router;