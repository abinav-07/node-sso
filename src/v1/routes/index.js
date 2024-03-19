const userRoutes = require('./user');

module.exports = function (app) {
  app.use('/v1/users', userRoutes);
};
