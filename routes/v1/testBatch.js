import express from 'express';
import { AddBatch, deleteBatch, findAndUpdateBatch, findBatch, findBatchById } from '../../controller/v1/batchController.js';



const router=express.Router()





router.post('/addbatch', AddBatch)
router.get('/batch/:batch_name',findBatch)
router.get('/batch/id/:id',findBatchById)
router.patch('/batch/update/:id',findAndUpdateBatch)
router.delete('/batch/delete/:id',deleteBatch)




export default router;