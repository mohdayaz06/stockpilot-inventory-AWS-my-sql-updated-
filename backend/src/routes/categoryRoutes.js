const express = require('express');
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { categoryValidator, categoryIdValidator } = require('../validators/categoryValidators');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All category routes require an authenticated user
router.use(protect);

router
  .route('/')
  .get(getCategories)
  .post(authorize('admin', 'staff'), categoryValidator, validate, createCategory);

router
  .route('/:id')
  .get(categoryIdValidator, validate, getCategoryById)
  .put(authorize('admin', 'staff'), categoryIdValidator, categoryValidator, validate, updateCategory)
  .delete(authorize('admin'), categoryIdValidator, validate, deleteCategory);

module.exports = router;
