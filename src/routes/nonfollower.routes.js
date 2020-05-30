const { botLogin } = require('../middleware/login');
const { checkSpoof } = require('../middleware/spoof');
const { compareWithLimit } = require('../middleware/limit');
const express = require('express');
const { followers } = require('../requests/followers');
const { following } = require('../requests/following');
const { FOLLOWERS_REQUEST_ERROR, USERID_REQUEST_ERROR, USERID_REQUEST_ERROR_LOGIC, USERID_REQUEST_ERROR_404, USERID_REQUEST_ERROR_PRIVATE_USER } 
    = require('../constants/responses');
const { saveNonfollowerRequestInfo } = require('../middleware/reqinfo');

const router = express.Router();

global.serviceAccountHandles = ['charlottebrandstatter', 'sloohbru6', 'itsbentleybo'];
global.serviceAccountsInUse = [];
global.counter = 0;

/**
 * Calculates the set of your Instagram followers 
 * that do not follow you back ('nonfollowers').
 * @name POST/api/nonfollower
*/
router.post('/', [checkSpoof, saveNonfollowerRequestInfo, compareWithLimit, botLogin], async (req, res) => {
    const targetInstagramUserMetadata = req.body.metadata;
    let followerUsers, followingUsers, nonfollowerUsernames = [];

    // Execute requests to get follower and following users together
    Promise.all([
        followers(targetInstagramUserMetadata, req.csrfTokenValue, req.sessionId),
        following(targetInstagramUserMetadata, req.csrfTokenValue, req.sessionId)
    ]).then(result => {
        global.serviceAccountsInUse = global.serviceAccountsInUse.filter(svcAcc => svcAcc !== req.serviceAccountHandle)

        followerUsers = result[0];
        followingUsers = result[1];

        const followersUsernames = followerUsers.map(follower => {
            return follower.username
        });

        const followersUsernamesSet = new Set(followersUsernames);

        // For each following user, check if they are a follower, if not, they are a 'nonfollower'
        followingUsers.forEach(followingUser => {
            // followingUser & followerUsername[i] schema:
            // { username: 'this', profilePicUrl: 'that' }
            if (!followersUsernamesSet.has(followingUser.username)) {
                nonfollowerUsernames.push(followingUser);
            }
        });

        res.status(200).send(nonfollowerUsernames);
    })
    .catch(error => {
        console.log(error)
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