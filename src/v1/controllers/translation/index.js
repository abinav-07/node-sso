/**
 * Translation module -
 * @module Translations
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {json}
 */

const translateLanguage = (req, res, next) => {
  try {
    //req.t i18next req object
    res.status(200).json({ message: req.t('new_translation') });
  } catch (err) {
    next(err);
  }
};

module.exports = translateLanguage;
