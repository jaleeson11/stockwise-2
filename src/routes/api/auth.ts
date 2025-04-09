import { Router } from 'express';
import { register, login, refreshToken, logout } from '../../controllers/auth';
import { validateAuthInput } from '../../middleware/validation';
import { authenticateToken } from '../../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validateAuthInput, register);
router.post('/login', validateAuthInput, login);

// Protected routes
router.post('/refresh', refreshToken);
router.post('/logout', authenticateToken, logout);

export default router; 