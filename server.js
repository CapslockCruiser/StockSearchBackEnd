const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || "8000";

app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/json' }));
app.use(cors());

app.use('/', require('./routes'));

app.get('/', (req, res) => {
    res.status(200).sendFile('./public/html/index.html', { root: __dirname });
    console.log('Request to / received');
})

app.listen(port, () => {  
    console.log('Server started on port ' + port);
})