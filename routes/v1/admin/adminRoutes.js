import express from 'express';
import { upload } from '../../../middleware/multer/multer.js';
import { getOneAdmin, addAdmin, listAdmin, updateAdminDetailes, deleteAdmin, adminLogin } from '../../../controller/v1/admin/adminController.js';
import { adminAuth } from '../../../middleware/authCheck.js';

const router = express.Router();

/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Logs in an admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', adminLogin);

// Middleware for authentication
router.use(adminAuth);

/**
 * @swagger
 * /:
 *   post:
 *     summary: Adds a new admin
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pic:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.post('/', upload.single('pic'), addAdmin);

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Lists all admins
 *     responses:
 *       200:
 *         description: A list of admins
 */
router.get('/', listAdmin);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Gets a specific admin by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin ID
 *     responses:
 *       200:
 *         description: Admin details
 */
router.get('/:id', getOneAdmin);

/**
 * @swagger
 * /{id}:
 *   patch:
 *     summary: Updates admin details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pic:
 *                 type: string
 *                 format: binary
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin updated successfully
 */
router.patch('/:id', upload.single('pic'), updateAdminDetailes);
/**
 * @swagger
 * /api/v1/admin/{id}:
 *   delete:
 *     summary: Deletes an admin
 *     description: Deletes an admin by ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 */
router.delete('/:id', deleteAdmin);

export default router;

