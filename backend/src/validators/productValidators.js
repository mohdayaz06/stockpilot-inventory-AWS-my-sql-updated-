const { body, param } = require('express-validator');

const productValidator = [
  body('name').trim().notEmpty().withMessage('Product name is required').isLength({ max: 100 }),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').notEmpty().withMessage('Price is required').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('quantity').optional().isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('reorderLevel').optional().isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer'),
  body('description').optional().isLength({ max: 500 }),
  body('supplier').optional().isLength({ max: 100 }),
  body('warehouseLocation').optional().isLength({ max: 50 }),
];

const productIdValidator = [param('id').notEmpty().withMessage('Invalid product id')];

module.exports = { productValidator, productIdValidator };
