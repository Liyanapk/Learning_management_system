import express from 'express';
import { addBatch, deleteBatch, updateBatchDetailes, listBatch, findBatch } from '../../../controller/v1/admin/batchController.js';
import { adminAuth } from '../../../middleware/authCheck.js';



const router=express.Router()


router.use(adminAuth)


router.post('/', addBatch)
router.get('/list',listBatch)
router.get('/:id',findBatch)
router.patch('/:id',updateBatchDetailes)
router.delete('/:id',deleteBatch)




export default router;