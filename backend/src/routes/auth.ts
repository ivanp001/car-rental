import { Router } from 'express';
import { login, register, getCurrentUser } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';
import { body } from 'express-validator';

const router = Router();

// Validation middleware
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('role').optional().isIn(['admin', 'staff']),
  handleValidationErrors,
];

// Routes
router.post('/login', loginValidation, login);
router.post('/register', registerValidation, register);
router.get('/me', authenticateToken, getCurrentUser);

export default router;
