import { Router } from 'express';
import productRoutes from './products';
import categoryRoutes from './categories';
import variantRoutes from './variants';
import authRoutes from './auth';

const router = Router();

// Register all API routes
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/variants', variantRoutes);
router.use('/auth', authRoutes);

// Add more API routes here as they are developed
// router.use('/inventory', inventoryRoutes);
// etc.

export default router; 