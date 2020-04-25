const express = require('express');
const router = express.Router();
const {
  signUp,
  signIn,
  signOut,
  forgotPassword,
  resetPassword,
} = require('./auth.controller');
const {
  signUpValidator,
  validations,
  allowAccess,
  forgotPasswordValidator,
  passwordValidator,
} = require('./auth.validator');
const {
  verifySignUpToken,
  rateLimiterUsingThirdParty,
  verifyResetToken,
} = require('./auth.helper');
router.get('/signup/:signupToken', verifySignUpToken, allowAccess);
router.post(
  '/signup',
  verifySignUpToken,
  validations,
  signUpValidator,
  passwordValidator,
  signUp
);

router.post('/signin', rateLimiterUsingThirdParty, signIn);

router.put('/forgot-password', forgotPasswordValidator, forgotPassword);

router.put(
  '/reset-password',
  verifyResetToken,
  passwordValidator,
  resetPassword
);

router.post('/signout', signOut);

module.exports = router;
