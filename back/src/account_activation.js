const mailer = require("nodemailer");
const { EMAIL_ADDRESS } = require('./utils');

function dispatchActivationEmail(userId, userName, email, code) {
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const link = `https://robjinman.com/activate?user=${userId}&code=${code}`;

  const options = {
    from: EMAIL_ADDRESS,
    to: email,
    subject: "RobJinman.com account activation",
    html: `Hi <b>${userName}</b>. Click <a href="${link}">here</a> ` +
          `to activate your account.`
  };

  transporter.sendMail(options, error => {
    if (error) {
      console.error(`Failed to send activation email to ${email}`, error);
    }
    else {
      console.log(`Activation email sent to ${email}`);
    }
  });
}

module.exports = {
  dispatchActivationEmail
};
