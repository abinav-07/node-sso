/* global WEBAPP_DB */

/**
 * Authentications module
 * @module Authentications
 */

const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { ValidationException } = require('../../exceptions/httpsException');

const jwtSecretKey = `${process.env.JWT_SECRET_KEY}`;

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {json}
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

module.exports = {
  loginUser,
};
