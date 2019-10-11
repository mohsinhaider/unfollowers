const request = require('request');
const { followersHeaders } = require('../constants/headers');
const { FOLLOWERS_REQUEST_ERROR } = require('../constants/responses');

module.exports = {
    followersRequestTask: async (requestUrl) => {
        return new Promise((resolve, reject) => {
            request.get({
                headers: followersHeaders,
                gzip: true,
                url: requestUrl
            }, (error, response) => {
                // Array to hold followers list
                let followers = [];

                // Breaking Instagram followers endpoint changes
                if (response.statusCode != 200 || error) {
                    return reject(FOLLOWERS_REQUEST_ERROR);
                }
                
                // TODO: Should be in try-catch if properties change
                const responseObject = JSON.parse(response.body);
                const followersBatch = responseObject['data']['user']['edge_followed_by']['edges'];

                // Expired sessionid or csrftoken; authentication issue in Cookie header; user has 0 followers
                if (followersBatch.length == 0) { // TODO: Fix 0 followers case
                    return reject(FOLLOWERS_REQUEST_ERROR);
                }

                // DEBUG -- TODO: Remove logging code after debug
                for (let j = 0; j < followersBatch.length; j++) {
                    followers.push(followersBatch[j]['node']['username']);
                    console.log(followersBatch[j]['node']['username']);
                }
                console.log('~~----~~~----~~~---~~~~-----~~~~~----~~~~~----')
                // END OF DEBUG

                // Update end cursor, to be used in next immediate request's query string to point cursor to next batch
                queryEndCursor = responseObject['data']['user']['edge_followed_by']['page_info']['end_cursor'];

                resolve({
                    followers,
                    queryEndCursor
                });
            });
        });
    }
}