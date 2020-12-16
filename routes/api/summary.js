const express = require('express');
const router = express.Router({ mergeParams: true });
const fs = require('fs');
const fetch = require('node-fetch');

const keys_json  = JSON.parse(fs.readFileSync(__dirname + '/keys.json', 'utf8'));

router.get('/', async (req, res) => {
    daily_url = 'https://api.tiingo.com/tiingo/daily/' + req.query['ticker'] + '?token=' + keys_json['tiingo_key'];
    iex_url = 'https://api.tiingo.com/iex/?tickers=' + req.query['ticker'] + '&token=' + keys_json['tiingo_key'];
    // console.log(daily_url);
    // console.log(iex_url);

    const results = await Promise.all([
        fetch(daily_url),
        fetch(iex_url)
    ]).then(function (responses) {
        return Promise.all(responses.map(function(response) {
            if (response !== undefined) {
                return response.json();
            } else {
                return null;
            }
        }));
    }).then(data => {
        var response = {};
        var iex_data = data[0];
        var daily_data = data[1][0];
        // console.log(iex_data);
        // console.log('-------------------');
        // console.log(daily_data);
        response['description'] = iex_data['description']
        response['ticker'] = iex_data['ticker'];
        response['startDate'] = iex_data['startDate'];
        response['name'] = iex_data['name'];
        response['exchangeCode'] = iex_data['exchangeCode'];
        if (iex_data['detail'] === "Not found.") {
            return { data: "Invalid symbol" };
        }
        var timestamp = daily_data['timestamp'];
        // TODO: Process timestamp
        // console.log(timestamp);
        response['timestamp'] = timestamp;
        lastPrice = daily_data['last'];
        prevClose = daily_data['prevClose'];
        change = (lastPrice - prevClose) //.toFixed(2);
        response['change'] = change;
        response['changePercent'] = (change * 100 / prevClose) //.toFixed(2);
        response['last'] = lastPrice;
        response['prevClose'] = prevClose;
        response['open'] = daily_data['open'];
        response['high'] = daily_data['high'];
        response['low'] = daily_data['low'];
        response['mid'] = daily_data['mid'];
        response['volume'] = daily_data['volume'];
        response['bidSize'] = daily_data['bidSize'];
        response['bidPrice'] = daily_data['bidPrice'];
        response['askSize'] = daily_data['askSize'];
        response['askPrice'] = daily_data['askPrice'];
        return response;
    }).catch(function (error) {
        console.log(error);
    })
    
    // console.log(results);
    res.json(results);
})

module.exports = router;