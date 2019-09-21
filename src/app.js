const bodyParser = require('body-parser');
const express = require('express');
const { login } = require('./requests/login');
const path = require('path');

const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');

// Set public assets directory
app.use(express.static(publicDirectoryPath));

// Utilize body-parser as Express middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * Logs in the API server to Instagram
 * @name GET/api/v1/login
*/
app.get('/login', async (req, res) => {
    try {
        login((error, response) => {
            if (error) {
                res.render('index/404');
            }
            res.send('Login was successful');
        });
    }
    catch (error) {
        res.render('index/404')
    }
});

/**
 * Retrieves the CSRF token generated at login time.
 * @name GET/api/v1/token
*/
app.get('/token', (req, res) => {
    res.send(process.env.SERVER_CSRF_TOKEN_VALUE);
});

module.exports = app;