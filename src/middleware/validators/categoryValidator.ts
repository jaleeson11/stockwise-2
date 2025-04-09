import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

// Validation rules for category creation and updates
export const categoryValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isString()
    .withMessage('Category name must be a string')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  
  body('parentId')
    .optional({ nullable: true })
    .isString()
    .withMessage('Parent category ID must be a string')
];

// Middleware that runs the validation and returns errors if any
export const validateCategory = (req: Request, res: Response, next: NextFunction) => {
  // Run validation rules
  return Promise.all(categoryValidationRules.map(validation => validation.run(req)))
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