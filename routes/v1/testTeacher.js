import express from 'express';
import { Addteacher, deleteTeacher, findAndUpdateTeacher, findteacher, findTeacherById } from '../../controller/v1/teacherController.js';
import { upload } from '../../middleware/multer.js';
const router=express.Router()





router.post('/addteacher',upload.single('pic'),Addteacher)
router.get('/teacher/:first_name/:second_name',findteacher)
router.get('/teacher/id/:id',findTeacherById)
router.patch( '/teacher/updateteacher/:id',upload.single('pic'),findAndUpdateTeacher)
router.delete('/teacher/delete/:id' ,deleteTeacher)


export default router;