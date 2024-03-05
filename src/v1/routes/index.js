const errorHandler = require('../middlewares/errorHandler');
const userRoutes = require('./user');

module.exports = function (app) {
  app.use(errorHandler);
  app.use('/users', userRoutes);
};
