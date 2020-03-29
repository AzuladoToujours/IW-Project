const { transporter } = require('../../utils/mailer');
require('dotenv').config();

const mailOptions = (email) => {
  return {
    from: `${process.env.GMAIL_EMAIL}`,
    to: `${email}`,
    subject: 'Signed Up Succesfully!',
    text:
      'Congrats! you have been signed up to the Human Resources Project @Web Engineering Class, 2019-2.',
  };
};

const sendMail = async (mailOptions, req, res) => {
  await transporter.sendMail(mailOptions, function (err, success) {
    if (err) {
      console.log(err);
      return res.status(200).json({
        message:
          'Signed Up succesfully. But, it seems that a problem sending the email has ocurred',
      });
    } else {
      console.log(success);
      return res.status(200).json({
        message: `Signed Up succesfully. an email has been sent to ${req.body.email}.`,
      });
    }
  });
};

module.exports = { mailOptions, sendMail };
