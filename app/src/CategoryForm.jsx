import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

const CategoryForm = ({ category, onSuccess }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setPreview(category.imageUrl || '');
    }
  }, [category]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setError('');
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Category name is required');
      return;
    }

    const formData = new FormData();
    formData.append('name', name.trim());
    if (image) formData.append('image', image);

    try {
      const url = category 
        ? `${import.meta.env.VITE_API_URL}/api/categories/${category._id}` 
        : `${import.meta.env.VITE_API_URL}/api/categories`;
      const method = category ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formData,
      });

      if (response.ok) {
        setSuccess(category ? 'Category updated successfully!' : 'Category added successfully!');
        if (!category) {
          setName('');
          setImage(null);
          setPreview('');
        }
        if (onSuccess) onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || (category ? 'Failed to update category' : 'Failed to add category'));
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {category ? 'Update Category' : 'Add New Category'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category Image
          </label>
          <input
            type="file"
            id="category-image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="category-image"
            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <FaCloudUploadAlt className="w-5 h-5 mr-2 text-gray-500" />
            <span className="text-gray-700">
              {category ? 'Change Image' : 'Upload Image'}
            </span>
          </label>
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-48 object-contain rounded-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={!name.trim()}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            name.trim()
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {category ? 'Update Category' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;