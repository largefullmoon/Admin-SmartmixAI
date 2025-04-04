const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const Drink = require('../models/Drink');

// Get all drinks
router.get('/', async (req, res) => {
  try {
    const drinks = await Drink.find().populate('category');
    res.json(drinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new drink
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name, category, details, ingredients, recepies } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const drink = new Drink({
      name,
      category,
      details: JSON.parse(details),
      ingredients: JSON.parse(ingredients),
      recepies: JSON.parse(recepies),
      imageUrl
    });
    
    const newDrink = await drink.save();
    res.status(201).json(newDrink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update drink
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, category, details, ingredients } = req.body;
    const updateData = {
      name,
      category,
      details: JSON.parse(details),
      ingredients: JSON.parse(ingredients)
    };
    
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const drink = await Drink.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('category');
    
    res.json(drink);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete drink
router.delete('/:id', async (req, res) => {
  try {
    await Drink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Drink deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 