import express from 'express';
import { addTeacher, deleteTeacher, updateTeacherDetailes, listTeacher, findTeacher } from '../../../controller/v1/admin/teacherController.js';
import { upload } from '../../../middleware/multer/multer.js';
import { adminAuth } from '../../../middleware/authCheck.js';
const router=express.Router()



router.use(adminAuth)

router.post('/',upload.single('pic'),addTeacher)
router.get('/list',listTeacher)
router.get('/:id',findTeacher)
router.patch( '/:id',upload.single('pic'),updateTeacherDetailes)
router.delete('/:id' ,deleteTeacher)


export default router;