const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');

const IndexRouter = require('./routes/index.routes');
const NonfollowerRouter = require('./routes/nonfollower.routes');

const app = express();
const apiRoutePrefix = '/api';
const publicDirectoryPath = path.join(__dirname, '../public');

// Set public assets directory
app.use(express.static(publicDirectoryPath));

// Utilize body-parser as Express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set up routers with Express middleware
app.use(apiRoutePrefix + '/', IndexRouter);
app.use(apiRoutePrefix + '/nonfollower', NonfollowerRouter);

module.exports = app;