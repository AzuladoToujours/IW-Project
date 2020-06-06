const { transporter } = require('../../utils/mailer');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const Worker = require('../workers/worker/worker.model');

const signedUpMail = (email, req, res) => {
  const API_URL = process.env.FRONT_URL;
  const mailOptions = {
    from: `${process.env.GMAIL_EMAIL}`,
    to: `${email}`,
    subject: 'Registro Exitoso!',
    html: `Felicitaciones! Usted ha sido registrado al  "Human Resources Project @Web Engineering Class, 2019-2." Por favor redireccionar a <a href = ${API_URL}/login> Sign In </a>.`,
  };

  transporter.sendMail(mailOptions, function (err, success) {
    if (err) {
      console.log(err);
      return res.status(200).json({
        error:
          'Signed Up succesfully. But, it seems that a problem sending the email has ocurred',
      });
    } else {
      console.log(success);
      return res.status(200).json({
        message: `Registrado correctamente. Un email ha sido enviado a ${req.body.email}.`,
      });
    }
  });
};

const forgotPasswordMail = (email, token, res) => {
  const API_URL = process.env.FRONT_URL;
  const mailOptions = {
    from: `${process.env.GMAIL_EMAIL}`,
    to: `${email}`,
    subject: 'Recuperación contraseña',
    html: `<p>Dispone de una hora para dirigirse al siguiente <a href=${API_URL}/reset-password?token=${token}> link </a> y recuperar su contraseña. </p> `,
  };

  transporter.sendMail(mailOptions, function (err, success) {
    if (err) {
      console.log(err);
      return res.status(200).json({
        erro: 'Error al enviar correo de recuperación',
      });
    } else {
      console.log(success);
      return res.status(200).json({
        message: `Un email ha sido enviado a ${email} con las instrucciones para recuperar su contraseña.`,
      });
    }
  });
};

const verifySignUpToken = (req, res, next) => {
  var token;
  if (req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.params.signupToken) {
    token = req.params.signupToken;
  }

  var decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.params.decodedInformation = decoded;

  next();
};

const requireSignIn = expressJwt({
  //if the token is valid, express jwt appends the verified admin id
  //in an auth key to the request object
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
});

const rateLimiterUsingThirdParty = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 minutes
  max: 3,
  message: {
    error:
      'Has superado el límite de peticiones; por favor espera 3 minutos para volverlo a intentar',
  },
  headers: true,
  statusCode: 200,
});

const verifyResetToken = async (req, res, next) => {
  if (!req.body.resetPasswordLink) {
    res.status(200).json({ error: 'Token no suministrado' });
  }

  const { resetPasswordLink } = req.body;

  try {
    let worker = await Worker.findOne({ resetPasswordLink });
    if (!worker) {
      return res.status(200).json({
        error: 'Link inválido!',
      });
    }

    var decoded = jwt.verify(resetPasswordLink, process.env.JWT_SECRET);

    if (worker.hashed_password != decoded.hashed_password) {
      return res.status(200).json({
        error: 'Link inválido!',
      });
    }

    req.worker = worker;

    next();
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      error: 'Link inválido!',
    });
  }
};

module.exports = {
  signedUpMail,
  requireSignIn,
  verifySignUpToken,
  rateLimiterUsingThirdParty,
  forgotPasswordMail,
  verifyResetToken,
};
