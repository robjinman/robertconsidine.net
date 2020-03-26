const { dispatchEmail } = require("./mail");
const { EMAIL_ADDRESS } = require('./utils');

async function dispatchActivationEmail(userId, userName, email, code) {
  const link = `https://robertconsidine.net/activate?user=${userId}&code=${code}`;

  const subject = "RobertConsidine.net account activation";
  const body = `Hi <b>${userName}</b>. Click <a href="${link}">here</a> ` +
               `to activate your account.`;

  await dispatchEmail(EMAIL_ADDRESS, password, email, subject, body);
}

module.exports = {
  dispatchActivationEmail
};
