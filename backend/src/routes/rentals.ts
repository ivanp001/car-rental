import { Router } from 'express';
import {
  getAllRentals,
  createRental,
  returnRental,
  getAllData,
} from '../controllers/rentalsController';
import { authenticateToken } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

// All rental routes require authentication
router.use(authenticateToken);

// Combined endpoint matching mock API
router.get('/all-data', getAllData);

router.get('/', getAllRentals);

const createRentalValidation = [
  body('carId').notEmpty().withMessage('Car ID is required'),
  body('customerId').notEmpty().withMessage('Customer ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('totalPrice').isFloat({ min: 0 }).withMessage('Valid total price is required'),
  body('startMileage').isInt({ min: 0 }).withMessage('Valid start mileage is required'),
  handleValidationErrors,
];

router.post('/', createRentalValidation, createRental);

const returnRentalValidation = [
  body('endMileage').isInt({ min: 0 }).withMessage('Valid end mileage is required'),
  body('fuelLevel').isInt({ min: 0, max: 100 }).withMessage('Fuel level must be between 0 and 100'),
  handleValidationErrors,
];

router.put('/:id/return', returnRentalValidation, returnRental);

/**
 * @swagger
 * /api/rentals/{id}/return:
 *   put:
 *     summary: Return a rental car and calculate additional costs
 *     tags: [Rentals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               endMileage:
 *                 type: integer
 *                 description: Final mileage reading
 *               fuelLevel:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *                 description: Fuel level percentage
 *     responses:
 *       200:
 *         description: Rental completed with cost calculation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 carId:
 *                   type: string
 *                 customerId:
 *                   type: string
 *                 startDate:
 *                   type: string
 *                 endDate:
 *                   type: string
 *                 totalPrice:
 *                   type: number
 *                 status:
 *                   type: string
 *                 startMileage:
 *                   type: integer
 *                 endMileage:
 *                   type: integer
 *                 returnFuelLevel:
 *                   type: integer
 *                 extraMileageCost:
 *                   type: number
 *                   description: Cost for mileage over 200km
 *                 fuelCost:
 *                   type: number
 *                   description: Cost for fuel refill
 *                 totalAdditionalCost:
 *                   type: number
 *                   description: Total additional costs
 */

export default router;
