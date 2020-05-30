const Worker = require('./worker.model');
const { crudControllers } = require('../../../utils/crudMethods');
const { createDocument } = require('./worker.helper');

const defaultCrudMethods = crudControllers(Worker);

const createWageReport = async (req, res) => {
  let workerId = req.auth._id;
  let worker = await Worker.findById(workerId);

  let doc = createDocument(worker);
};

module.exports = { defaultCrudMethods, createWageReport };
