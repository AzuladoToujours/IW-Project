const express = require('express');
const router = express.Router();
const { sendSignUpMail } = require('./admin.controller');
const { sendSignUpMailValidator, validations } = require('./admin.validator');
const { hasAdminAuthorization } = require('./admin.helper');
const { requireSignIn } = require('../../auth/auth.helper');
router.post(
  '/admin/sendsignup',
  requireSignIn,
  hasAdminAuthorization,
  validations,
  sendSignUpMailValidator,
  sendSignUpMail
);
// router.post('/admin/signup', requireSignIn, hasAdminAuthorization, );

module.exports = router;
