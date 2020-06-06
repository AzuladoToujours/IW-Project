const Worker = require('./worker.model');
const { crudControllers } = require('../../../utils/crudMethods');
const { createDocument, createPaymentDocument } = require('./worker.helper');
const { uploadWageReportToS3 } = require('../../../utils/aws.controller');

const defaultCrudMethods = crudControllers(Worker);

const createWageReport = async (req, res) => {
  let workerId = req.auth._id;
  let worker = await Worker.findById(workerId);

  let doc = createDocument(worker);

  //RESPONSE WITH AWS
  // let response = await uploadWageReportToS3(req, res, workerId, doc);
  // return res.status(200).json({ response: response.Location });

  //EMBEBBED FILE
  doc.pipe(res);
};

const createPaymentBill = async (req, res) => {
  let workerId = req.auth._id;
  let worker = await Worker.findById(workerId);

  let doc = createPaymentDocument(worker);
  //EMBEBBED FILE
  doc.pipe(res);
};

module.exports = { defaultCrudMethods, createWageReport, createPaymentBill };
