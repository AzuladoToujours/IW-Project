const { check, validationResult } = require('express-validator');
const Worker = require('./worker.model');
exports.editValidations = [
  check('dni', 'La cédula debe contener entre 5 y 10 dígitos')
    .optional()
    .matches(/[0-9]{5,10}/),
  //NAMES ARE NOT NULL
  check('names', 'Los nombres deben contener entre 1 y 40 carácteres')
    .optional()
    .matches(/[a-zA-Z]{1,40}/),
  //LAST NAMES ARE NOT NULL
  check('last_names', 'Los apellidos deben contener entre 1 y 40 carácteres')
    .optional()
    .matches(/[a-zA-Z]{1,40}/),
  //MOBILE MUST HAVE TEN DIGITS AND NOT BE NULL
  check('mobile', 'Celular debe contener 10 dígitos')
    .optional()
    .matches(/[0-9]{10}/),
  //EMAIL VALID AND NORMALIZED
  check('email', 'Provea un email válido').optional().isEmail(),
  //CHECK VALID SALARY
  check('salary', 'El salario sólo puede contener dígitos')
    .optional()
    .matches(/[0-9]/),
];

exports.editValidator = async (req, res, next) => {
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

  if (!req.isAdmin) {
    if (req.body.salary) {
      return res.status(200).json({
        error: 'El usuario no está autorizado para realizar esta acción.',
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
  next();
};
