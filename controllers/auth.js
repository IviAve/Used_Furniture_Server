// const {
//     userModel,
//     tokenBlacklistModel
// } = require('../models');

// const utils = require('../utils');
// const { authCookieName } = require('../app-config');

// const bsonToJson = (data) => { return JSON.parse(JSON.stringify(data)) };
// const removePassword = (data) => {
//     const { password, __v, ...userData } = data;
//     return userData
// }

// function register(req, res, next) {
//     const { tel, email, username, password, repeatPassword } = req.body;

//     return userModel.create({ tel, email, username, password })
//         .then((createdUser) => {
//             createdUser = bsonToJson(createdUser);
//             createdUser = removePassword(createdUser);

//             const token = utils.jwt.createToken({ id: createdUser._id });
//             if (process.env.NODE_ENV === 'production') {
//                 res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
//             } else {
//                 res.cookie(authCookieName, token, { httpOnly: true })
//             }
//             res.status(200)
//                 .send(createdUser);
//         })
//         .catch(err => {
//             if (err.name === 'MongoError' && err.code === 11000) {
//                 let field = err.message.split("index: ")[1];
//                 field = field.split(" dup key")[0];
//                 field = field.substring(0, field.lastIndexOf("_"));

//                 res.status(409)
//                     .send({ message: `This ${field} is already registered!` });
//                 return;
//             }
//             next(err);
//         });
// }

// function login(req, res, next) {
//     const { email, password } = req.body;

//     userModel.findOne({ email })
//         .then(user => {
//             return Promise.all([user, user ? user.matchPassword(password) : false]);
//         })
//         .then(([user, match]) => {
//             if (!match) {
//                 res.status(401)
//                     .send({ message: 'Wrong email or password' });
//                 return
//             }
//             user = bsonToJson(user);
//             user = removePassword(user);

//             const token = utils.jwt.createToken({ id: user._id });

//             if (process.env.NODE_ENV === 'production') {
//                 res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true })
//             } else {
//                 res.cookie(authCookieName, token, { httpOnly: true })
//             }
//             res.status(200)
//                 .send(user);
//         })
//         .catch(next);
// }

// function logout(req, res) {
//     const token = req.cookies[authCookieName];

//     tokenBlacklistModel.create({ token })
//         .then(() => {
//             res.clearCookie(authCookieName)
//                 .status(204)
//                 .send({ message: 'Logged out!' });
//         })
//         .catch(err => res.send(err));
// }

// function getProfileInfo(req, res, next) {
//     const { _id: userId } = req.user;

//     userModel.findOne({ _id: userId }, { password: 0, __v: 0 }) //finding by Id and returning without password and __v
//         .then(user => { res.status(200).json(user) })
//         .catch(next);
// }

// function editProfileInfo(req, res, next) {
//     const { _id: userId } = req.user;
//     const { tel, username, email } = req.body;

//     userModel.findOneAndUpdate({ _id: userId }, { tel, username, email }, { runValidators: true, new: true })
//         .then(x => { res.status(200).json(x) })
//         .catch(next);
// }

// module.exports = {
//     login,
//     register,
//     logout,
//     getProfileInfo,
//     editProfileInfo,
// }



const { userModel, tokenBlacklistModel } = require('../models');
const utils = require('../utils');
const { authCookieName } = require('../app-config');

// Преобразуване на BSON в JSON
const bsonToJson = (data) => { return JSON.parse(JSON.stringify(data)) };

// Премахване на паролата от данните
const removePassword = (data) => {
    const { password, __v, ...userData } = data;
    return userData;
}

// Регистрация
function register(req, res, next) {
    const { tel, email, username, password, repeatPassword } = req.body;

    console.log('Received registration request:', { tel, email, username });

    return userModel.create({ tel, email, username, password })
        .then((createdUser) => {
            createdUser = bsonToJson(createdUser);
            createdUser = removePassword(createdUser);

            // Генериране на токен
            const token = utils.jwt.createToken({ id: createdUser._id });

            // Логване на токена и настройките за бисквитката
            console.log('Token created for user:', token);

            if (process.env.NODE_ENV === 'production') {
                console.log('Setting cookie in production mode');
                res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true });
            } else {
                console.log('Setting cookie in development mode');
                res.cookie(authCookieName, token, { httpOnly: true });
            }

            res.status(200)
                .send(createdUser);
        })
        .catch(err => {
            if (err.name === 'MongoError' && err.code === 11000) {
                let field = err.message.split("index: ")[1];
                field = field.split(" dup key")[0];
                field = field.substring(0, field.lastIndexOf("_"));

                res.status(409)
                    .send({ message: `This ${field} is already registered!` });
                return;
            }
            next(err);
        });
}

// Логин
function login(req, res, next) {
    const { email, password } = req.body;

    console.log('Received login request:', { email });

    userModel.findOne({ email })
        .then(user => {
            return Promise.all([user, user ? user.matchPassword(password) : false]);
        })
        .then(([user, match]) => {
            if (!match) {
                console.log('Wrong credentials for user:', email);
                res.status(401)
                    .send({ message: 'Wrong email or password' });
                return;
            }

            user = bsonToJson(user);
            user = removePassword(user);

            const token = utils.jwt.createToken({ id: user._id });

            // Логване на токен и настройките за бисквитката
            console.log('Token created for user:', token);

            if (process.env.NODE_ENV === 'production') {
                console.log('Setting cookie in production mode');
                res.cookie(authCookieName, token, { httpOnly: true, sameSite: 'none', secure: true });
            } else {
                console.log('Setting cookie in development mode');
                res.cookie(authCookieName, token, { httpOnly: true });
            }

            res.status(200)
                .send(user);
        })
        .catch(next);
}

// Логаут
function logout(req, res) {
    const token = req.cookies[authCookieName];

    console.log('Logging out user, token:', token);

    tokenBlacklistModel.create({ token })
        .then(() => {
            console.log('Token added to blacklist');
            res.clearCookie(authCookieName)
                .status(204)
                .send({ message: 'Logged out!' });
        })
        .catch(err => {
            console.error('Error during logout:', err);
            res.status(500).send({ message: 'Logout failed!' });
        });
}

// Получаване на информация за профила
function getProfileInfo(req, res, next) {
    const { _id: userId } = req.user;

    console.log('Fetching profile information for user ID:', userId);

    userModel.findOne({ _id: userId }, { password: 0, __v: 0 })
        .then(user => {
            console.log('Profile information fetched for user:', user);
            res.status(200).json(user);
        })
        .catch(next);
}

// Редактиране на профил
function editProfileInfo(req, res, next) {
    const { _id: userId } = req.user;
    const { tel, username, email } = req.body;

    console.log('Editing profile for user ID:', userId, 'with data:', { tel, username, email });

    userModel.findOneAndUpdate({ _id: userId }, { tel, username, email }, { runValidators: true, new: true })
        .then(x => {
            console.log('Profile updated for user:', x);
            res.status(200).json(x);
        })
        .catch(next);
}

module.exports = {
    login,
    register,
    logout,
    getProfileInfo,
    editProfileInfo,
}
