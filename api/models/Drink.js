const mongoose = require('mongoose');
const DrinkSchema = new mongoose.Schema({
  name: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  details: Object,
  recepies: Object,
  ingredients: [String],
  imageUrl: String
});

const Drink = mongoose.model('Drink', DrinkSchema);
module.exports = Drink;