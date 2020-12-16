const express = require('express');
const router = express.Router({ mergeParams: true });
const fetch = require('node-fetch');
const fs = require('fs');
const moment = require('moment-timezone');

const keys_json  = JSON.parse(fs.readFileSync(__dirname + '/keys.json', 'utf8'));

router.get('/', async (req, res) => {
    today = moment();
    twoYearsAgo = today.subtract(2, 'years');
    dateString = `${twoYearsAgo.format('YYYY-MM-DD')}`;

    var historyURL = `https://api.tiingo.com/tiingo/daily/${req.query['ticker']}/prices?startDate=${dateString}&resampleFreq=daily&columns=date,open,high,low,close,volume&token=${keys_json['tiingo_key']}`;
    // console.log(historyURL);
    const results = await fetch(historyURL).then( response => { return response.json() });
    // console.log(results);

    res.json(results);
})

module.exports = router;