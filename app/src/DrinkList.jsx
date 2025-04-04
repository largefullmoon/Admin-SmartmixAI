import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import DrinkForm from './DrinkForm';

const DrinkList = () => {
  const [drinks, setDrinks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedDrink, setSelectedDrink] = useState(null);

  useEffect(() => {
    fetchDrinks();
  }, []);

  const fetchDrinks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/drinks`);
      const data = await response.json();
      setDrinks(data);
    } catch (error) {
      setError('Failed to fetch drinks');
      console.error('Error fetching drinks:', error);
    }
  };

  const handleDelete = async (drinkId) => {
    if (!window.confirm('Are you sure you want to delete this drink?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/drinks/${drinkId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Drink deleted successfully');
        fetchDrinks();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete drink');
      }
    } catch (error) {
      setError('Error connecting to server');
      console.error('Error:', error);
    }
  };

  const handleEdit = (drink) => {
    setSelectedDrink(drink);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setSelectedDrink(null);
    setEditDialogOpen(false);
  };

  const handleEditSuccess = () => {
    handleEditClose();
    fetchDrinks();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Drinks</h2>

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
      <div className="mb-6">
        <button
          onClick={() => setEditDialogOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Add New Drink
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {editDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {selectedDrink ? 'Edit Drink' : 'Add New Drink'}
                  </h3>
                  <button
                    onClick={handleEditClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <DrinkForm
                  drink={selectedDrink}
                  onSuccess={handleEditSuccess}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {drinks.map((drink) => (
          <div key={drink._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-48">
              <img
                src={drink.imageUrl || '/placeholder.jpg'}
                alt={drink.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => handleEdit(drink)}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(drink._id)}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{drink.name}</h3>
              </div>

              <p className="text-sm text-gray-600 mb-3">
                Category: {drink.category?.name || 'Uncategorized'}
              </p>

              <div className="flex flex-wrap gap-2 mb-3">
                {drink.details?.price && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    ${drink.details.price}
                  </span>
                )}
                {drink.details?.volume && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {drink.details.volume}ml
                  </span>
                )}
                {drink.details?.alcoholContent && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    {drink.details.alcoholContent}%
                  </span>
                )}
              </div>

              {drink.details?.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {drink.details.description}
                </p>
              )}

              {drink.ingredients && drink.ingredients.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Ingredients:</h4>
                  <div className="flex flex-wrap gap-2">
                    {drink.ingredients.map((ingredient, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {editDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Edit Drink</h3>
                <button
                  onClick={handleEditClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <DrinkForm
                drink={selectedDrink}
                onSuccess={handleEditSuccess}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrinkList; 