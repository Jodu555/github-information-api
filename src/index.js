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

let latest_api_call = Date.now();

app.get('/', async (req, res) => {
    let data = fs.readFileSync('static/index.html', 'utf-8');
    data = data.replace('$==time==$', cacheTime / 1000 / 60);
    data = data.replace('$==unit==$', 'Minutes');
    data = data.replace('$==latest_api_call==$', formatTime(Date.now() - latest_api_call) + ' HH:MM:SS');
    res.send(data);
});

function formatTime(time) {
    const hours = parseInt(time / 1000 / 60 / 60).toString();
    time %= 1000 * 60 * 60;
    const minutes = parseInt(time / 1000 / 60).toString();
    time %= 1000 * 60;
    const seconds = parseInt(time / 1000).toString();
    return hours + ":" + minutes.padStart(2, '0') + ":" + seconds.padStart(2, '0');
}

app.use('/', express.static('static'));

app.use('/api', (req, res, next) => {
    latest_api_call = Date.now();
    next();
}, api);

const { errorHandling, notFound } = require('./middleware');
app.use('*', notFound);
app.use(errorHandling);


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