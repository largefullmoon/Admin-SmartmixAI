import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaUserCheck, FaUsers, FaSignOutAlt, FaChartLine, FaCocktail, FaTags, FaGlassMartiniAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CategoryList from './CategoryList';
import DrinkList from './DrinkList';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const getUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/users`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setUsers(response.data.users);
        } catch (error) {
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div className="p-4">
            <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                <FaUsers className="text-blue-600" />
                <span className='text-white'>Users Management</span>
            </h2>
            <p className="mb-4 text-gray-300">
                View and manage system users
            </p>

            {loading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr className="text-sm leading-normal text-gray-600 uppercase bg-gray-100">
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Join Date</th>
                                <th className="px-6 py-3 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            {users.map(user => (
                                <tr className="border-b border-gray-200 hover:bg-gray-50" key={user.id}>
                                    <td className="px-6 py-3 text-left">{user.email}</td>
                                    <td className="px-6 py-3 text-left">{user.name}</td>
                                    <td className="px-6 py-3 text-left">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-3 text-left">
                                        <span className={`px-2 py-1 rounded-full text-xs ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function DrinkRecipeManagement() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingRecipe, setEditingRecipe] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        ingredients: [''],
        instructions: [''],
        description: ''
    });

    const getRecipes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/recipes`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setRecipes(response.data.recipes);
        } catch (error) {
            toast.error('Failed to fetch recipes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getRecipes();
    }, []);

    const resetFormData = () => {
        setFormData({
            name: '',
            ingredients: [''],
            instructions: [''],
            description: ''
        });
        setEditingRecipe(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRecipe) {
                await axios.put(`${import.meta.env.VITE_API_URL}/admin/recipes/${editingRecipe.id}`, formData, {
                    headers: { 'Content-Type': 'application/json' }
                });
                toast.success('Recipe updated successfully');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/admin/recipes`, formData, {
                    headers: { 'Content-Type': 'application/json' }
                });
                toast.success('Recipe created successfully');
            }
            setShowModal(false);
            resetFormData();
            getRecipes();
        } catch (error) {
            toast.error(editingRecipe ? 'Failed to update recipe' : 'Failed to create recipe');
        }
    };

    const handleDelete = async (recipeId) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/admin/recipes/${recipeId}`, {
                    headers: { 'Content-Type': 'application/json' }
                });
                toast.success('Recipe deleted successfully');
                getRecipes();
            } catch (error) {
                toast.error('Failed to delete recipe');
            }
        }
    };

    const handleEdit = (recipe) => {
        setEditingRecipe(recipe);
        setFormData({
            name: recipe.name,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            description: recipe.description
        });
        setShowModal(true);
    };

    const addField = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeField = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const updateField = (field, index, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].map((item, i) => i === index ? value : item)
        }));
    };

    return (
        <div className="p-4">
            <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                <FaCocktail className="text-purple-600" />
                <span className='text-white'>Drink Recipes Management</span>
            </h2>
            <p className="mb-4 text-gray-300">
                Manage cocktail recipes and their details
            </p>

            <button
                onClick={() => {
                    resetFormData();
                    setShowModal(true);
                }}
                className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
                Add New Recipe
            </button>

            {loading ? (
                <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded shadow">
                        <thead>
                            <tr className="text-sm leading-normal text-gray-600 uppercase bg-gray-100">
                                <th className="px-6 py-3 text-left">Name</th>
                                <th className="px-6 py-3 text-left">Ingredients</th>
                                <th className="px-6 py-3 text-left">Instructions</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            {recipes.map(recipe => (
                                <tr className="border-b border-gray-200 hover:bg-gray-50" key={recipe.id}>
                                    <td className="px-6 py-3 text-left font-medium">{recipe.name}</td>
                                    <td className="px-6 py-3 text-left">
                                        <ul className="list-disc list-inside">
                                            {recipe.ingredients.map((ingredient, index) => (
                                                <li key={index}>{ingredient}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-3 text-left">
                                        <ol className="list-decimal list-inside">
                                            {recipe.instructions.map((step, index) => (
                                                <li key={index}>{step}</li>
                                            ))}
                                        </ol>
                                    </td>
                                    <td className="px-6 py-3 text-left">{recipe.description}</td>
                                    <td className="px-6 py-3 text-left">
                                        <button
                                            onClick={() => handleEdit(recipe)}
                                            className="mr-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(recipe.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
                        <h3 className="text-xl font-bold mb-4">
                            {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Ingredients</label>
                                {formData.ingredients.map((ingredient, index) => (
                                    <div key={index} className="flex mb-2">
                                        <input
                                            type="text"
                                            value={ingredient}
                                            onChange={(e) => updateField('ingredients', index, e.target.value)}
                                            className="flex-1 p-2 border rounded"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeField('ingredients', index)}
                                            className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addField('ingredients')}
                                    className="px-3 py-1 bg-green-500 text-white rounded"
                                >
                                    Add Ingredient
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Instructions</label>
                                {formData.instructions.map((instruction, index) => (
                                    <div key={index} className="flex mb-2">
                                        <input
                                            type="text"
                                            value={instruction}
                                            onChange={(e) => updateField('instructions', index, e.target.value)}
                                            className="flex-1 p-2 border rounded"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeField('instructions', index)}
                                            className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addField('instructions')}
                                    className="px-3 py-1 bg-green-500 text-white rounded"
                                >
                                    Add Instruction
                                </button>
                            </div>

                            <div className="mb-4">
                                <label className="block mb-2">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetFormData();
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded"
                                >
                                    {editingRecipe ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminContainer() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        totalRecipes: 0,
        totalCategories: 0,
        totalDrinks: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/admin/stats`);
            setStats(response.data);
        } catch (error) {
            toast.error('Failed to fetch statistics');
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('isSigned');
        window.location.href = '/login';
    };

    function renderContent() {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="p-4">
                        <h2 className="flex items-center gap-2 mb-4 text-xl font-semibold">
                            <FaChartLine className="text-green-600" />
                            <span className='text-white'>Dashboard</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded shadow">
                                <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
                                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow">
                                <h3 className="text-lg font-semibold text-gray-700">Active Users</h3>
                                <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow">
                                <h3 className="text-lg font-semibold text-gray-700">Total Recipes</h3>
                                <p className="text-3xl font-bold text-purple-600">{stats.totalRecipes}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow">
                                <h3 className="text-lg font-semibold text-gray-700">Total Categories</h3>
                                <p className="text-3xl font-bold text-orange-600">{stats.totalCategories}</p>
                            </div>
                            <div className="bg-white p-4 rounded shadow">
                                <h3 className="text-lg font-semibold text-gray-700">Total Drinks</h3>
                                <p className="text-3xl font-bold text-red-600">{stats.totalDrinks}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'users':
                return <UserManagement />;
            case 'recipes':
                return <DrinkRecipeManagement />;
            case 'categories':
                return <CategoryList />;
            case 'drinks':
                return <DrinkList />;
            default:
                return null;
        }
    }

    return (
        <div className="min-h-screen bg-gray-900">
            <nav className="bg-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-white text-xl font-bold">Admin Panel</h1>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        <FaSignOutAlt />
                        Sign Out
                    </button>
                </div>
            </nav>

            <div className="container mx-auto flex">
                <div className="w-64 bg-gray-800 min-h-screen p-4">
                    <nav className="space-y-2">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded ${
                                activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaChartLine />
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded ${
                                activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaUsers />
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('recipes')}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded ${
                                activeTab === 'recipes' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaCocktail />
                            Recipes
                        </button>
                        <button
                            onClick={() => setActiveTab('categories')}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded ${
                                activeTab === 'categories' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaTags />
                            Categories
                        </button>
                        <button
                            onClick={() => setActiveTab('drinks')}
                            className={`w-full flex items-center gap-2 px-4 py-2 rounded ${
                                activeTab === 'drinks' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            <FaGlassMartiniAlt />
                            Drinks
                        </button>
                    </nav>
                </div>

                <div className="flex-1">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}
