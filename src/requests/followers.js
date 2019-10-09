const request = require('request');
const { metadata } = require('./metadata');
const { followersHeaders } = require('../constants/headers');
const { FOLLOWERS_REQUEST_ERROR } = require('../constants/responses');
const fs = require('fs');

const { requestWrapper } = require('./requestwrapper');

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
            const batchRequestCount = Math.ceil(totalFollowerCount / followerBatchCount);

            // Initialize array to store followers retrieved and string to hold the 'after' query string parameter's value, which 
            // is known as the 'end_cursor', and will change with every subsequent request -- it is a pointer to first follower in next batch
            let followers = [];
            let queryEndCursor = '';

            let requestTask = (requestUrl) => {
                return new Promise((resolve, reject) => {
                    request.get({
                        headers: followersHeaders,
                        gzip: true,
                        url: requestUrl
                    }, (error, response) => {
                        // Breaking Instagram followers endpoint changes
                        if (response.statusCode != 200 || error) {
                            return reject(FOLLOWERS_REQUEST_ERROR);
                        }
                        
                        // TODO: Should be in try-catch if properties change
                        const responseObject = JSON.parse(response.body);
                        const followersBatch = responseObject['data']['user']['edge_followed_by']['edges'];

                        for (let j = 0; j < followersBatch.length; j++) {
                            console.log(followersBatch[j]['node']['username']);
                        }
                        console.log('~~----~~~----~~~---~~~~-----~~~~~----~~~~~----')
        
                        // Expired sessionid or csrftoken; authentication issue in Cookie header; user has 0 followers
                        if (followersBatch.length == 0) { // TODO: Fix 0 followers case
                            return reject(FOLLOWERS_REQUEST_ERROR);
                        }

                        // Update end cursor, to be used in next immediate request's query string to point cursor to next batch
                        queryEndCursor = responseObject['data']['user']['edge_followed_by']['page_info']['end_cursor'];
                        
                        // Push current batch of followers onto existing followers array; do not create new array
                        followers.push.apply(followers, followersBatch);
                        // console.log(`Iteration #${i} | ${followersBatch.length} followers found`);
                        resolve();
                    });
                });
            }

            // Instagram user ID is guarenteed to be stored in `instagramUserId` before this request is sent
            for (let i = 0; i < batchRequestCount + 1; i++) {
                if (queryEndCursor) {
                    followersVariables['after'] = queryEndCursor;
                    followersRequestUrl = `https://www.instagram.com/graphql/query/?query_hash=${followersGraphqlQueryHash}&variables=${encodeURIComponent(JSON.stringify(followersVariables))}`
                }

                await requestWrapper(() => requestTask(followersRequestUrl));
                //console.log('----');

                // TODO: if i+1 will equal batchRequestCount AND followers.length != totalFollowerCount, making 1 MORE request to get the last set of followers.
                // Issue with Instagram API, sometimes it will return less than the follower batch size. Alternative could be to sleep, try that first? (might make for worse user experience).
            }
        })
    }
}