const express = require('express');
const { followers } = require('../requests/followers');
const { following } = require('../requests/following');
const { metadata } = require('../requests/metadata');
const { FOLLOWERS_REQUEST_ERROR, USERID_REQUEST_ERROR, USERID_REQUEST_ERROR_LOGIC, USERID_REQUEST_ERROR_404, USERID_REQUEST_ERROR_PRIVATE_USER } 
    = require('../constants/responses');

const router = express.Router();

/**
 * Calculates the set of your Instagram followers 
 * that do not follow you back ('nonfollowers').
 * @name POST/api/nonfollower
*/
router.post('/', async (req, res) => {
    const targetInstagramUserMetadata = req.body.metadata;
    let followerUsernames, followingUsernames, nonfollowerUsernames = [];

    // Execute requests to get follower and following users together
    Promise.all([
        followers(targetInstagramUserMetadata, process.env.SERVER_CSRF_TOKEN_VALUE, process.env.SERVER_SESSION_ID_VALUE),
        following(targetInstagramUserMetadata, process.env.SERVER_CSRF_TOKEN_VALUE, process.env.SERVER_SESSION_ID_VALUE)
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
    })
    .catch(error => {
        res.sendStatus(500);
    });
});

/**
 * Retrieves your Instagram followers.
 * @name POST/api/nonfollower/follower
*/
router.post('/follower', async (req, res) => {
    const targetInstagramUserMetadata = req.body.metadata;
    let followersList;
    try {
        followersList = await followers(targetInstagramUserMetadata, process.env.SERVER_CSRF_TOKEN_VALUE, process.env.SERVER_SESSION_ID_VALUE);
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