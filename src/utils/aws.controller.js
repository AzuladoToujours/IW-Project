const s3 = require('../config/aws-config');

exports.uploadToS3 = async (req, res, workerId, photo) => {
  const s3Client = s3.s3Client;
  const params = s3.uploadParams;

  params.Key = params.Key + '/' + workerId;
  //params.Key = workerId;
  params.Body = photo.buffer;
  params.ContentEncoding = photo.encoding;
  params.ContentType = photo.mimetype;

  try {
    const response = await s3Client.upload(params).promise();

    return response;
  } catch (e) {
    console.log(e);
    return res.status(200).json({ error: 'Error subiendo imagen al Bucket' });
  }
  //   s3Client.upload(params, (err, data) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(200).json({ error: 'Error subiendo imagen al Bucket' });
  //     }
  //     //console.log(data);
  //   });
};
