const Worker = require('../workers/worker/worker.model');
const jwt = require('jsonwebtoken');
const { signedUpMail } = require('./auth.helper');
require('dotenv').config();

exports.signUp = async (req, res) => {
  const email = req.body.email;
  var createdBy;

  if (req.params.decodedInformation.createdBy) {
    createdBy = req.params.decodedInformation.createdBy;
  } else {
    createdBy = req.params.decodedInformation._id;
  }

  const body = {
    names: req.body.names,
    last_names: req.body.last_names,
    mobile: req.body.mobile,
    dni: req.body.dni,
    birthday: req.body.birthday,
    gender: req.body.gender,
    email: email,
    created_by: createdBy,
    password: req.body.password,
  };

  try {
    const worker = new Worker(body);
    await worker.save();
  } catch (e) {
    return res.status(500).send('Error inesperado');
  }

  signedUpMail(email, req, res);
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  await Worker.findOne({ email }, (err, worker) => {
    if (err | !worker) {
      return res.status(200).json({ error: 'Usuario no registrado' });
    }

    if (!worker.authenticate(password)) {
      return res.status(200).json({ error: 'Usuario o contraseña inválidos.' });
    }

    //Generate a token with the worker id and the secret jwt
    const token = jwt.sign(
      { _id: worker._id, role: worker.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const { _id, names, last_names, email, role } = worker;

    return res.json({ token, worker: { _id, email, names, last_names, role } });
  });
};
