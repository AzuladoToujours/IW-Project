const { check, validationResult } = require('express-validator');
const Worker = require('../workers/worker/worker.model');
const jwt = require('jsonwebtoken');
const passwordValidator = require('password-validator');

exports.validations = [
  check('dni', 'La cédula debe contener entre 5 y 10 dígitos')
    .matches(/[0-9]/)
    .isLength({ min: 5, max: 10 }),

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
  check('mobile', 'Celular debe contener 10 dígitos')
    .matches(/[0-9]{10}/)
    .isLength({ max: 10 }),
  //EMAIL VALID AND NORMALIZED
  check('email', 'Provea un email válido').isEmail(),
];

exports.signUpValidator = async (req, res, next) => {
  const workerDniExist = await Worker.findOne({ dni: req.body.dni });
  if (workerDniExist) {
    return res
      .status(200)
      .json({ error: 'Ya existe un trabajador con ese dni' });
  }

  const workerEmailExist = await Worker.findOne({ email: req.body.email });
  if (workerEmailExist) {
    return res
      .status(200)
      .json({ error: 'Ya existe un trabajador con ese email' });
  }

  const isAdmin = req.params.decodedInformation.role == 'admin';

  if (!isAdmin) {
    const email = req.body.email;
    const emailAtToken = req.params.decodedInformation.email;
    if (email != emailAtToken) {
      return res.status(200).json({
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
    errors.array().map((err) => extractedErrors.push(err.msg));
    return res.status(200).json({ errors: extractedErrors });
  }
  //Proceed to next middleware
  //next();
};

exports.forgotPasswordValidator = async (req, res, next) => {
  if (!req.body.email)
    return res.status(200).json({ error: 'No email in request body' });

  const { email } = req.body;

  try {
    const worker = await Worker.findOne({ email });

    if (!worker) {
      return res
        .status(200)
        .json({ error: 'El trabajador con ese email no existe' });
    }

    req.worker = worker;
  } catch (e) {
    console.log(e);
    return res
      .status(200)
      .json({ error: 'El trabajador con ese email no existe' });
  }

  next();
};

exports.passwordValidator = (req, res, next) => {
  var schema = new passwordValidator();

  // Add properties to it
  schema
    .is()
    .min(6) // Minimum length 6
    .is()
    .max(50) // Maximum length 50
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .not()
    .spaces() // Should not have spaces
    .is()
    .not()
    .oneOf(['Passw0rd', 'Password123']); // Blacklist these values

  if (schema.validate(req.body.password)) {
    next();
  } else {
    res.status(200).json({
      error:
        'La contraseña debe contener 6 o más dígitos, entre los cuales debe haber mayúsculas, mínusculas y por lo menos un número',
    });
  }
};

exports.allowAccess = async (req, res, err) => {
  return res.status(200).json({ access: true });
};
