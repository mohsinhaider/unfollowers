const express = require('express');
const { followers } = require('../requests/followers');

const router = express.Router();

/**
 * Calculates the set of your Instagram followers 
 * that do not follow you back ('nonfollowers').
 * @name POST/api/nonfollower
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

/**
 * Retrieves your Instagram followers.
 * @name GET/api/nonfollower/follower
*/
router.get('/follower', async (req, res) => {
    const targetInstagramUsername = req.query.username;

    let followersList;
    try {
        followersList = await followers(targetInstagramUsername, process.env.SERVER_CSRF_TOKEN_VALUE, process.env.SERVER_SESSION_ID_VALUE);
    } catch (error) {
        if (error === 'Instagram followers service could not successfully respond.') {
            res.status(500).send(error);
        }
        else {
            res.status(400).send(error);
        }
    }

    res.status(200).send(followersList);
})

module.exports = router;