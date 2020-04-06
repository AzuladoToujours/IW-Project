const express = require('express');
const router = express.Router();
const { signUp, signIn, signOut } = require('./auth.controller');
const {
  signUpValidator,
  validations,
  allowAccess,
} = require('./auth.validator');
const {
  verifySignUpToken,
  rateLimiterUsingThirdParty,
} = require('./auth.helper');
router.get('/signup/:signupToken', verifySignUpToken, allowAccess);
router.post('/signup', verifySignUpToken, validations, signUpValidator, signUp);

router.post('/signin', rateLimiterUsingThirdParty, signIn);

router.post('/signout', signOut);

module.exports = router;
