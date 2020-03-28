const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('./auth.controller');
const { signUpValidator, validations } = require('./auth.validator');
router.post('/signup', validations, signUpValidator, signUp);
router.post('/signin', signIn);

module.exports = router;
