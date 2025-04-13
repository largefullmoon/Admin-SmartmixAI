import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaPlus, FaTimes } from 'react-icons/fa';

const DrinkForm = ({ drink, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    details: {
      price: '',
      description: '',
      volume: '',
      alcoholContent: '',
    },
    recepies : {
      acid : 0,
      sugar: 0,
      creamy: 0,
      spicy: 0,
      amer : 0
    },
    ingredients: [],

  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newIngredient, setNewIngredient] = useState('');

  useEffect(() => {
    fetchCategories();
    if (drink) {
      setFormData({
        name: drink.name,
        category: drink.category?._id || '',
        details: drink.details || {
          price: '',
          description: '',
          volume: '',
          alcoholContent: '',
        },
        recepies : drink.recepies || {
          acid : 0,
          sugar: 0,
          creamy: 0,
          spicy: 0,
          amer : 0
        },
        ingredients: drink.ingredients || [],
      });
      setPreview(drink.imageUrl || '');
    }
  }, [drink]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      setError('Failed to fetch categories');
      console.error('Error fetching categories:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetailChange = (field) => (e) => {
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        [field]: e.target.value,
      },
    });
  };

  const handleRecepieChange = (field) => (e) => {
    setFormData({
      ...formData,
      recepies: {
        ...formData.recepies,
        [field]: e.target.value,
      },
    });
  };

  const handleAddIngredient = () => {
    if (newIngredient.trim() && !formData.ingredients.includes(newIngredient.trim())) {
      setFormData({
        ...formData,
        ingredients: [...formData.ingredients, newIngredient.trim()],
      });
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((i) => i !== ingredient),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim()) {
      setError('Drink name is required');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    const submitData = new FormData();
    submitData.append('name', formData.name.trim());
    submitData.append('category', formData.category);
    submitData.append('details', JSON.stringify(formData.details));
    submitData.append('ingredients', JSON.stringify(formData.ingredients));
    submitData.append('recepies', JSON.stringify(formData.recepies));
    if (image) submitData.append('image', image);

    try {
      const url = drink 
        ? `${import.meta.env.VITE_API_URL}/api/drinks/${drink._id}` 
        : `${import.meta.env.VITE_API_URL}/api/drinks`;
      const method = drink ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (response.ok) {
        setSuccess(drink ? 'Drink updated successfully!' : 'Drink added successfully!');
        if (!drink) {
          setFormData({
            name: '',
            category: '',
            details: {
              price: '',
              description: '',
              volume: '',
              alcoholContent: '',
            },
            ingredients: [],
          });
          setImage(null);
          setPreview('');
        }
        if (onSuccess) onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || (drink ? 'Failed to update drink' : 'Failed to add drink'));
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {drink ? 'Update Drink' : 'Add New Drink'}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Drink Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                id="price"
                value={formData.details.price}
                onChange={handleDetailChange('price')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-1">
                Volume (ml)
              </label>
              <input
                type="number"
                id="volume"
                value={formData.details.volume}
                onChange={handleDetailChange('volume')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="alcoholContent" className="block text-sm font-medium text-gray-700 mb-1">
                Alcohol Content (%)
              </label>
              <input
                type="number"
                id="alcoholContent"
                value={formData.details.alcoholContent}
                onChange={handleDetailChange('alcoholContent')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.details.description}
                onChange={handleDetailChange('description')}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>


        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input id={'acid'} handleChange={handleRecepieChange} value={formData.recepies.acid}  />
            <Input id={'sugar'} handleChange={handleRecepieChange} value={formData.recepies.sugar} />
            <Input id={'creamy'} handleChange={handleRecepieChange}  value={formData.recepies.creamy}/>
            <Input id={'spicy'} handleChange={handleRecepieChange}  value={formData.recepies.spicy}/>
            <Input id={'amer'} handleChange={handleRecepieChange} value={formData.recepies.amer} />
          </div>
        </div>



        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ingredients</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              placeholder="Add ingredient"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddIngredient}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FaPlus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.ingredients.map((ingredient) => (
              <span
                key={ingredient}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {ingredient}
                <button
                  type="button"
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Drink Image
          </label>
          <input
            type="file"
            id="drink-image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="drink-image"
            className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
          >
            <FaCloudUploadAlt className="w-5 h-5 mr-2 text-gray-500" />
            <span className="text-gray-700">
              {drink ? 'Change Image' : 'Upload Image'}
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
          disabled={!formData.name.trim() || !formData.category}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            formData.name.trim() && formData.category
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {drink ? 'Update Drink' : 'Add Drink'}
        </button>
      </form>
    </div>
  );
};

export default DrinkForm;


const Input = ({ id, handleChange, value }) => (
   <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                {id}
              </label>
              <input
                type="number"
                id={id}
                value={value}
                onChange={handleChange(id)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
)