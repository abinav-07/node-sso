const express = require('express');

//Services
const Services = require('../controllers');
const checkOAuthToken = require('../middlewares/checkOAuth');

const router = express.Router();

//Routes
router.get('/translation', Services.TranslationControllers);

router.post('/login', Services.AuthenticationControllers.loginUser);

router.post('/register', Services.AuthenticationControllers.registerUser);

// OAuth
router.post('/oauth/sign-in', Services.AuthenticationControllers.OAuthSignIn);

router.get('/oauth/callback', Services.AuthenticationControllers.OAuthCallback);

router.get(
  '/oauth/check',
  checkOAuthToken,
  Services.AuthenticationControllers.checkSSO
);

router.post(
  '/oauth/logout',
  checkOAuthToken,
  Services.AuthenticationControllers.OAuthLogout
);

module.exports = router;
