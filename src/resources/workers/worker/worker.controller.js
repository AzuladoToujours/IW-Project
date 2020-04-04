const Worker = require('./worker.model');
const { crudControllers } = require('../../../utils/crudMethods');

const defaultCrudMethods = crudControllers(Worker);

module.exports = { defaultCrudMethods };
