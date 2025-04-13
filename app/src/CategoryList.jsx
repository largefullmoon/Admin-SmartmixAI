import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import CategoryForm from "./CategoryForm";

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            setError("Failed to fetch categories");
            console.error("Error fetching categories:", error);
        }
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${categoryId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setSuccess("Category deleted successfully");
                fetchCategories();
            } else {
                const data = await response.json();
                setError(data.message || "Failed to delete category");
            }
        } catch (error) {
            setError("Error connecting to server");
            console.error("Error:", error);
        }
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setSelectedCategory(null);
        setEditDialogOpen(false);
    };

    const handleEditSuccess = () => {
        handleEditClose();
        fetchCategories();
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setEditDialogOpen(true);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Categories</h2>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

            <div className="flex justify-end mb-4">
                <button
                    onClick={handleCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                    <FaPlus className="w-4 h-4" />
                    Add New Category
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="relative h-48">
                            <img src={`${import.meta.env.VITE_API_URL}${category.imageUrl}` || "/placeholder.jpg"} alt={category.name} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                                >
                                    <FaEdit className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => handleDelete(category._id)}
                                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                >
                                    <FaTrash className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {editDialogOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Edit Category</h3>
                                <button onClick={handleEditClose} className="text-gray-500 hover:text-gray-700">
                                    <span className="sr-only">Close</span>
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <CategoryForm category={selectedCategory} onSuccess={handleEditSuccess} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryList;
