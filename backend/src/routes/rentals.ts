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

export default router;
