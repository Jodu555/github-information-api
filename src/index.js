const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());

app.get('/:username', async (req, res, next) => {
    const username = req.params.username;
    const response = await axios.get(`https://github.com/${username}?tab=repositories`);
    const html = response.data;

    res.json({});
});

const PORT = process.env.PORT || 3100;
app.listen(PORT, async () => {
    console.log(`Express App is listening on ${PORT}`);
});