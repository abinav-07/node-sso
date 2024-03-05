const {
  HttpExceptions,
  ValidationException,
} = require('../../../exceptions/httpsException');

const errorHandler = (error, req, res, next) => {
  try {
    if (error instanceof HttpExceptions) {
      res.status(error.getStatusCode()).json({
        message: error.getMessage(),
      });
      return;
    }

    //Log Console
    console.log(error);

    throw new ValidationException(null, 'Unhandled Error Found!');
  } catch (err) {
    next(err);
  }
};

module.exports = errorHandler;
