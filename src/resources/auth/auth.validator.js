const { check, validationResult } = require('express-validator');
const Worker = require('../workers/worker/worker.model');
exports.validations = [
  check('dni', 'La cédula debe contener entre 5 y 10 dígitos').matches(
    /[0-9]{5,10}/
  ),
  //NAMES ARE NOT NULL
  check('names', 'Los nombres deben contener entre 1 y 40 carácteres').matches(
    /[a-zA-Z]{1,40}/
  ),
  //LAST NAMES ARE NOT NULL
  check(
    'last_names',
    'Los apellidos deben contener entre 1 y 40 carácteres'
  ).matches(/[a-zA-Z]{1,40}/),
  //MOBILE MUST HAVE TEN DIGITS AND NOT BE NULL
  check('mobile', 'Celular debe contener 10 dígitos').matches(/[0-9]{10}/),
  //EMAIL VALID AND NORMALIZED
  check('email', 'Provea un email válido').isEmail(),
  //Check for password
  check(
    'password',
    'La contraseña debe contener 6 o más dígitos, entre los cuales se pueden encontrar números y carácteres especiales'
  ).matches(/(\X*){6,40}/),
];

exports.signUpValidator = async (req, res, next) => {
  const workerDniExist = await Worker.findOne({ dni: req.body.dni });
  if (workerDniExist) {
    return res
      .status(204)
      .json({ error: 'Ya existe un trabajador con ese dni' });
  }

  const workerEmailExist = await Worker.findOne({ email: req.body.email });
  if (workerEmailExist) {
    return res
      .status(403)
      .json({ error: 'Ya existe un trabajador con ese email' });
  }

  const isAdmin = req.params.decodedInformation.role == 'admin';

  if (!isAdmin) {
    const email = req.body.email;
    const emailAtToken = req.params.decodedInformation.email;
    if (email != emailAtToken) {
      return res.status(403).json({
        error:
          'El email de la invitación y el email sumistrado no corresponden',
      });
    }
  }

  //Check for error
  const errors = validationResult(req);
  //if error show the first one as they happend
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
    return res.status(403).json({ errors: extractedErrors });
  }
  //Proceed to next middleware
  next();
};

exports.allowAccess = async (req, res, err) => {
  return res.status(200).json({ access: true });
};
