import express from 'express'
import {  allCourse, courseAdd } from '../../../controller/v1/admin/courseController.js'
import { adminAuth } from '../../../middleware/authCheck.js';


const router = express.Router()

router.use(adminAuth)

router.post('/', courseAdd)
router.get('/', allCourse)

export default router