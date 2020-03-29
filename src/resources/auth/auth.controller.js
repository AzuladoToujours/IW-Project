const Worker = require('../worker/worker.model');
const jwt = require('jsonwebtoken');
const { sendMail, mailOptions } = require('./auth.helper');
require('dotenv').config();

exports.signUp = async (req, res) => {
  const email = req.body.email;

  const mailMesagge = mailOptions(email);

  const worker = await new Worker(req.body);

  await worker.save();

  await sendMail(mailMesagge, req, res);
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
      process.env.JWT_SECRET
    );
    const { _id, names, last_names, email, role } = worker;

    return res.json({ token, worker: { _id, email, names, last_names, role } });
  });
};
