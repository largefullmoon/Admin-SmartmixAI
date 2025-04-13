const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const Drink = require('../models/Drink');

// Get admin dashboard statistics
router.get('/stats', async (req, res) => {
    try {
        const [
            totalUsers,
            activeUsers,
            totalRecipes,
            totalCategories,
            totalDrinks
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ active: true }),
            Recipe.countDocuments(),
            Category.countDocuments(),
            Drink.countDocuments()
        ]);

        res.json({
            totalUsers,
            activeUsers,
            totalRecipes,
            totalCategories,
            totalDrinks
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch statistics', error: error.message });
    }
});

// User Management Routes
router.get('/users', async (req, res) => {
    try {
        const users = await User.find()
            .select('email name created_at active')
            .sort({ created_at: -1 });
        res.json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});

// Recipe Management Routes
router.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find().sort({ name: 1 });
        res.json({ recipes });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch recipes', error: error.message });
    }
});

router.post('/recipes', async (req, res) => {
    try {
        const { name, ingredients, instructions, description } = req.body;
        
        if (!name || !ingredients?.length || !instructions?.length) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const recipe = new Recipe({
            name,
            ingredients,
            instructions,
            description
        });

        const newRecipe = await recipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create recipe' });
    }
});

router.put('/recipes/:id', async (req, res) => {
    try {
        const { name, ingredients, instructions, description } = req.body;
        
        if (!name || !ingredients?.length || !instructions?.length) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            {
                name,
                ingredients,
                instructions,
                description
            },
            { new: true }
        );

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update recipe' });
    }
});

router.delete('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete recipe' });
    }
});

// Middleware to check admin authorization
const checkAdminAuth = (req, res, next) => {
    // Add your admin authentication logic here
    // For example, check if the user has admin role
    if (!req.user?.isAdmin) {
        return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
};

// Apply admin authentication middleware to all routes
router.use(checkAdminAuth);

module.exports = router; 