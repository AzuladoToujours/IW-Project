const { transporter } = require('../../utils/mailer');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const signedUpMail = (email, req, res) => {
  const mailOptions = {
    from: `${process.env.GMAIL_EMAIL}`,
    to: `${email}`,
    subject: 'Signed Up Succesfully!',
    text:
      'Congrats! you have been signed up to the Human Resources Project @Web Engineering Class, 2019-2.',
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
        message: `Signed Up succesfully. An email has been sent to ${req.body.email}.`,
      });
    }
  });
};

const verifySignUpToken = (req, res, next) => {
  const token = req.params.signupToken;

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

module.exports = { signedUpMail, requireSignIn, verifySignUpToken };
