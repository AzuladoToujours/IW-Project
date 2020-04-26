const express = require('express');
const router = express.Router();
const { sendSignUpMail, addContract } = require('./admin.controller');
const {
  sendSignUpMailValidator,
  validations,
  addContractValidator,
} = require('./admin.validator');
const { hasAdminAuthorization } = require('./admin.helper');
const { requireSignIn } = require('../../auth/auth.helper');
const { defaultCrudMethods } = require('../worker/worker.controller');
const { getMany, removeOne, getManyFired } = defaultCrudMethods;
const upload = require('../../../utils/multer');

router.get('/admin/worker/s/', requireSignIn, hasAdminAuthorization, getMany);
router.get(
  '/admin/worker/fire/d/',
  requireSignIn,
  hasAdminAuthorization,
  getManyFired
);

router.post(
  '/admin/sendsignup',
  requireSignIn,
  hasAdminAuthorization,
  validations,
  sendSignUpMailValidator,
  sendSignUpMail
);
router.put(
  '/admin/worker/fire/:id',
  requireSignIn,
  hasAdminAuthorization,
  removeOne
);
router.put(
  '/admin/worker/addcontract',
  requireSignIn,
  hasAdminAuthorization,
  upload.single('contract'),
  addContractValidator,
  addContract
);

module.exports = router;
