var mongoose = require('mongoose');

var recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    ingredients: [{
        ingredient: { type: mongoose.Schema.ObjectId },
        unit: { type: Number }
        }],
    steps: { type: String }
        
    
});

var Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;