const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');

/**
 * @desc    List all categories
 * @route   GET /api/categories
 * @access  Private
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ success: true, count: categories.length, data: categories });
});

/**
 * @desc    Get a single category by id
 * @route   GET /api/categories/:id
 * @access  Private
 */
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json({ success: true, data: category });
});

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await Category.create({ name, description });
  res.status(201).json({ success: true, data: category });
});

/**
 * @desc    Update an existing category
 * @route   PUT /api/categories/:id
 * @access  Private
 */
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const updatedName = req.body.name ?? category.name;
  const updatedDesc = req.body.description ?? category.description;

  const { pool } = require('../config/db');
  await pool.execute(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [updatedName, updatedDesc, req.params.id]
  );

  const updated = await Category.findById(req.params.id);
  res.json({ success: true, data: updated });
});

/**
 * @desc    Delete a category (blocked if products still reference it)
 * @route   DELETE /api/categories/:id
 * @access  Private
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  const productCount = await Category.countDocuments({ category: category._id });
  if (productCount > 0) {
    res.status(409);
    throw new Error(`Cannot delete category: ${productCount} product(s) still reference it`);
  }

  await Category.deleteOne(req.params.id);
  res.json({ success: true, data: {} });
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
