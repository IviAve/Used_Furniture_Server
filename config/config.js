const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        port: process.env.PORT || PORT,
        // dbURL: 'mongodb://localhost:27017/Used-Furniture',
        dbURL: process.env.DB_URL_CREDENTIALS,
    origin: ['https://used-furniture-680be.web.app']
    },
    production: {
        port: process.env.PORT || 3000,
        dbURL: process.env.DB_URL_CREDENTIALS,
        origin: []
    }
};


module.exports = config[env];


