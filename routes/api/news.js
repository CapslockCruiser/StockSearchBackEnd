const express = require('express');
const router = express.Router({ mergeParams: true });
const fetch = require('node-fetch');
const fs = require('fs');

const keys_json  = JSON.parse(fs.readFileSync(__dirname + '/keys.json', 'utf8'));

function filter(n, keywords, news) {
    var count = 0;
    var articleIndex = 0;
    let newsCount = news.length;
    var completeArticles = []
    while (count < n &&  articleIndex < newsCount) {
        let currentArticle = news[articleIndex];
        complete = true;

        for (const key of keywords) {
            if (currentArticle[key] === undefined) {
                complete = false;
            }
        }

        if (complete) {
            completeArticles.push(currentArticle);
        }
        articleIndex += 1;
    }

    return completeArticles;
}

router.get('/', async (req, res) => {
    news_url = 'https://newsapi.org/v2/everything?apiKey=' + keys_json['news_api_key'] + '&q=' + req.query['ticker'];

    const results = await fetch(news_url)
        .then(response => { return response.json() });

    let articles = results['articles'];
    let completeArticles = filter(10, ['source', 'publishedAt', 'title', 'description', 'url'], articles);

    res.json(completeArticles);
})

module.exports = router;