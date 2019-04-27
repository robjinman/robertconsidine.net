const https = require("https");

function verifyCaptcha(captcha) {
  return new Promise((resolve, reject) => {
    const payload = {
      "secret": process.env.RECAPTCHA_SECRET_KEY,
      "response": captcha
    };
    const payloadString = JSON.stringify(payload);

    const options = {
      method: "POST",
      hostname: "www.google.com",
      path: "/recaptcha/api/siteverify",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": payloadString.length
      },
      agent: false
    };

    let req = https.request(options, res => {
      if (res.statusCode == 200) {
        resolve();
      }
      else {
        reject(new Error(`Bad captcha; Status code ${res.statusCode}`));
      }
    });

    req.on("error", err => {
      reject(new Error(`Bad captcha: ${err}`));
    });

    req.write(payloadString);
    req.end();
  });
}

module.exports = {
  verifyCaptcha
};
