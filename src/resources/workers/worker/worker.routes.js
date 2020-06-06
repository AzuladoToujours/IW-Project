const express = require('express');
const router = express.Router();
const {
  defaultCrudMethods,
  createWageReport,
  createPaymentBill,
} = require('./worker.controller');
const { getOne, updateOne } = defaultCrudMethods;
const { hasAuthorization } = require('./worker.helper');
const { requireSignIn } = require('../../auth/auth.helper');
const upload = require('../../../utils/multer');
const { editValidations, editValidator } = require('./worker.validator');

router.get('/worker/createpaymentbill', requireSignIn, createPaymentBill);
router.get('/worker/createwagereport', requireSignIn, createWageReport);
router.get('/worker/:id', requireSignIn, hasAuthorization, getOne);
router.put(
  '/worker/:id',
  requireSignIn,
  hasAuthorization,
  upload.single('photo'),
  editValidations,
  editValidator,
  updateOne
);

module.exports = router;
