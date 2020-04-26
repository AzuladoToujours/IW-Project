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

exports.addContractValidator = async (req, res, next) => {
  if (!req.body.workerId) {
    return res.status(200).json({ error: 'No ha ingresado id del trabajador' });
  }

  try {
    const worker = await Worker.findOne({ _id: req.body.workerId });

    if (!worker) {
      return res
        .status(200)
        .json({ error: 'No existe un trabajador con ese id' });
    }

    if (!req.file) {
      return res.status(200).json({ error: 'No ha agregado ningún archivo' });
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
    return res.status(200).json({ error: 'Id erróneo' });
  }
};
