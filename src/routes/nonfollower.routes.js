const { botLogin } = require('../middleware/login');
const { checkSpoof } = require('../middleware/spoof');
const express = require('express');
const { followers } = require('../requests/followers');
const { following } = require('../requests/following');
const { FOLLOWERS_REQUEST_ERROR, USERID_REQUEST_ERROR, USERID_REQUEST_ERROR_LOGIC, USERID_REQUEST_ERROR_404, USERID_REQUEST_ERROR_PRIVATE_USER } 
    = require('../constants/responses');
const Handle = require('../models/handle');

const router = express.Router();

global.serviceAccountsInUse = [];
global.counter = 0;

/**
 * Calculates the set of your Instagram followers 
 * that do not follow you back ('nonfollowers').
 * @name POST/api/nonfollower
*/
router.post('/', [checkSpoof, botLogin], async (req, res) => {
    const targetInstagramUserMetadata = req.body.metadata;
    let followerUsernames, followingUsernames, nonfollowerUsernames = [];

    // Write targetInstagramUserMetadata.username
    try {
        const handle = new Handle({ handle: targetInstagramUserMetadata.username });
        await handle.save();
    } catch (error) {
        // console.log('Username could not be written to database');
        // console.log(error);
    }

    // Execute requests to get follower and following users together
    Promise.all([
        followers(targetInstagramUserMetadata, req.csrfTokenValue, req.sessionId),
        following(targetInstagramUserMetadata, req.csrfTokenValue, req.sessionId)
    ]).then(result => {
        global.serviceAccountsInUse = global.serviceAccountsInUse.filter(svcAcc => svcAcc !== req.serviceAccountHandle)

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
        global.serviceAccountsInUse = global.serviceAccountsInUse.filter(svcAcc => svcAcc !== req.serviceAccountHandle)
        res.sendStatus(500);
    });
});

/**
 * Retrieves your Instagram followers.
 * @name POST/api/nonfollower/follower
*/
router.post('/follower', botLogin, async (req, res) => {
    const targetInstagramUserMetadata = req.body.metadata;
    let followersList;
    try {
        followersList = await followers(targetInstagramUserMetadata, req.csrfTokenValue, req.sessionId);
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