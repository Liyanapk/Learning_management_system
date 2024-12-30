import express from 'express';

import { upload } from '../../../middleware/multer/multer.js';
import { addStudent, deleteStudent, updateStudentDetailes, listStudent, findStudent } from '../../../controller/v1/admin/studentController.js';
import { adminAuth } from '../../../middleware/authCheck.js';
const router=express.Router()



router.use(adminAuth)

router.post('/',upload.single('image'),addStudent)
router.get('/',listStudent)
router.get('/:id',findStudent)
router.patch('/:id',upload.single('image'),updateStudentDetailes)
router.delete('/:id',deleteStudent)



export default router;