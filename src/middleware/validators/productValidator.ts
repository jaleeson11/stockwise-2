import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation rules for product creation and updates
export const productValidationRules = [
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .isString()
    .withMessage('SKU must be a string')
    .isLength({ min: 3, max: 50 })
    .withMessage('SKU must be between 3 and 50 characters'),
  
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isString()
    .withMessage('Product name must be a string')
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),
  
  body('categoryId')
    .trim()
    .notEmpty()
    .withMessage('Category ID is required')
    .isString()
    .withMessage('Category ID must be a string')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category ID must be between 1 and 50 characters')
];

// Middleware that runs the validation and returns errors if any
export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  // Run validation rules
  return Promise.all(productValidationRules.map(validation => validation.run(req)))
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