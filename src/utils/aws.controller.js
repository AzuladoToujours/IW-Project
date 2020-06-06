const s3 = require('../config/aws-config');

exports.uploadToS3 = async (req, res, workerId, photo) => {
  const s3Client = s3.s3Client;
  const params = s3.uploadParams;

  params.Key = params.Key + '/' + workerId;
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
};

exports.uploadContractToS3 = async (req, res, workerId, photo) => {
  const s3Client = s3.s3Client;
  const params = s3.uploadParams;

  params.Key = 'workers-contracts' + '/' + workerId;
  params.Body = photo.buffer;
  params.ContentEncoding = photo.encoding;
  params.ContentType = photo.mimetype;

  try {
    const response = await s3Client.upload(params).promise();

    return response;
  } catch (e) {
    console.log(e);
    return res.status(200).json({ error: 'Error subiendo contrato al Bucket' });
  }
};

exports.uploadWageReportToS3 = async (req, res, workerId, doc) => {
  const s3Client = s3.s3Client;
  const params = s3.uploadParams;

  params.Key = 'wagereports' + '/' + workerId;
  params.Body = doc;
  params.ContentType = 'application/pdf';

  try {
    const response = await s3Client.upload(params).promise();

    return response;
  } catch (e) {
    console.log(e);
    return res
      .status(200)
      .json({ error: 'Error subiendo certificado al Bucket' });
  }
};
