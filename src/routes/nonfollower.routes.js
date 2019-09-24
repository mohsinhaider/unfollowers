const express = require('express');

const { followers } = require('../requests/followers');

const router = express.Router();

/**
 * Calculates the set of your Instagram followers 
 * that do not follow you back ('nonfollowers').
 * @name POST/api/nonfollowers
*/
router.post('/', async (req, res) => {
    try {
        let followersList = await followers(process.env.SERVER_CSRF_TOKEN_VALUE, process.env.SERVER_SESSION_ID_VALUE);
        res.sendStatus(200);
    }
    catch (error) {
        // Render an the main app page with an error message

    }
});

module.exports = router;