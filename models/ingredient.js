var mongoose = require('mongoose');

var ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    calories: { type: Number }
    
});

var Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;