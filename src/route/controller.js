const axios = require('axios');
const cheerio = require('cheerio');
const cache = new Map();

const getAllRepositories = async (username) => {
    const response = await axios.get(`https://github.com/${username}?tab=repositories`);
    const html = response.data;
    const $ = cheerio.load(html);
    if (typeof $('#user-repositories-list').html() == 'string') {
        const $repoList = cheerio.load($('#user-repositories-list').html());
        const repositories = [];
        $repoList('li').each((i, item) => {
            const $repo = cheerio.load($repoList(item).html());
            const name = $repo('[itemprop="name codeRepository"]').text().trim();
            const description = $repo('[itemprop="description"]').text().trim();
            const language = $repo('[itemprop="programmingLanguage"]').text().trim();
            const repoHtml = $repo.html();
            //!Here i dont know the way to parse this with cheerio so the good old split mehtod comes!
            const datetime = repoHtml.split('<relative-time')[1].split(' ')[1].split('"')[1];

            repositories.push({
                name,
                description,
                language,
                lastUpdated: new Date(datetime).getTime(),
            });
        });
    }
}

const getAll = async (req, res, next) => {
    const username = req.params.username;
    const repositories = await getAllRepositories(username);
    res.json({ repositories });
}

const getLatestCommit = async (req, res, next) => {
    const username = req.params.username;
    const repositories = await getAllRepositories(username);
    res.json({ repositories });
}

module.exports = {
    getAll
}
