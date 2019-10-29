const { delay } = require('../helpers/delay');
const { followersHeaders } = require('../constants/headers');
const { followersRequestTask } = require('../helpers/followers');

module.exports = {
    followers: (targetInstagramUserMetadata, csrfToken, sessionId) => {
        return new Promise(async (resolve, reject) => {
            // Establish request authentication
            const sessionIdCookieKeyValuePair = 'sessionid=' + sessionId + ';';
            followersHeaders['Cookie'] = sessionIdCookieKeyValuePair;
            followersHeaders['X-CSRFToken'] = csrfToken;

            // Set the number of followers to fetch at a time (batch count)
            const followerBatchCount = 50;

            // Setup query string and payload for Instagram followers request
            const followersGraphqlQueryHash = 'c76146de99bb02f6415203be841dd25a';
            let followersVariables = {
                id: targetInstagramUserMetadata.id,
                include_reel: false,
                fetch_mutual: false,
                first: followerBatchCount
            }
            let followersRequestUrl = `https://www.instagram.com/graphql/query/?query_hash=${followersGraphqlQueryHash}&variables=${encodeURIComponent(JSON.stringify(followersVariables))}`;

            // Set number of followers to grab in total and calculate total number of needed requests
            const totalFollowerCount = targetInstagramUserMetadata.followerCount;
            let batchRequestCount = Math.ceil(totalFollowerCount / followerBatchCount);

            // Initialize array to store followers retrieved and string to hold the 'after' query string parameter's value, which 
            // is known as the 'end_cursor', and will change with every subsequent request -- it is a pointer to first follower in next batch
            let followers = [];
            let queryEndCursor = '';
            let isExtraRequestBatchSet = false;

            // If user is not followed by anyone, this code will not run
            // Instagram user ID is guarenteed to be stored in `instagramUserId` before this request is sent
            for (let i = 0; i < batchRequestCount; i++) {
                if (process.env.DEBUG_THROTTLE) {
                    console.log(`${targetInstagramUserMetadata.username}: Followers batch ${i+1}. Retrived ${followers.length} followers`);
                }
                if (queryEndCursor) {
                    followersVariables['after'] = queryEndCursor;
                    followersRequestUrl = `https://www.instagram.com/graphql/query/?query_hash=${followersGraphqlQueryHash}&variables=${encodeURIComponent(JSON.stringify(followersVariables))}`
                }

                if (i !== 0) {
                    await new Promise(done => setTimeout(done, delay(totalFollowerCount)));
                }
                
                let taskResults = null;
                try {
                    taskResults = await followersRequestTask(followersRequestUrl);
                    followers.push.apply(followers, taskResults.followers);
                    queryEndCursor = taskResults.queryEndCursor;
                }
                catch (error) {
                    reject(error);
                }

                // Logic to send a single set of requests by checking a set has not been sent yet, and if the
                // accumulated followers array length is not the same amount as the target total. Done in the
                // last iteration to pick up any 'dropped' followers.
                if (!isExtraRequestBatchSet && i + 1 === batchRequestCount && followers.length !== totalFollowerCount) {
                    let followerDelta = totalFollowerCount - followers.length;
                    let extraRequestsCount = Math.ceil(followerDelta / followerBatchCount);
                    batchRequestCount += extraRequestsCount;
                    isExtraRequestBatchSet = true;
                }
            }
            
            resolve(followers);
        });
    }
}