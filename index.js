const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const i18next = require('i18next');
const i18nextBackend = require('i18next-fs-backend');
const i18nextMiddleware = require('i18next-http-middleware');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { NotFoundException } = require('./exceptions/httpsException');
const errorHandler = require('./middlewares/errorHandler');

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

/**
 * GLOBAL DATABASE SETTINGS
 */
global.TRANSLATION_DB = require('./database/ab-translation-db/models');
global.TRANSCRIPTION_DB = require('./database/ab-transcription-db/models');
global.WEBAPP_DB = require('./database/ab-webapp-db/models');

// Express body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Swagger
// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'ASR API',
      description: 'ASR API Information',
      contact: {
        name: 'Amazing Developer',
        url: "http://www.example.com/support",
        email: "support@example.com"
      },
      license: {
        name: "Apache 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0.html"
      },
      servers:
        {
          url: "http://localhost:5000",
          description: "Development server"
        },
    },
  },
  apis: ['./routes/*.js'], // files containing annotations as above
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Routes
require('./routes')(app);

//Error Handler
app.use((req, res, next) => {
  next(new NotFoundException(null, `404 Not found: ${req.url} does not exist`));
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listing to ${PORT}`);
});
