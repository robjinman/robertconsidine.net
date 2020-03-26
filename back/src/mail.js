const mailer = require("nodemailer");

function dispatchEmail(senderEmail,
                       password,
                       recipientEmail,
                       subject,
                       body) {
  const transportOpts = {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: senderEmail,
      pass: password
    }
  };

  const transporter = mailer.createTransport(transportOpts);

  const options = {
    from: senderEmail,
    to: recipientEmail,
    subject,
    html: body
  };

  console.log("Sending email with options", transportOpts, options);

  return new Promise((resolve, reject) => {
    transporter.sendMail(options, error => {
      if (error) {
        reject(`Failed to send email to ${recipientEmail}: ${error}`);
      }
      else {
        console.log(`Email sent to ${recipientEmail}`);
        resolve();
      }
    });
  });
}

module.exports = {
  dispatchEmail
};
