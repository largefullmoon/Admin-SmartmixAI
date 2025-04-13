const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Category = require('../models/Category');
const path = require('path');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
    console.log({error: error.message});
  }
});

// Create new category with image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const category = new Category({
      name: name.trim(),
      imageUrl
    });
    
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create category' });
    console.log({error: error.message});
  }
});

// Update category
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const updateData = { name: name.trim() };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update category' });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category' });
  }
});

module.exports = router;