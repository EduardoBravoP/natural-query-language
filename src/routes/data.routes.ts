import { Router } from 'express';
import { body } from 'express-validator';
import { getData } from '../controllers/data.controller';

const router = Router();

// Validation middleware
const dataValidation = [
  body('question').notEmpty().withMessage('Question is required'),
];

// Routes
router.post('/', dataValidation, getData);

export default router; 