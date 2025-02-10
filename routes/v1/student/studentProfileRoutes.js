import express from 'express';

import { upload } from '../../../middleware/multer/multer.js';
import { studentAuth } from '../../../middleware/authCheckStudent.js';
import { addStudent, findStudent, studentLogin, updateStudentDetailes } from '../../../controller/v1/student/studentProfileController.js';
const router=express.Router()


router.post('/',upload.single('image'),addStudent)
router.post('/login', studentLogin)

router.use( studentAuth )


router.get('/:id',findStudent)
router.patch('/:id',upload.single('image'),updateStudentDetailes)

export default router;