const express = require('express');
const router = express.Router({ mergeParams: true });
const fs = require('fs');
const fetch = require('node-fetch');
const moment = require('moment-timezone');

const keys_json  = JSON.parse(fs.readFileSync(__dirname + '/keys.json', 'utf8'));

router.get('/', async (req, res) => {
    var date = moment().tz('America/New_York');
    const day = moment().day();
    // console.log(date);

    // if (day === 6) {
    //     date = moment().subtract(1, 'days');
    // } else if (day === 0) {
    //     date = moment().subtract(2, 'days');
    // }

    var dateString = `${date.format('YYYY-MM-DD')}`;
    var url = `https://api.tiingo.com/iex/${req.query['ticker']}/prices?startDate=${dateString}&resampleFreq=5Min&token=${keys_json['tiingo_key']}`;

    var results = await fetch(url).then( response => { return response.json() });

    var daysOffset = 1;

    while (results[0] === undefined) {
        date = moment().subtract(daysOffset, 'days');
        dateString = `${date.format('YYYY-MM-DD')}`;
        url = `https://api.tiingo.com/iex/${req.query['ticker']}/prices?startDate=${dateString}&resampleFreq=5Min&token=${keys_json['tiingo_key']}`;
        results = await fetch(url).then( response => { return response.json() });
        // console.log(`Getting URL ${url}`);
        daysOffset = daysOffset + 1;
    }

    var daily = new Array();
    // daily["serverLocalTime"] = moment();
    // daily["requestDate"] = dateString;
    // daily["serverLocalDay"] = day;
    for (i in results) {
        // console.log(`Close is: ${results[i]['close']}`);
        // const time = moment(results[i]["date"]).tz("America/Los_Angeles").format("dddd[, ]MMM DD[, ]hh:mm").toString();

        let time = moment(results[i]['date']).valueOf();
        let data = [time, results[i]['close']];
        daily.push(data);
    }

    var response = {};

    response["dailyData"] = daily;

    res.json(response);
})

module.exports = router;

// https://api.tiingo.com/iex/AAPL/prices?startDate=2019-09-
// 10&resampleFreq=4min&token=12PrIvA32tEmYtEmpToKeN23

// https://api.tiingo.com/iex/aapl/prices?startDate=2019-01-02&resampleFreq=5Min&token=4d4dcb4e7187fac07acb2dca8a72b69369660db9
// https://api.tiingo.com/iex/aapl/prices?startDate=2020-10-31&resampleFreq=5Min&token=4d4dcb4e7187fac07acb2dca8a72b69369660db9