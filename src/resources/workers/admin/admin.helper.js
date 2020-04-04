const { transporter } = require('../../../utils/mailer');
require('dotenv').config();
const { configs } = require('../../../config/index');

const signUpMail = (email, token, req, res) => {
  const API_URL = configs.apiUrl;

  const mailOptions = {
    from: `${process.env.GMAIL_EMAIL}`,
    to: `${email}`,
    subject: 'Sign Up Redirection',
    html: `An admin has sent you an invitation to join the Human Resources Project, follow the next <a href=${API_URL}/signup/${token} >link</a> to continue the sign up process`,
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
        message: `An email with the invitation has been sent to ${req.body.email}.`,
      });
    }
  });
};

const hasAdminAuthorization = (req, res, next) => {
  let isAdmin = req.auth && req.auth.role === 'admin';
  //Checks if the user is signed up and checks if his role is admin
  if (!isAdmin) {
    return res
      .status(403)
      .json({ error: 'User is not authorized to perform this action' });
  }

  next();
};

module.exports = { signUpMail, hasAdminAuthorization };
