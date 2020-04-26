const Worker = require('../worker/worker.model');
const jwt = require('jsonwebtoken');
const { signUpMail } = require('./admin.helper');
const { uploadContractToS3 } = require('../../../utils/aws.controller');
const _ = require('lodash');
const moment = require('moment-timezone');

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

const addContract = async (req, res) => {
  let worker = req.worker;
  const response = await uploadContractToS3(req, res, worker._id, req.file);
  worker.contract = response.Location;

  worker.updated_at = moment.tz('America/Bogota').format();

  await worker.save((err, result) => {
    if (err) {
      console.log(err);
      return res.status(200).json({ error: 'Error al añadir contrato' });
    }

    res.status(200).json({ message: 'Contrato añadido correctamente' });
  });
};

module.exports = { sendSignUpMail, addContract };
