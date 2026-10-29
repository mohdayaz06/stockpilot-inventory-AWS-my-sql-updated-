const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
} = require('../controllers/productController');
const { productValidator, productIdValidator } = require('../validators/productValidators');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All product routes require an authenticated user
router.use(protect);

// Stats route is declared before "/:id" so "stats" isn't parsed as an id
router.get('/stats/summary', getProductStats);

router
  .route('/')
  .get(getProducts)
  .post(authorize('admin', 'staff'), productValidator, validate, createProduct);

router
  .route('/:id')
  .get(productIdValidator, validate, getProductById)
  .put(authorize('admin', 'staff'), productIdValidator, productValidator, validate, updateProduct)
  .delete(authorize('admin'), productIdValidator, validate, deleteProduct);

module.exports = router;
