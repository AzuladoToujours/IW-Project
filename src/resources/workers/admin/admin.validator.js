const { check, validationResult } = require('express-validator');
const Worker = require('../worker/worker.model');
const PropertyRequiredError = require('../../../errors/property-required.error');
const NotFoundError = require('../../../errors/not-found.error');
const WrongCredentialsError = require('../../../errors/wrong-credentials.error');

exports.validations = [
  //EMAIL VALID AND NORMALIZED
  check('email', 'Email must be valid').isEmail(),
];

exports.sendSignUpMailValidator = async (req, res, next) => {
  const workerExist = await Worker.findOne({ email: req.body.email });

  if (workerExist) {
    let wrongCredentials = new WrongCredentialsError();
    return wrongCredentials.alreadyExistsResponse(res, 'email');
  }

  //Check for error
  const errors = validationResult(req);
  //if error show the first one as they happend
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push(err.msg));
    return res.status(200).json({ errors: extractedErrors });
  }

  //Proceed to next middleware
  next();
};

exports.addContractValidator = async (req, res, next) => {
  if (!req.body.workerId) {
    let propertyRequired = new PropertyRequiredError('id');
    return propertyRequired.errorResponse(res);
  }

  try {
    const worker = await Worker.findOne({ _id: req.body.workerId });

    if (!worker) {
      let notFound = new NotFoundError();
      return notFound.errorResponse(res);
    }

    if (!req.file) {
      let propertyRequired = new PropertyRequiredError('archivo');
      return propertyRequired.errorResponse(res);
    }

    let correctMimetype =
      req.file.mimetype == 'image/png' ||
      req.file.mimetype == 'image/jpeg' ||
      req.file.mimetype == 'application/pdf';

    if (!correctMimetype) {
      res.status(200).json({ error: 'Formato de contrato no permitido.' });
      return;
    }

    req.worker = worker;

    next();
  } catch (e) {
    console.log(e);
    let notFound = new NotFoundError();
    return notFound.errorResponse(res);
  }
};
