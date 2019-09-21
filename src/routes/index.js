const express = require('express');
const { login } = require('../requests/login');

const router = express.Router();

/**
 * Logs in the API server to Instagram
 * @name GET/api/v1/login
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

module.exports = router;