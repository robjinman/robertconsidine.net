const mailer = require("nodemailer");
const { EMAIL_ADDRESS } = require('./utils');

async function processActivation(req, res, prisma) {
  try {
    if (!req.query.code) {
      throw Error("Null activation code");
    }

    await prisma.updateUser({
      data: {
        activationCode: null
      },
      where: {
        activationCode: req.query.code,
      }
    });

    console.log("Activated user");
    res.redirect('https://robjinman.com/activation-success');
  }
  catch(err) {
    console.error(err);
    res.redirect('https://robjinman.com/activation-failure');
  }
}

function dispatchActivationEmail(userName, email, code) {
  const transporter = mailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const link = `https://robjinman.com/activate?code=${code}`;

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
  processActivation,
  dispatchActivationEmail
};
