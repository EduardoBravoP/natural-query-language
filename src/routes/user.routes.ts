import { Router } from 'express';
import { body } from 'express-validator';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/user.controller';

const router = Router();

// Validation middleware
const userValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number format'),
];

// Routes
router.post('/', userValidation, createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', userValidation, updateUser);
router.delete('/:id', deleteUser);

export default router; 