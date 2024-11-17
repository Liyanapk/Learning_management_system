import express from 'express'


import { adminAuth } from '../../../middleware/authCheck.js'
import { createAssignment, listAssignment } from '../../../controller/v1/admin/assignmentController.js'



const router=express.Router()


router.use(adminAuth)


router.post('/',createAssignment)
router.get('/',listAssignment)





export default router