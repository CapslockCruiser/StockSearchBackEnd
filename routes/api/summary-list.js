const express = require('express');
const router = express.Router({ mergeParams: true });
const fs = require('fs');
const fetch = require('node-fetch');

const keys_json  = JSON.parse(fs.readFileSync(__dirname + '/keys.json', 'utf8'));

router.get('/', async (req, res) => {
    daily_url = 'https://api.tiingo.com/tiingo/daily/' + req.query['ticker'] + '?token=' + keys_json['tiingo_key'];
    console.log(daily_url);
    // iex_url = 'https://api.tiingo.com/iex/?tickers=' + req.query['ticker'] + '&token=' + keys_json['tiingo_key'];
    // console.log(iex_url);

    const results = await fetch(daily_url)
        .then(response => { return response.json() })
    .catch(function (error) {
        console.log(error);
    })
    
    // console.log(results);
    res.json(results);
})

module.exports = router;