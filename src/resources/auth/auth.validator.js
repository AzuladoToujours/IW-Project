const { check, validationResult } = require('express-validator');
const Worker = require('../workers/worker/worker.model');
exports.validations = [
  check('dni', 'Identity card must have between 5 and 10 digits').matches(
    /[0-9]{5,10}/
  ),
  //NAMES ARE NOT NULL
  check('names', 'Names must be between 1 and 40 characters').matches(
    /[a-zA-Z]{1,40}/
  ),
  //LAST NAMES ARE NOT NULL
  check('last_names', 'Last names must be between 1 and 40 characters').matches(
    /[a-zA-Z]{1,40}/
  ),
  //MOBILE MUST HAVE TEN DIGITS AND NOT BE NULL
  check('mobile', 'Mobile must have ten digits').matches(/[0-9]{10}/),
  //EMAIL VALID AND NORMALIZED
  check('email', 'Email must be valid').isEmail(),
  //Check for password
  check(
    'password',
    'Password must contain at least 6 characters and include at least one number'
  ).matches(/([a-zA-Z\d]){6,40}/),
];

exports.signUpValidator = async (req, res, next) => {
  const workerDniExist = await Worker.findOne({ dni: req.body.dni });

  if (workerDniExist) {
    return res
      .status(400)
      .json({ error: "There's already a worker with that dni" });
  }

  const email = req.body.email;
  const emailAtToken = req.params.decodedInformation.email;
  if (email != emailAtToken) {
    return res
      .status(400)
      .json({ error: 'Email invited and email suministred does not match' });
  }

  //Check for error
  const errors = validationResult(req);
  //if error show the first one as they happend
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(400).json({ errors: extractedErrors });
  }

  //Proceed to next middleware
  next();
};

exports.allowAccess = async (req, res) => {
  return res.status(200).json({ access: true });
};
