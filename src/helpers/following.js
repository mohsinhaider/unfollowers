const request = require('request');
const { followingHeaders } = require('../constants/headers');
const { FOLLOWING_REQUEST_ERROR } = require('../constants/responses');

module.exports = {
    followingRequestTask: async (requestUrl) => {
        return new Promise((resolve, reject) => {
            request.get({
                headers: followingHeaders,
                gzip: true,
                url: requestUrl
            }, (error, response) => {
                // Array to hold followers list
                let following = [];
                let queryEndCursor = '';
                
                try {
                    const responseObject = JSON.parse(response.body);
                    const followingBatch = responseObject['data']['user']['edge_follow']['edges'];

                    // Breaking Instagram followers endpoint changes
                    if (response.statusCode != 200 || error) {
                        if (followingBatch.length == 0) {
                            throw new Error('Followers request yielded error response status code.');
                        }
                    }

                    // Expired sessionid or csrftoken; authentication issue in Cookie header
                    // 'user has 0 followers' case is not an issue in requests/followers.js
                    if (followingBatch.length == 0) {
                        throw new Error('Followers request yielded empty response collection.');
                    }

                    followingBatch.forEach(user => {
                        following.push(user['node']['username']);
                    })

                    // Update end cursor, to be used in next immediate request's query string to point cursor to next batch
                    queryEndCursor = responseObject['data']['user']['edge_follow']['page_info']['end_cursor'];
                }
                catch (error) {
                    // 400, 500 response code; empty followers response array; response layout changed 
                    return reject(FOLLOWING_REQUEST_ERROR);
                }

                resolve({
                    following,
                    queryEndCursor
                });
            });
        });
    }
}