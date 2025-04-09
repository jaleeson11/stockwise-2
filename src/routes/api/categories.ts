import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} from '../../controllers/categoryController';
import { validateCategory } from '../../middleware/validators/categoryValidator';

const router = Router();

// CRUD routes for categories
router.post('/', validateCategory, createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', validateCategory, updateCategory);
router.delete('/:id', deleteCategory);

export default router; 