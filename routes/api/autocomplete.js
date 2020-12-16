const express = require('express');
const router = express.Router({ mergeParams: true });
const fetch = require('node-fetch');
const fs = require('fs');

const keys_json  = JSON.parse(fs.readFileSync(__dirname + '/keys.json', 'utf8'));

router.get('/', async (req, res) => {
    var url = `https://api.tiingo.com/tiingo/utilities/search?query=${req.query['string']}&token=${keys_json['tiingo_key']}`
    console.log(url);
    const results = await fetch(url).then( response => { return response.json() });
    console.log(results);
    var cleaned = new Array();

    for (i in results) {
        // Get name and tickers
        const pair = { 'ticker': results[i]['ticker'], 'name': results[i]['name'] }
        // console.log(pair);
        cleaned.push(pair);
    }

    // console.log(cleaned);
    res.json(cleaned);
})

module.exports = router;