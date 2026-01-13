import { Router } from 'express';
import { getAllCars, getCarById } from '../controllers/carsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All car routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/cars:
 *   get:
 *     summary: Get all cars
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cars
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Car'
 */
router.get('/', getAllCars);
router.get('/:id', getCarById);

export default router;
