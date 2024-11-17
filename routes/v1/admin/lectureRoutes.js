import express from 'express';
import { adminAuth } from '../../../middleware/authCheck.js';
import { addLecture, deletelecture, findLecture, listLecture, updateLecture } from '../../../controller/v1/admin/lectureController.js';


const router=express.Router()


router.use(adminAuth)

router.post('/',addLecture)
router.get('/',listLecture)
router.get('/:id',findLecture)
router.patch('/:id',updateLecture)
router.delete('/:id',deletelecture)



export default router;