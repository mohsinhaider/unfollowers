const bodyParser = require('body-parser');
const express = require('express');
const { login } = require('./requests/login');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));

app.get('/login', async (req, res) => {
    login((error, response) => {
        // TODO: Add logic here
    });
});

// Testing purpose only, works after /login is called.
app.get('/token', (req, res) => {
    res.send(process.env.SERVER_CSRF_TOKEN_VALUE);
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});