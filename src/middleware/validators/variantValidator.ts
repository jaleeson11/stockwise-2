import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation rules for variant creation and updates
export const variantValidationRules = [
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .isString()
    .withMessage('SKU must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('SKU must be between 3 and 50 characters'),
  
  body('attributes')
    .isObject()
    .withMessage('Attributes must be a valid object'),
  
  body('inventory')
    .optional()
    .isObject()
    .withMessage('Inventory must be a valid object'),
  
  body('inventory.quantity')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('inventory.lowStockThreshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Low stock threshold must be a non-negative integer')
];

// Validation rules for inventory updates
export const inventoryValidationRules = [
  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),
  
  body('lowStockThreshold')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Low stock threshold must be a non-negative integer'),
  
  body('reason')
    .optional()
    .isString()
    .withMessage('Reason must be a string')
    .isLength({ max: 255 })
    .withMessage('Reason cannot exceed 255 characters')
];

// Middleware that runs the validation and returns errors if any
export const validateVariant = (req: Request, res: Response, next: NextFunction) => {
  // Run validation rules
  return Promise.all(variantValidationRules.map(validation => validation.run(req)))
    .then(() => {
      // Check for validation errors
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // Format errors and return response
      const extractedErrors: { [key: string]: string } = {};
      errors.array().forEach(err => {
        if (err.type === 'field') {
          extractedErrors[err.path] = err.msg;
        }
      });

      return res.status(422).json({
        error: true,
        message: 'Validation failed',
        errors: extractedErrors
      });
    });
};

// Middleware for inventory validation
export const validateInventory = (req: Request, res: Response, next: NextFunction) => {
  // Run validation rules
  return Promise.all(inventoryValidationRules.map(validation => validation.run(req)))
    .then(() => {
      // Check for validation errors
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // Format errors and return response
      const extractedErrors: { [key: string]: string } = {};
      errors.array().forEach(err => {
        if (err.type === 'field') {
          extractedErrors[err.path] = err.msg;
        }
      });

      return res.status(422).json({
        error: true,
        message: 'Validation failed',
        errors: extractedErrors
      });
    });
}; 