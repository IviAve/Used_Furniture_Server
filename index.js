global.__basedir = __dirname;
require('dotenv').config()
const dbConnector = require('./config/db');
// const mongoose = require('mongoose');
const apiRouter = require('./router');
const cors = require('cors');
// const config = require('./config/config');
const { errorHandler } = require('./utils');

dbConnector()
  .then(() => {
    const config = require('./config/config');

    const app = require('express')();
    require('./config/express')(app);

    app.use(cors({
      origin: config.origin,
      credentials: true
    }));

    app.use('/api', apiRouter);

    app.use(errorHandler);

    app.listen(config.port, console.log(`Connect to MongoDb and listening on port ${config.port}!`));
  })
  .catch(console.error);


// global.__basedir = __dirname;
// require('dotenv').config();
// const dbConnector = require('./config/db');
// const apiRouter = require('./router');
// const cors = require('cors');
// const { errorHandler } = require('./utils');

// const config = require('./config/config'); // преместих го по-рано, за да го използваме в лога

// dbConnector()
//   .then(() => {
//     console.log(`✅ Connected to MongoDB at: ${config.dbURL}`); // <-- тук е лога към коя база

//     const app = require('express')();
//     require('./config/express')(app);

//     app.use(cors({
//       origin: config.origin,
//       credentials: true
//     }));

//     app.use('/api', apiRouter);

//     app.use(errorHandler);

//     app.listen(config.port, () =>
//       console.log(`🚀 Server is listening on port ${config.port}!`)
//     );
//   })
//   .catch(console.error);
