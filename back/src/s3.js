const aws = require("aws-sdk");

class S3Service {
  constructor() {
    this.bucket = "assets.robjinman.com";
    this.s3 = new aws.S3();

    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
  }

  upload(id, data, fileExt) {
    let buf = new Buffer(data, "base64");

    let params = {
      Bucket: this.bucket,
      Body: buf,
      Key: id + fileExt
    };

    this.s3.putObject(params, (err, data) => {
      // TODO:
      if (err) {
        console.log("Failed");
        console.log(err, err.stack);
      }
      else {
        console.log("Success!");
      }
    });
  }
}

module.exports = {
  S3Service
};
