const express = require('express');
const controller = require('./controller.js');
const router = express.Router();


router.get('/all/:username', controller.getAll); //Returns all Public projects with title, description, lastUpdate and language
router.get('/lastCommit/:username', controller.getLatestCommit); //Returns the latest updated project
router.get('/languagaeDevision/:username', controller.getLatestCommit); // Returns the language devision


module.exports = { router, }