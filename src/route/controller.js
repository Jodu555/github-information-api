const axios = require('axios');
const cheerio = require('cheerio');
const cache = new Map();

const cacheTime = process.env.CACHE_TIME || 20 * 60 * 1000;

const getAllRepositories = async (username) => {
    try {
        if (cache.has(username)) {
            const diff = Date.now() - cache.get(username).time;
            if (diff < cacheTime)
                return { ...cache.get(username), cache: true };
        }
        const response = await axios.get(`https://github.com/${username}?tab=repositories`);
        const html = response.data;
        const $ = cheerio.load(html);
        const repositories = [];
        if (typeof $('#user-repositories-list').html() == 'string') {
            const $repoList = cheerio.load($('#user-repositories-list').html());
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
        cache.set(username, { cache: false, time: Date.now(), repositories: repositories, });
        return cache.get(username);
    } catch (error) {
        if (error.response.status == 404 || error.response.statusText == 'Not Found') {
            throw new Error('This user seems to be don\'t exists!');
        }
        throw error;
    }
}

const getAll = async (req, res, next) => {
    try {
        const username = req.params.username;
        const data = await getAllRepositories(username);
        res.json({ data });
    } catch (error) {
        next(error);
    }

}

const getLatestCommit = async (req, res, next) => {
    try {
        const username = req.params.username;
        const data = JSON.parse(JSON.stringify(await getAllRepositories(username)));
        data.repositories = data.repositories.sort((a, b) => {
            return a.lastUpdated + b.lastUpdated;
        });
        data.info = data.repositories[0];
        delete data.repositories;
        res.json({ data });
    } catch (error) {
        next(error);
    }
}

const getLanguagaeDevision = async (req, res, next) => {
    try {
        const username = req.params.username;
        const data = JSON.parse(JSON.stringify(await getAllRepositories(username)));
        const devision = {};
        data.repositories.forEach((repo) => {
            devision[repo.language] = devision[repo.language] + 1 || 1
        });

        delete data.repositories;
        data.devision = devision;
        res.json({ data });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getLatestCommit,
    getLanguagaeDevision
}
