import { Router } from 'express';
import {
  getVariantById,
  updateVariant,
  deleteVariant,
  updateInventory,
  getInventoryHistory
} from '../../controllers/variantController';
import { validateVariant, validateInventory } from '../../middleware/validators/variantValidator';

const router = Router();

// Variant routes
router.get('/:id', getVariantById);
router.put('/:id', validateVariant, updateVariant);
router.delete('/:id', deleteVariant);

// Inventory routes
router.put('/:id/inventory', validateInventory, updateInventory);
router.get('/:id/inventory/history', getInventoryHistory);

export default router; 