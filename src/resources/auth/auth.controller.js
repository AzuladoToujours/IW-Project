const Worker = require('../workers/worker/worker.model');
const jwt = require('jsonwebtoken');
const { signedUpMail, forgotPasswordMail } = require('./auth.helper');
const _ = require('lodash');
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
    console.log(e);
    return res.status(500).send('Error inesperado');
  }

  signedUpMail(email, req, res);
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  await Worker.findOne({ email }, (err, worker) => {
    if (err | !worker) {
      return res.status(200).json({ error: 'Usuario o contraseña inválidos.' });
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

exports.signOut = async (req, res) => {
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

exports.forgotPassword = async (req, res) => {
  let worker = req.worker;
  const token = jwt.sign(
    { hashed_password: worker.hashed_password },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  return worker.updateOne({ resetPasswordLink: token }, (err, success) => {
    if (err) {
      return res.json({ error: err });
    } else {
      forgotPasswordMail(worker.email, token, res);
    }
  });
};

exports.resetPassword = async (req, res) => {
  const { password } = req.body;

  let worker = req.worker;

  const updatedFields = {
    resetPasswordLink: '',
  };

  worker.password = password;
  worker = _.extend(worker, updatedFields);
  worker.updated_at = Date.now();

  try {
    worker.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.status(200).json({
        message: `Muy Bien! Ya puede ingresar con su nueva contraseña.`,
      });
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      error: err,
    });
  }
};
