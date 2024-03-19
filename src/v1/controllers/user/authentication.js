/* global WEBAPP_DB */

/**
 * Authentications module
 * @module Authentications
 */

const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const chalk = require('chalk');
const {
  ValidationException,
  BadRequestException,
} = require('../../../../exceptions/httpsException');

//Queries
const UserQueries = require('../../queries/users');
const initOAuth = require('../../services/oAuth');

const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`;

/**
 * @api {post} /v1/users/login Login User
 * @apiName LoginUser
 * @apiGroup Auth
 *
 * @apiParam {String} email email
 * @apiParam {String} password password
 *
 * @apiSuccess {String} token JWT
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 *   "token": "18927398172c hsdkucbfy voq2 3rj23.41.2,3k4hjd`x8o237c49p8123759[48c17]`"
 * }
 */
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param req.body {Object} email and password
 * @name LoginUser
 * @returns {json} User Details and Token
 */
const loginUser = async (req, res, next) => {
  const data = req.body;
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  const validationResult = schema.validate(data, { abortEarly: false });

  try {
    if (validationResult && validationResult.error) {
      throw new ValidationException(null, validationResult.error);
    }

    const user = await WEBAPP_DB.findOne({ where: { email: data.email } });

    if (!user || !user.email) {
      throw new ValidationException(null, 'User Not Registered');
    }

    if (
      user &&
      user.password &&
      !bcrypt.compareSync(data.password, user.password)
    ) {
      throw new ValidationException(null, 'Password did not match');
    }

    const token = jwt.sign({ user_id: user.id }, jwtSecretKey);

    delete user.password;

    res.status(200).json({
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /v1/users/register Register User
 * @apiName RegisterUser
 * @apiGroup Auth
 *
 * @apiParam {String} email email
 * @apiParam {String} password password
 *
 * @apiSuccess {String} token JWT
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 * {
 *   "token": "18927398172c hsdkucbfy voq2 3rj23.41.2,3k4hjd`x8o237c49p8123759[48c17]`"
 * }
 */
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param req.body {Object} email and password
 * @name RegisterUser
 * @returns {json} User Details and Token
 */
const registerUser = async (req, res, next) => {
  const data = req.body;

  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  const validationResult = schema.validate(data, { abortEarly: false });

  try {
    if (validationResult && validationResult.error) {
      throw new ValidationException(null, validationResult.error);
    }

    const user = await UserQueries.getUser({ email: data.email });

    if (!user || !user.email) {
      throw new ValidationException(null, 'User Not Registered');
    }

    if (
      user &&
      user.password &&
      !bcrypt.compareSync(data.password, user.password)
    ) {
      throw new ValidationException(null, 'Password did not match');
    }

    const token = jwt.sign({ user_id: user.id }, jwtSecretKey);

    delete user.password;

    res.status(200).json({
      user,
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /v1/users/oauth/sign-in OAuth Sign in User
 * @apiName OAuthSignIn
 * @apiGroup Auth
 *
 *
 * @apiSuccess {String} token JWT
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 *
 */
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @name OAuthSignIn
 * @returns {json} Callback
 */
const OAuthSignIn = async (req, res, next) => {
  try {
    const OAuthClient = await initOAuth();
    const url = OAuthClient.authorizationUrl({
      scope: 'openid profile email',
      response_type: 'code',
    });
    console.log('Sign in URL:', url);
    res.redirect(url);
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /v1/users/oauth/callback OAuth Sign in callback
 * @apiName OAuthCallback
 * @apiGroup Auth
 *
 * @apiParam {String} code auth code
 *
 * @apiSuccess {String} token JWT
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 *
 */
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @name OAuthCallback
 * @returns {json} Callback
 */
const OAuthCallback = async (req, res, next) => {
  try {
    const OAuthClient = await initOAuth();

    const tokens = await OAuthClient.callback(
      'http://localhost:8000/oauth/callback',
      req.query
    );

    const { data } = await axios
      .get('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      })
      .catch((err) => console.log(chalk.red('Auth Response Err:', err)));

    if (!data) {
      throw new BadRequestException(null, 'Google auth verification failed!');
    }

    const checkUserExists = await UserQueries.getUser({ email: data?.email });
    // Create new user if user dsnt exist
    if (!checkUserExists) {
      const createUserData = {
        email: data?.email,
        password: data?.id,
        full_name: data?.name,
        token: tokens?.access_token,
        token_expiry_time: tokens?.expiry_date,
      };

      await UserQueries.createUser(createUserData);

      res.status(200).json({
        token: tokens?.access_token,
      });
      return;
    }

    // Update token if email found
    await UserQueries.updateUser(checkUserExists?.id, {
      token: tokens?.access_token,
      token_expiry_time: tokens?.expiry_date,
    });

    res.status(200).json({
      token: tokens?.access_token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /v1/users/oauth/logout OAuth logout  User
 * @apiName OAuthLogout
 * @apiGroup Auth
 *
 *
 * @apiSuccess {String} message
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 *
 */
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @name OAuthLogout
 * @returns {json} Message
 */
const OAuthLogout = async (req, res, next) => {
  try {
    try {
      const OAuthClient = await initOAuth();
      // const tokenSet=new TokenSet({
      //   access_token: `Bearer ${req.user?.token}`
      // })
      // Revoking token access from GCloud OAuth
      await OAuthClient.revoke(req.user?.token);

      // Setting tokens to null in DB
      await UserQueries.updateUser(req.user?.id, {
        token: null,
        token_expiry_time: null,
      });

      res.status(200).json({
        message: 'Signed our successfully',
      });
    } catch (err) {
      console.log(err);
      throw new BadRequestException(null, err);
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /v1/users/oauth/check Check OAuth
 * @apiName checkSSO
 * @apiGroup Auth
 *
 *
 * @apiSuccess {String} message
 *
 * @apiSuccessExample Successful Response:
 * HTTP/1.1 200 OK
 *
 */
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @name checkSSO
 * @returns {json} Message
 */
const checkSSO = async (req, res, next) => {
  try {
    res.status(200).json({
      message: 'Succesfully verified through SSO.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loginUser,
  registerUser,
  OAuthSignIn,
  OAuthCallback,
  OAuthLogout,
  checkSSO,
};
