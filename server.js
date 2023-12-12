const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const router = express.Router();
const port = process.env.PORT || 4000;
const cronList = require('./cron/cron');


// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: '2mb',extended: false }));

require('dotenv').config()

require('./routes')(app);
app.listen(port, () => {
    console.log(`Server is started on.(${process.env.NODE_ENV}) : http://localhost:${port}/`)
});

for( let cronElement of cronList ) {
    cronElement.stop();
}
