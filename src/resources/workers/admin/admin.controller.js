const Worker = require('../worker/worker.model');
const jwt = require('jsonwebtoken');
const { signUpMail } = require('./admin.helper');

const sendSignUpMail = async (req, res) => {
  const { email } = req.body;
  const adminId = req.auth._id;

  //Generate a token with the worker id and the secret jwt
  const token = jwt.sign(
    { email: email, createdBy: adminId },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  );

  await signUpMail(email, token, req, res);
};

module.exports = { sendSignUpMail };
