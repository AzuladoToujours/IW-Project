const Worker = require('../workers/worker/worker.model');
const jwt = require('jsonwebtoken');
const { signedUpMail } = require('./auth.helper');
require('dotenv').config();

exports.signUp = async (req, res) => {
  const email = req.body.email;

  const body = {
    names: req.body.names,
    last_names: req.body.last_names,
    mobile: req.body.mobile,
    dni: req.body.dni,
    birthday: req.body.birthday,
    gender: req.body.gender,
    email: req.body.email,
    created_by: req.params.decodedInformation.createdBy,
    password: req.body.password,
  };

  const worker = await new Worker(body);

  await worker.save();

  await signedUpMail(email, req, res);
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  await Worker.findOne({ email }, (err, worker) => {
    if (err | !worker) {
      return res
        .status(400)
        .json({ error: 'Worker with that email does not exist' });
    }

    if (!worker.authenticate(password)) {
      return res.status(404).json({ error: 'Wrong credentials' });
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
