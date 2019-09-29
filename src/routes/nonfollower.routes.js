const express = require('express');

const { followers } = require('../requests/followers');

const router = express.Router();

/**
 * Calculates the set of your Instagram followers 
 * that do not follow you back ('nonfollowers').
 * @name POST/api/nonfollowers
*/
router.post('/', async (req, res) => {
    const targetInstagramUsername = req.body.username;
    try {
        const followersList = await followers(targetInstagramUsername, process.env.SERVER_CSRF_TOKEN_VALUE, process.env.SERVER_SESSION_ID_VALUE);
        res.sendStatus(200);
    }
    catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;