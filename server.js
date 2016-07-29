//Recipe Log
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var config = require('./config');
var express = require('express');
var jsonParser = bodyParser.json();
var mongoose = require('mongoose');
var passport = require('passport');

var app = express();
var BasicStrategy = require('passport-http').BasicStrategy;

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

//Models
var User = require('./models/user');
var Ingredient = require('./models/ingredient');
var Recipe = require('./models/recipe');

//Protecting the endpoint

var strategy = new BasicStrategy(function(username, password, callback) {
    User.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            callback(err);
            return;
        }

        if (!user) {
            return callback(null, false, {
                message: 'Incorrect username.'
            });
        }

        user.validatePassword(password, function(err, isValid) {
            if (err) {
                return callback(err);
            } if (!isValid) {
                return callback(null, false, {
                    message: 'Incorrect password.'
                });
            }
            return callback(null, user);
        });
    });
});

passport.use(strategy);
//--end--






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
    console.log('req body', req.body);
    Ingredient.create({
        name: req.body.name
    }, function(err, ingredient) {
        if (err) {
            console.log('post ingredient err', err);
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




//User server
app.post('/users', jsonParser, function(req, res) {
    var username = req.body.username;
    username = username.trim();
    if (!req.body) {
        return res.status(400).json({
            message: "No request body"
        });
    }

    if (!('username' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: username'
        });
    }

    if (typeof username !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: username'
        });
    }

    if (username === '') {
        return res.status(422).json({
            message: 'Incorrect field length: username'
        });
    }

    if (!('password' in req.body)) {
        return res.status(422).json({
            message: 'Missing field: password'
        });
    }

    var password = req.body.password;

    if (typeof password !== 'string') {
        return res.status(422).json({
            message: 'Incorrect field type: password'
        });
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({
            message: 'Incorrect field length: password'
        });
    }

    //Hashing the password
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return res.status(500).json({
                message: '2 Internal server error'
            });
        }

        bcrypt.hash(password, salt, function(err, hash) {
            if (err) {
                return res.status(500).json({
                    message: '3 Internal server error'
                });
            }

            var user = new User({
                username: username,
                password: hash
            });

            user.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        message: '4 Internal server error'
                    });
                }

                return res.status(201).json({});
            });
        });
    });
});

app.get('/users', function(req, res) {
    User.find(function(err, users) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.json(users);
    });
});

app.delete('/users/:id', function(req, res) {
    User.remove({
        _id: req.params.id
    }, function(err, user) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(user);
    });
});

app.use(passport.initialize());


app.get('/hidden', passport.authenticate('basic', {session: false}), function(req, res) {
    res.json({
        message: 'Luke... I am your father'
    });
});

app.use('/*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});

mongoose.connect(config.DATABASE_URL, function(err) {
    if (err) {
        console.log('mongoose error', err);
    }

    app.listen(config.PORT, function() {
        console.log('Listening on localhost:' + config.PORT);
    });
});