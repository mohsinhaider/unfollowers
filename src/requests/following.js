const { followingHeaders } = require('../constants/headers');
const { followingRequestTask } = require('../helpers/following');

module.exports = {
    following: (targetInstagramUserMetadata, csrfToken, sessionId) => {
        return new Promise(async (resolve, reject) => {
            const sessionIdCookieKeyValuePair = 'sessionid=' + sessionId + ';';
            followingHeaders['X-CSRFToken'] = csrfToken;
            followingHeaders['Cookie'] = sessionIdCookieKeyValuePair;

            // Set the number of following to fetch at a time (batch count)
            const followingBatchCount = 20;

            // Setup query string and payload for Instagram following request
            const followingGraphqlQueryHash = 'd04b0a864b4b54837c0d870b0e77e076';
            let followingVariables = {
                id: targetInstagramUserMetadata.id,
                include_reel: false,
                fetch_mutual: false,
                first: followingBatchCount
            }
            let followingRequestUrl = `https://www.instagram.com/graphql/query/?query_hash=${followingGraphqlQueryHash}&variables=${encodeURIComponent(JSON.stringify(followingVariables))}`;

            const totalFollowingCount = targetInstagramUserMetadata.edge_follow.count;
            let batchRequestCount = Math.ceil(totalFollowingCount / followingBatchCount);

            let following = [];
            let queryEndCursor = '';
            let isExtraRequestBatchSet = false;

            for (let i = 0; i < batchRequestCount; i++) {
                if (queryEndCursor) {
                    followingVariables['after'] = queryEndCursor;
                    followingRequestUrl = `https://www.instagram.com/graphql/query/?query_hash=${followingGraphqlQueryHash}&variables=${encodeURIComponent(JSON.stringify(followingVariables))}`;
                }

                let taskResults = null;
                try {
                    taskResults = await followingRequestTask(followingRequestUrl);
                    following.push.apply(following, taskResults.following);
                    queryEndCursor = taskResults.queryEndCursor;
                }
                catch (error) {
                    reject(error);
                }

                if (!isExtraRequestBatchSet && i + 1 === batchRequestCount && following.length !== totalFollowingCount) {
                    let followingDelta = totalFollowingCount - following.length;
                    let extraRequestsCount = Math.ceil(followingDelta / followingBatchCount);
                    batchRequestCount += extraRequestsCount;
                    isExtraRequestBatchSet = true;
                }
            }

            resolve(following);
        });
    }
}