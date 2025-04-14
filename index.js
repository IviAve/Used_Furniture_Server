// global.__basedir = __dirname;
// require('dotenv').config()
// const dbConnector = require('./config/db');
// // const mongoose = require('mongoose');
// const apiRouter = require('./router');
// const cors = require('cors');
// // const config = require('./config/config');
// const { errorHandler } = require('./utils');

// dbConnector()
//   .then(() => {
//     const config = require('./config/config');

//     const app = require('express')();
//     require('./config/express')(app);

//     app.use(cors({
//       origin: config.origin,
//       credentials: true
//     }));

//     app.use('/api', apiRouter);

//     app.use(errorHandler);

//     app.listen(config.port, console.log(`Connect to MongoDb and listening on port ${config.port}!`));
//   })
//   .catch(console.error);



global.__basedir = __dirname;
require('dotenv').config();
const dbConnector = require('./config/db');
const apiRouter = require('./router');
const cors = require('cors');
const { errorHandler } = require('./utils');

dbConnector()
  .then(() => {
    const config = require('./config/config');
    const app = require('express')();
    require('./config/express')(app);

    // CORS настройки
    app.use(cors({
      origin: config.origin,
      credentials: true
    }));

    // Логове за текущата среда
    console.log('==============================');
    console.log(`🚀 Starting server...`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌍 Allowed CORS Origins: ${config.origin}`);
    console.log(`🛢️  Database URL: ${config.dbURL}`);
    console.log(`🚪 Port: ${config.port}`);
    console.log('==============================');

    // Роутове и глобален error handler
    app.use('/api', apiRouter);
    app.use(errorHandler);

    app.listen(config.port, () =>
      console.log(`✅ Connected to MongoDB and listening on port ${config.port}!`)
    );
  })
  .catch(console.error);
