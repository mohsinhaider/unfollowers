const bodyParser = require('body-parser');
const express = require('express');
const { login } = require('./requests/login');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

/**
 * Logs in the API server to Instagram
 * @name GET/api/v1/login
*/
app.get('/login', async (req, res) => {
    try {
        login((error, response) => {
            // TODO: Add logic here
        });
    }
    catch (error) {
        // TODO: Create 404 page
        // res.render('index/404')
    }
});

/**
 * Retrieves the CSRF token generated at login time.
 * @name GET/api/v1/token
*/
app.get('/token', (req, res) => {
    res.send(process.env.SERVER_CSRF_TOKEN_VALUE);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});