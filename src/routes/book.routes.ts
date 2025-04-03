import { Router } from 'express';
import { body } from 'express-validator';
import { createBook, getBooks, getBookById, updateBook, deleteBook } from '../controllers/book.controller';

const router = Router();

// Validation middleware
const bookValidation = [
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('publisher').notEmpty().withMessage('Publisher is required'),
  body('publicationYear').isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Invalid publication year'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stockQuantity').isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  body('genre').notEmpty().withMessage('Genre is required'),
];

// Routes
router.post('/', bookValidation, createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);
router.put('/:id', bookValidation, updateBook);
router.delete('/:id', deleteBook);

export default router; 