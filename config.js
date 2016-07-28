exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://agb:agb@ds031965.mlab.com:31965/recipe-log' :
                            'mongodb://localhost/recipe-log');
exports.PORT = process.env.PORT || 8080;