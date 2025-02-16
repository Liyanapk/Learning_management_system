import express from 'express';

import { studentAuth } from '../../../middleware/authCheckStudent.js';
import { checkOutSession, handleWebhook } from '../../../controller/v1/student/studentStripeController.js';
const router=express.Router()


router.post("/stripe/webhook", handleWebhook);

router.use( studentAuth )

router.post('/stripe', checkOutSession)


export default router