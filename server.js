//Recipe Log
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var config = require('./config');

var app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

exports.app = app;
exports.runServer = runServer;

var Ingredient = require('./models/ingredient');
var Recipe = require('./models/recipe');


app.get('/ingredient', function(req, res) {
    Ingredient.find(function(err, ingredients) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(ingredients);
    });
});

app.get('/recipe', function(req, res) {
    Recipe.find(function(err, recipes) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(recipes);
    });
});


app.post('/ingredient', function(req, res) {
    Ingredient.create({
        name: req.body.name
    }, function(err, ingredient) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(ingredient);
    });
});

app.post('/recipe', function(req, res) {
    Recipe.create({
        name: req.body.name
    }, function(err, recipe) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(201).json(recipe);
    });
});

app.put('/ingredient/:id', function(req, res) {
    Ingredient.update({ 
        _id: req.params.id
    }, {name: req.body.name}, function(err, ingredient) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(ingredient);
    });
});

app.put('/recipe/:id', function(req, res) {
    Recipe.update({ 
        _id: req.params.id
    }, {name: req.body.name}, function(err, recipe) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(recipe);
    });
});

app.delete('/recipe/:id', function(req, res) {
    Recipe.remove({
        _id: req.params.id
    }, function(err, recipe) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(recipe);
    });
});

app.delete('/ingredient/:id', function(req, res) {
    Ingredient.remove({
        _id: req.params.id
    }, function(err, ingredient) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(ingredient);
    });
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});