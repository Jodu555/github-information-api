const express = require('express');
const controller = require('./controller.js');
const router = express.Router();


router.get('/all/:username', controller.getAll)
router.get('/lastCommit/:username', controller.getLatestCommit)


module.exports = { router, }