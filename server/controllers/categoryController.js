import Category from '../models/categoryModel.js';

const DEFAULT_CATEGORIES = ['SPICES', 'PULSES', 'SEEDS', 'DEHYDRATED PRODUCTS'];

// @desc    List all categories (self-seeds the existing defaults the first time)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES.map((name) => ({ name })));
  }
  const categories = await Category.find().sort({ name: 1 });
  res.json(categories);
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    res.status(400).json({ message: 'Category name is required' });
    return;
  }

  const normalized = name.trim().toUpperCase();
  const exists = await Category.findOne({ name: normalized });
  if (exists) {
    res.status(400).json({ message: 'This category already exists' });
    return;
  }

  const category = await Category.create({ name: normalized });
  res.status(201).json(category);
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404).json({ message: 'Category not found' });
    return;
  }
  await Category.deleteOne({ _id: category._id });
  res.json({ message: 'Category removed' });
};

export { getCategories, createCategory, deleteCategory };
