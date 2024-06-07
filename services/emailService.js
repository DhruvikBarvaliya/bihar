const nodemailer = require("nodemailer");
const config = require("../config/config");
const transporter = nodemailer.createTransport({
  service: config.EMAIL_SERVICE,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASS,
  },
  debug: true,
});

exports.sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: config.EMAIL_USER,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
};
