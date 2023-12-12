const express = require('express');
const router = express.Router();
const DataProcessorController = require('./data-processor.controller');
const DataProcessorCon = new DataProcessorController();

router.post('/data', DataProcessorCon.dynamicDataProcessor)

module.exports = router;