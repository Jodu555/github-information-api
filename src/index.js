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
app.use(express.json());

const { router: api } = require('./route');

const cacheTime = process.env.CACHE_TIME || 20 * 60 * 1000

app.get('/', async (req, res) => {
    let data = fs.readFileSync('static/index.html', 'utf-8');
    data = data.replace('$==time==$', cacheTime / 1000 / 60);
    data = data.replace('$==unit==$', 'Minutes');
    res.send(data);
});

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
        key: fs.readFileSync(process.env.KEY_FILE),
        cert: fs.readFileSync(process.env.CERT_FILE),
    };
    https.createServer(sslProperties, app).listen(PORT, () => {
        console.log(`Express App Listening on ${PORT}`);
    });
} else {
    app.listen(PORT, async () => {
        console.log(`Express App Listening on ${PORT}`);
    });
}