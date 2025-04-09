import { Router } from 'express';
import { 
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from '../../controllers/productController';
import {
  createVariant,
  getProductVariants
} from '../../controllers/variantController';
import { validateProduct } from '../../middleware/validators/productValidator';
import { validateVariant } from '../../middleware/validators/variantValidator';

const router = Router();

// Product routes
// Create a new product
router.post('/', validateProduct, createProduct);

// Get all products with optional filtering
router.get('/', getProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Update a product
router.put('/:id', validateProduct, updateProduct);

// Delete a product
router.delete('/:id', deleteProduct);

// Product variant routes
// Create a new variant for a product
router.post('/:productId/variants', validateVariant, createVariant);

// Get all variants for a product
router.get('/:productId/variants', getProductVariants);

export default router; 