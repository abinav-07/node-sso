const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const i18next = require('i18next');
const i18nextBackend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const { NotFoundException } = require('./exceptions/httpsException');
const { rateLimit } = require('express-rate-limit');

dotenv.config();

//Initialize App with express server
const app = express();

//CORS settings
app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

//i18next configuration
i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: 'en', //Default
    backend: {
      //lng: selected langauges
      loadPath: './helpers/locales/{{lng}}/translation.json',
    }, //file path
  });

// Add req.t to request object
app.use(i18nextMiddleware.handle(i18next));

//Set ENV
app.set('env', process.env.NODE_ENV);

/**
 * GLOBAL DATABASE SETTINGS
 */
global.WEBAPP_DB = require('./database/database_name/models');

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(rateLimit({
  // How long to remember requests for (1 minute)
  windowMs:60*1000,
  // How many requests to allow 
  max:5,
  // Message to display
  message:"You exceeded the 5 request mark."
}))

//Routes
app.use('/v1', require('./src/v1/routes')(app));

//Error Handler
app.use((req, res, next) => {
  next(new NotFoundException(null, `404 Not found: ${req.url} does not exist`));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listing to ${PORT}`);
});
