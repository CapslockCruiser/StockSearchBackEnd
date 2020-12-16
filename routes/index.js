const express = require('express');
const router = express.Router({ mergeParams: true });
const summary = require('./api/summary');
const news = require('./api/news');
const history = require('./api/history');
const autocomplete = require('./api/autocomplete');
const today = require('./api/today');
const summaryList = require('./api/summary-list');
const dailyList = require('./api/daily-list')

router.use('/api/summary', summary);
router.use('/api/history', history);
router.use('/api/news', news);
router.use('/api/autocomplete', autocomplete);
router.use('/api/today', today);
router.use('/api/summary-list', summaryList);
router.use('/api/daily-list', dailyList);


router.get('/', function(req, res) {
    console.log('Hitting base route');
    res.send('Base path. Notihng to see here');
    // res.send(req.query)
})

module.exports = router;