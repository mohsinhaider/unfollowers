const express = require('express');
const { login } = require('../requests/login');

const router = express.Router();

/**
 * Logs in the API server to Instagram
 * @name GET/api/login
*/
router.get('/login', async (req, res) => {
    try {
        login((error, response) => {
            if (error) {
                res.render('index/404');
            }
            res.status(200).send('Login was successful');
        });
    }
    catch (error) {
        res.render('index/404')
    }
});

/**
 * Retrieves the CSRF token generated at login time.
 * @name GET/api/token
*/
router.get('/token', (req, res) => {
    res.send(process.env.SERVER_CSRF_TOKEN_VALUE);
});

module.exports = router;