const request = require('request');
const { metadata } = require('./metadata');
const { followersHeaders } = require('../constants/headers');
const { FOLLOWERS_REQUEST_ERROR } = require('../constants/responses');
const { followersRequestTask } = require('../helpers/followers');
const fs = require('fs');

module.exports = {
    followers: (targetInstagramUsername, csrfToken, sessionId) => {
        return new Promise(async (resolve, reject) => {
            // Set up request authentication from the get go
            const sessionIdCookieKeyValuePair = 'sessionid=' + sessionId + ';';
            followersHeaders['Cookie'] = sessionIdCookieKeyValuePair;
            followersHeaders['X-CSRFToken'] = csrfToken;

            // Store metadata object to get user properties needed for this request
            let instagramUserMetadata;
            try {
                instagramUserMetadata = await metadata(targetInstagramUsername);
            }
            catch (error) {
                return reject(error);
            }

            // Set the number of followers to fetch at a time (batch count)
            const followerBatchCount = 20;

            // Setup query string and payload for Instagram followers request
            const followersGraphqlQueryHash = 'c76146de99bb02f6415203be841dd25a';
            let followersVariables = {
                id: instagramUserMetadata.id,
                include_reel: true,
                fetch_mutual: true,
                first: followerBatchCount
            }
            let followersRequestUrl = `https://www.instagram.com/graphql/query/?query_hash=${followersGraphqlQueryHash}&variables=${encodeURIComponent(JSON.stringify(followersVariables))}`;

            // Set number of followers to grab in total and calculate total number of needed requests
            const totalFollowerCount = instagramUserMetadata.edge_followed_by.count;
            let batchRequestCount = Math.ceil(totalFollowerCount / followerBatchCount);

            // Initialize array to store followers retrieved and string to hold the 'after' query string parameter's value, which 
            // is known as the 'end_cursor', and will change with every subsequent request -- it is a pointer to first follower in next batch
            let followers = [];
            let queryEndCursor = '';
            let isExtraRequestBatchSet = false;

            // Instagram user ID is guarenteed to be stored in `instagramUserId` before this request is sent
            for (let i = 0; i < batchRequestCount; i++) {
                if (queryEndCursor) {
                    followersVariables['after'] = queryEndCursor;
                    followersRequestUrl = `https://www.instagram.com/graphql/query/?query_hash=${followersGraphqlQueryHash}&variables=${encodeURIComponent(JSON.stringify(followersVariables))}`
                }

                const taskResults = await followersRequestTask(followersRequestUrl);
                followers.push.apply(followers, taskResults.followers);
                queryEndCursor = taskResults.queryEndCursor;

                if (!isExtraRequestBatchSet && i + 1 === batchRequestCount && followers.length !== totalFollowerCount) {
                    let followerDelta = totalFollowerCount - followers.length;
                    let extraRequestsCount = Math.ceil(followerDelta / followerBatchCount);
                    batchRequestCount += extraRequestsCount;
                    isExtraRequestBatchSet = true;
                }
            }
            
            resolve(followers);
        })
    }
}