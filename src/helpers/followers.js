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
                let queryEndCursor = '';
                
                try {
                    // Breaking Instagram followers endpoint changes
                    if (response.statusCode != 200 || error) {
                        if (followersBatch.length === 0) {
                            throw new Error('Followers request yielded error response status code.');
                        }
                    }

                    const responseObject = JSON.parse(response.body);
                    const followersBatch = responseObject['data']['user']['edge_followed_by']['edges'];

                    // Expired sessionid or csrftoken; authentication issue in Cookie header
                    // 'user has 0 followers' case is not an issue in requests/followers.js
                    if (followersBatch.length === 0) {
                        throw new Error('Followers request yielded empty response collection.');
                    }

                    followersBatch.forEach(user => {
                        const followerUserPayload = {
                            username: user['node']['username'],
                            profilePicUrl: user['node']['profile_pic_url']
                        }
                        followers.push(followerUserPayload);
                    });

                    // Update end cursor, to be used in next immediate request's query string to point cursor to next batch
                    queryEndCursor = responseObject['data']['user']['edge_followed_by']['page_info']['end_cursor'];
                }
                catch (error) {
                    // 400, 500 response code; empty followers response array; response layout changed 
                    return reject(FOLLOWERS_REQUEST_ERROR);
                }

                resolve({
                    followers,
                    queryEndCursor
                });
            });
        });
    }
}