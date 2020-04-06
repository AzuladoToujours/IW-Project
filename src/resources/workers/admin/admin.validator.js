const { check, validationResult } = require('express-validator');
const Worker = require('../worker/worker.model');
exports.validations = [
  //EMAIL VALID AND NORMALIZED
  check('email', 'Email must be valid').isEmail(),
];

exports.sendSignUpMailValidator = async (req, res, next) => {
  const workerExist = await Worker.findOne({ email: req.body.email });

  if (workerExist) {
    return res
      .status(200)
      .json({ error: 'Ya existe un trabajador con ese email' });
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