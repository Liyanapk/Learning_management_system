import express from 'express';
import { AddAdmin, findAdmin, findAndUpdate, findById, finddelete } from '../../controller/v1/adminController.js';
import { upload } from '../../middleware/multer.js';
const router=express.Router()



router.post('/addadmin' ,upload.single('pic') ,AddAdmin)
router.get('/admin/:first_name/:second_name',findAdmin)
router.get('/admin/id/:id', findById);
router.patch( '/admin/updateadmin/:id',upload.single('pic'),findAndUpdate)
router.delete('/admin/delete/:id',finddelete)

export default router;