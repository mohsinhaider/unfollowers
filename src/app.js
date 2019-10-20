require('./db/mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');

const ApiRouter = require('./routes/api.routes');
const IndexRouter = require('./routes/index.routes');
const NonfollowerRouter = require('./routes/nonfollower.routes');

const app = express();
const apiRoutePrefix = '/api';

// Define paths to layouts, views, public directories
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsDirectoryPath = path.join(__dirname, './views');
const layoutsDirectoryPath = path.join(__dirname, './views/layouts');
const partialsDirectoryPath = path.join(__dirname, './views/partials');

// Set public assets directory
app.use(express.static(publicDirectoryPath));

// Set up Handlebars with Express
app.set('views', viewsDirectoryPath);
app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    layoutsDir: layoutsDirectoryPath,
    partialsDir: partialsDirectoryPath
}));
app.set('view engine', 'handlebars');

// Utilize body-parser as Express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Disable X-Powered-By
app.disable('x-powered-by');

// Set up routers with Express middleware
app.use('/', IndexRouter);
app.use(apiRoutePrefix + '/', ApiRouter);
app.use(apiRoutePrefix + '/nonfollower', NonfollowerRouter);

module.exports = app;