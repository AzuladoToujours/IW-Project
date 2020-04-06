const { transporter } = require('../../utils/mailer');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { configs } = require('../../config/index');

const signedUpMail = (email, req, res) => {
  const API_URL = configs.apiUrl;
  const mailOptions = {
    from: `${process.env.GMAIL_EMAIL}`,
    to: `${email}`,
    subject: 'Signed Up Succesfully!',
    html: `Felicitaciones! Usted ha sido registrado al  "Human Resources Project @Web Engineering Class, 2019-2." Por favor redireccionar a  <a href = http://humanresourcesclient.s3-website.us-east-2.amazonaws.com/signin> para el Sign In </a>`,
  };

  transporter.sendMail(mailOptions, function (err, success) {
    if (err) {
      console.log(err);
      return res.status(200).json({
        message:
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

module.exports = {
  signedUpMail,
  requireSignIn,
  verifySignUpToken,
  rateLimiterUsingThirdParty,
};
