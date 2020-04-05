const express = require('express');
const router = express.Router();
const { signUp, signIn, signUpTest } = require('./auth.controller');
const {
  signUpValidator,
  validations,
  allowAccess,
} = require('./auth.validator');
const { verifySignUpToken } = require('./auth.helper');
router.get('/signup/:signupToken', verifySignUpToken, allowAccess);
router.post('/signup', verifySignUpToken, validations, signUpValidator, signUp);

router.post('/signin', signIn);

module.exports = router;
