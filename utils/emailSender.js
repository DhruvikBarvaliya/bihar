const emailService = require("../services/emailService");

exports.sendEmail = async (to, subject, text) => {
  try {
    await emailService.sendEmail(to, subject, text);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}: ${error.message}`);
  }
};
