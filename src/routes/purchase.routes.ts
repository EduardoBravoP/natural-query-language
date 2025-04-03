import { Router } from 'express';
import { body } from 'express-validator';
import { createPurchase, getPurchases, getPurchaseById } from '../controllers/purchase.controller';

const router = Router();

// Validation middleware
const purchaseValidation = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.bookId').notEmpty().withMessage('Book ID is required for each item'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

// Routes
router.post('/', purchaseValidation, createPurchase);
router.get('/', getPurchases);
router.get('/:id', getPurchaseById);

export default router; 