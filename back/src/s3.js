const aws = require("aws-sdk");

class S3Service {
  constructor() {
    this.bucket = "assets.robertconsidine.net";
    this.s3 = new aws.S3();

    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });
  }

  upload(id, data) {
    let buf = new Buffer(data, "base64");

    let params = {
      Bucket: this.bucket,
      Body: buf,
      Key: id
    };

    this.s3.putObject(params, (err, data) => {
      if (err) {
        console.error(err, err.stack);
        throw new Error("Failed to upload item to S3");
      }
    });
  }
}

module.exports = {
  S3Service
};
