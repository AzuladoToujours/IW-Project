const { transporter } = require('../../../utils/mailer');
require('dotenv').config();
const { configs } = require('../../../config/index');

const signUpMail = (email, token, req, res) => {
  const API_URL = process.env.FRONT_URL;

  const mailOptions = {
    from: `${process.env.GMAIL_EMAIL}`,
    to: `${email}`,
    subject: 'Redirección de registro',
    html: `Un administrador te ha enviado una invitación para "Human Resources Project", sigue el siguiente <a href=${API_URL}${token} >link</a> para continuar el proceso de registro`,
  };

  transporter.sendMail(mailOptions, function (err, success) {
    if (err) {
      console.log(err);
      return res.status(200).json({
        error: 'Problem sending mail.',
      });
    } else {
      console.log(success);
      return res.status(200).json({
        message: `Un email ha sido enviado a ${req.body.email} con la invitación.`,
      });
    }
  });
};

const hasAdminAuthorization = (req, res, next) => {
  let isAdmin = req.auth && req.auth.role === 'admin';
  //Checks if the user is signed up and checks if his role is admin
  if (!isAdmin) {
    return res.status(200).json({
      error: 'El usuario no está autorizado para realizar esta acción',
    });
  }

  next();
};

module.exports = { signUpMail, hasAdminAuthorization };
