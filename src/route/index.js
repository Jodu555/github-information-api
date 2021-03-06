const express = require('express');
const controller = require('./controller.js');
const router = express.Router();


router.get('/all/:username', controller.getAll); //Returns all Public projects with title, description, lastUpdate and language
router.get('/lastCommit/:username/:repositoryName?', controller.getLatestCommit); //Returns the latest updated project
router.get('/languageDevision/:username', controller.getLanguagaeDevision); // Returns the language devision
router.get('/dayCommits/:username', controller.getDayCommits);
router.get('/avarageCommits/:username', controller.getAvarageCommits);

module.exports = { router, }