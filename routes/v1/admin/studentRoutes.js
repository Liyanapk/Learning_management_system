import express from 'express';

import { upload } from '../../../middleware/multer/multer.js';
import { addStudent, deleteManyStudents, updateStudentDetailes, listStudent, findStudent } from '../../../controller/v1/admin/studentController.js';
import { adminAuth } from '../../../middleware/authCheck.js';
import { studentAuth } from '../../../middleware/authCheckStudent.js';
const router=express.Router()



router.use(adminAuth)

router.post('/',upload.single('image'),addStudent)
router.use( studentAuth )
router.get('/',listStudent)
router.get('/:id',findStudent)
router.patch('/:id',upload.single('image'),updateStudentDetailes)
router.delete('/delete',deleteManyStudents)



export default router;