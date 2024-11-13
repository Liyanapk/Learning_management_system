import express from 'express';
import { upload } from '../../../middleware/multer/multer.js';
import {getOneAdmin,addAdmin,listAdmin ,updateAdminDetailes ,deleteAdmin, adminLogin} from '../../../controller/v1/admin/adminController.js';
import { adminAuth } from '../../../middleware/authCheck.js';
const router=express.Router()


router.post('/login',adminLogin)

router.use(adminAuth)

router.post('/' ,upload.single('pic') ,addAdmin)
router.get('/list',listAdmin)
router.get('/:id', getOneAdmin);
router.patch( '/:id',upload.single('pic'),updateAdminDetailes)
router.delete('/:id',deleteAdmin)

export default router;
