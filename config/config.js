const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || 3000,
        dbURL: 'mongodb://localhost:27017/Used-Furniture',
        // dbURL: process.env.DB_URL_CREDENTIALS,
    origin: ['http://localhost:3000']
    },
    production: {
        port: process.env.PORT || 8080,
        dbURL: process.env.DB_URL_CREDENTIALS,
        origin: ['https://used-furniture-680be.web.app']
    }
};


module.exports = config[env];


