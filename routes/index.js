const userRoutes = require('./user');

module.exports = function (app) {
  app.use('/users', userRoutes);
};
