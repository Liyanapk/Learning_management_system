import express from 'express';
import { addSubject, deleteSubjects, updatesubjectDetailes, listSubject, findSubject } from '../../../controller/v1/admin/subjectController.js';
import { adminAuth } from '../../../middleware/authCheck.js';


const router=express.Router()



router.use(adminAuth)

router.post('/',addSubject)
router.get('/',listSubject)
router.get('/:id',findSubject)
router.patch('/:id',updatesubjectDetailes)
router.delete('/delete',deleteSubjects)

export default router;