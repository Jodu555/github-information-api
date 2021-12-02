const fs = require('fs');
const express = require('express');
const https = require('https');
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

app.use('/', express.static('static'));

app.use('/api', api);

const { errorHandling, notFound } = require('./middleware');
app.use('*', notFound);
app.use(errorHandling);

const axios = require('axios');
const cheerio = require('cheerio');

const PORT = process.env.PORT || 3100;
if (process.env.https) {
    const sslProperties = {
        key: fs.readFileSync('./server.key'),
        cert: fs.readFileSync('./server.cert'),
    };
    https.createServer(sslProperties, app).listen(PORT, () => {
        console.log(`Express App Listening on ${PORT}`);
    });
} else {
    app.listen(PORT, async () => {
        console.log(`Express App Listening on ${PORT}`);
    });
}