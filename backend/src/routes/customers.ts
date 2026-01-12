import { Router } from 'express';
import { getAllCustomers, addCustomer } from '../controllers/customersController';
import { authenticateToken } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

// All customer routes require authentication
router.use(authenticateToken);

const customerValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('licenseNumber').trim().notEmpty().withMessage('License number is required'),
  handleValidationErrors,
];

router.get('/', getAllCustomers);
router.post('/', customerValidation, addCustomer);

export default router;
