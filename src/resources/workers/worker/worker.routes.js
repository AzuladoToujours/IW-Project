const express = require('express');
const router = express.Router();
const { defaultCrudMethods } = require('./worker.controller');
const { getMany, getOne } = defaultCrudMethods;

router.get('/workers', getMany);
router.get('/worker/:id', getOne);

module.exports = router;
