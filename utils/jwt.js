
require('dotenv').config();  // Това трябва да е най-горе в твоя файл


const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'rVc1dnSI2uWpxq21T78IXnNiGOIaAy31';

function createToken(data) {
    return jwt.sign(data, secret, { expiresIn: '1d' });
}

function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(data);
        });
    });
}

module.exports = {
    createToken,
    verifyToken
}