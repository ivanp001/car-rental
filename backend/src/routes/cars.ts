import { Router } from 'express';
import { getAllCars, getCarById } from '../controllers/carsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// All car routes require authentication
router.use(authenticateToken);

router.get('/', getAllCars);
router.get('/:id', getCarById);

export default router;
