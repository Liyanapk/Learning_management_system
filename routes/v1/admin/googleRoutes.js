import express from 'express';
import { googleAuth, googleAuthCallback, getCourses } from '../../../controller/v1/admin/ggoleController.js';

const router = express.Router();

router.get('/auth', googleAuth);                        
router.get('/oauth2callback', googleAuthCallback);    
router.get('/courses', getCourses);                    

export default router;
