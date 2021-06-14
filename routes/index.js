const express = require('express');
const checkJWTToken = require('../middlewares/checkJWT');

//Services
const Services = require('../controllers');

const router = express.Router();

//Services

//Routes
router.get('/translation', Services.TranslationServices);

router.use(checkJWTToken);
router.get('/login', Services.AuthenticationServices.loginUser);

module.exports = router;
