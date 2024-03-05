/* global WEBAPP_DB */

/**
 * Authentications module
 * @module Authentications
 */

const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const {
  ValidationException,
} = require('../../../../exceptions/httpsException');

const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`;

/**
 * @api {post} /api/users/login Login User
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

    const payload = {
      user_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign({ user_id: user.id }, jwtSecretKey);

    res.status(200).json({
      user: payload,
      token,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @api {post} /api/users/register Register User
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

    const payload = {
      user_id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign({ user_id: user.id }, jwtSecretKey);

    res.status(200).json({
      user: payload,
      token,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  loginUser,
  registerUser,
};
