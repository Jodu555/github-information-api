const axios = require('axios');
const cheerio = require('cheerio');
const repositoryCache = new Map(); // The repository stuff cache
const dayCache = new Map(); // The Day and commit stuff cache

const cacheTime = process.env.CACHE_TIME || 20 * 60 * 1000; // 20 Minutes

const getAllRepositories = async (username) => {
    try {
        if (repositoryCache.has(username)) {
            const diff = Date.now() - repositoryCache.get(username).time;
            if (diff < cacheTime)
                return { ...repositoryCache.get(username), cache: true };
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
        if (error && error.response && error.response.status == 404 || error && error.response && error.response.statusText && error.response.statusText == 'Not Found') {
            throw new Error('This user seems to be don\'t exists!');
        }
        throw error;
    }
}

const getDayInfos = async (username) => {
    try {
        if (dayCache.has(username)) {
            const diff = Date.now() - dayCache.get(username).time;
            if (diff < cacheTime)
                return { ...dayCache.get(username), cache: true };
        }

        const response = await axios.get(`https://github.com/Jodu555`);
        const html = response.data;
        const $ = cheerio.load(html);

        const dayInfo = {};

        const $calendarGraph = cheerio.load($('svg.js-calendar-graph-svg').html());
        $calendarGraph('g').each((i, graphGroups) => {
            const $groupItem = cheerio.load($calendarGraph(graphGroups).html());
            $groupItem('rect').each((j, rect) => {
                const attributes = $groupItem(rect).attr();
                dayInfo[attributes['data-date']] = {
                    count: attributes['data-count'],
                }
            });
        });
        dayCache.set(username, { cache: false, time: Date.now(), dayInfo, });
        return dayCache.get(username);
    } catch (error) {
        if (error && error.response && error.response.status == 404 || error && error.response && error.response.statusText && error.response.statusText == 'Not Found') {
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

const getDayCommits = async (req, res, next) => {
    try {
        const username = req.params.username;
        const data = JSON.parse(JSON.stringify(await getDayInfos(username)));

        res.json({ data });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getLatestCommit,
    getLanguagaeDevision,
    getDayCommits
}
