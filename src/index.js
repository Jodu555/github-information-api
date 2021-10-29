const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv').config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

const { router: api } = require('./route');

app.use('/api', api);

const { errorHandling, notFound } = require('./middleware');
app.use('*', notFound);
app.use(errorHandling);

const axios = require('axios');
const cheerio = require('cheerio');

const PORT = process.env.PORT || 3100;
app.listen(PORT, async () => {
    console.log(`Express App is listening on ${PORT}`);
});