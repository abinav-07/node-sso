/* eslint-disable prefer-destructuring */
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { UnauthorizedException } = require('../exceptions/httpsException');

dotenv.config();

//Secret Key
const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`;

const checkJWTToken = (req, res, next) => {
  try {
    let jwtToken = req.headers.authorization;
    if (jwtToken.startsWith('Bearer')) {
      jwtToken = jwtToken.split(' ')[1]; //Bearer xa2132
    }
    const decodedToken = jwt.verify(jwtToken, jwtSecretKey);
    req.user = decodedToken;
    next();
  } catch (err) {
    next(new UnauthorizedException(null, 'Invalid JWT Token'));
  }
};

module.exports = checkJWTToken;
