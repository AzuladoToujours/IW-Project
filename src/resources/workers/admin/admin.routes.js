const express = require('express');
const router = express.Router();
const { sendSignUpMail } = require('./admin.controller');
const { sendSignUpMailValidator, validations } = require('./admin.validator');
const { hasAdminAuthorization } = require('./admin.helper');
const { requireSignIn } = require('../../auth/auth.helper');
const { defaultCrudMethods } = require('../worker/worker.controller');
const { getMany, removeOne } = defaultCrudMethods;

router.get('/admin/worker/s/', requireSignIn, hasAdminAuthorization, getMany);

router.post(
  '/admin/sendsignup',
  requireSignIn,
  hasAdminAuthorization,
  validations,
  sendSignUpMailValidator,
  sendSignUpMail
);
router.delete(
  '/admin/worker/fire/:id',
  requireSignIn,
  hasAdminAuthorization,
  removeOne
);

module.exports = router;
