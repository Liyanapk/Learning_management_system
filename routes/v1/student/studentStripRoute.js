import express from 'express';

import { checkOutSession, handleWebhook } from '../../../controller/v1/student/studentStripeController.js';
const router=express.Router()


router.post("/stripe/webhook", express.raw({ type: 'application/json' }), handleWebhook);


router.post('/stripe', checkOutSession)


export default router