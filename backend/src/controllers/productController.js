const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

/**
 * @desc    List products with optional search, category filter, low-stock
 *          filter, and pagination
 * @route   GET /api/products?search=&category=&lowStock=true&page=1&limit=10
 * @access  Private
 */
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, lowStock, page = 1, limit = 10 } = req.query;

  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  if (lowStock === 'true') {
    filter.lowStock = 'true';
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    success: true,
    count: products.length,
    total,
    page: pageNum,
    pages: Math.ceil(total / limitNum) || 1,
    data: products,
  });
});

/**
 * @desc    Get a single product by id
 * @route   GET /api/products/:id
 * @access  Private
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, data: product });
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body, createdBy: req.user._id };
  const product = await Product.create(productData);
  res.status(201).json({ success: true, data: product });
});

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const fields = [
    'name', 'sku', 'category', 'description', 'price',
    'quantity', 'reorderLevel', 'supplier', 'warehouseLocation',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  const updated = await product.save();
  res.json({ success: true, data: updated });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  await product.deleteOne();
  res.json({ success: true, data: {} });
});

/**
 * @desc    Get dashboard summary stats (totals, inventory value, low stock count)
 * @route   GET /api/products/stats/summary
 * @access  Private
 */
const getProductStats = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments();
  const aggregateResult = await Product.aggregate();
  const lowStockCount = await Product.countDocuments({ lowStock: 'true' });

  const { totalUnits = 0, totalValue = 0 } = aggregateResult[0] || {};

  res.json({
    success: true,
    data: {
      totalProducts,
      totalUnits,
      totalValue: Math.round(totalValue * 100) / 100,
      lowStockCount,
    },
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductStats,
};
