// const jwt = require('./jwt');
// const { authCookieName } = require('../app-config');
// const {
//     userModel,
//     tokenBlacklistModel
// } = require('../models');

// function auth(redirectUnauthenticated = true) {

//     return function (req, res, next) {
//         const token = req.cookies[authCookieName] || '';
//         Promise.all([
//             jwt.verifyToken(token),
//             tokenBlacklistModel.findOne({ token })
//         ])
//             .then(([data, blacklistedToken]) => {
//                 if (blacklistedToken) {
//                     return Promise.reject(new Error('blacklisted token'));
//                 }
//                 userModel.findById(data.id)
//                     .then(user => {
//                         req.user = user;
//                         req.isLogged = true;
//                         next();
//                     })
//             })
//             .catch(err => {
//                 if (!redirectUnauthenticated) {
//                     next();
//                     return;
//                 }
//                 if (['token expired', 'blacklisted token', 'jwt must be provided'].includes(err.message)) {
//                     console.error(err);
//                     res
//                         .status(401)
//                         .send({ message: "Invalid token!" });
//                     return;
//                 }
//                 next(err);
//             });
//     }
// }



// module.exports = auth;


const jwt = require('./jwt');
const { authCookieName } = require('../app-config');
const {
    userModel,
    tokenBlacklistModel
} = require('../models');

function auth(redirectUnauthenticated = true) {
    return function (req, res, next) {
        // 👉 Логваме всички бисквитки
        console.log('Cookies:', req.cookies);
        console.log('authCookieName:', authCookieName);

        const token = req.cookies[authCookieName];

        if (!token) {
            console.log('⚠️ Token not found in cookies');

            if (!redirectUnauthenticated) {
                return next();
            }

            return res.status(401).send({ message: 'No token provided' });
        }

        Promise.all([
            jwt.verifyToken(token),
            tokenBlacklistModel.findOne({ token })
        ])
            .then(([data, blacklistedToken]) => {
                if (blacklistedToken) {
                    return Promise.reject(new Error('blacklisted token'));
                }

                return userModel.findById(data.id);
            })
            .then(user => {
                if (!user) {
                    return Promise.reject(new Error('User not found'));
                }

                req.user = user;
                req.isLogged = true;
                next();
            })
            .catch(err => {
                console.error('❌ Auth error:', err.message);

                if (!redirectUnauthenticated) {
                    return next();
                }

                if (['token expired', 'blacklisted token', 'jwt must be provided', 'No token provided'].includes(err.message)) {
                    return res.status(401).send({ message: 'Invalid token!' });
                }

                next(err);
            });
    };
}

module.exports = auth;
