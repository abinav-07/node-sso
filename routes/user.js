const express = require('express');

//Services
const Services = require('../controllers');

const router = express.Router();

//Routes
router.get('/translation', Services.TranslationControllers);

router.post('/login', Services.AuthenticationControllers.loginUser);

router.post('/register', Services.AuthenticationControllers.registerUser);

module.exports = router;
