const { body, param } = require('express-validator');

const categoryValidator = [
  body('name').trim().notEmpty().withMessage('Category name is required').isLength({ max: 50 }),
  body('description').optional().isLength({ max: 250 }),
];

const categoryIdValidator = [param('id').notEmpty().withMessage('Invalid category id')];

module.exports = { categoryValidator, categoryIdValidator };
