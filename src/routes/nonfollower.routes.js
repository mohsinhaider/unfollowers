const express = require('express');
const { followers } = require('../requests/followers');
const { following } = require('../requests/following');
const { metadata } = require('../requests/metadata');
const { FOLLOWERS_REQUEST_ERROR, USERID_REQUEST_ERROR, USERID_REQUEST_ERROR_LOGIC } 
    = require('../constants/responses');

const router = express.Router();

/**
 * Calculates the set of your Instagram followers 
 * that do not follow you back ('nonfollowers').
 * @name POST/api/nonfollower
*/
router.post('/', async (req, res) => {
    const targetInstagramUsername = req.body.username;
    let followerUsernames, followingUsernames, nonfollowerUsernames = [];
    try {
        const instagramUserMetadata = await metadata(targetInstagramUsername);

        // Execute requests to get follower and following users together
        Promise.all([
            followers(instagramUserMetadata, process.env.SERVER_CSRF_TOKEN_VALUE, process.env.SERVER_SESSION_ID_VALUE),
            following(instagramUserMetadata, process.env.SERVER_CSRF_TOKEN_VALUE, process.env.SERVER_SESSION_ID_VALUE)
        ]).then(result => {
            followerUsernames = result[0];
            followingUsernames = result[1];

            // For each following user, check if they are a follower, if not, they are a 'nonfollower'
            followingUsernames.forEach(followingUser => {
                let foundUser = false;
                // followingUser & followerUsername[i] schema: 
                //      { username: 'this', profilePicUrl: 'that' }
                for (let i = 0; i < followerUsernames.length; i++) {
                    if (followerUsernames[i].username === followingUser.username) {
                        foundUser = true;
                        break;
                    }
                }
                if (!foundUser) {
                    nonfollowerUsernames.push(followingUser);
                }
            });

            res.status(200).send(nonfollowerUsernames);
        });
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
        const instagramUserMetadata = await metadata(targetInstagramUsername);
        followersList = await followers(instagramUserMetadata, process.env.SERVER_CSRF_TOKEN_VALUE, process.env.SERVER_SESSION_ID_VALUE);
    } 
    catch (error) {
        const errorResponseMessages = [FOLLOWERS_REQUEST_ERROR, USERID_REQUEST_ERROR, USERID_REQUEST_ERROR_LOGIC];
        if (errorResponseMessages.indexOf(error) !== -1) {
            res.status(500).send(error);
        }
        else {
            res.status(400).send(error);
        }
    }

    res.status(200).send(followersList);
});

module.exports = router;