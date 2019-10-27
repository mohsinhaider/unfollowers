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
                        if (followingBatch.length === 0) {
                            throw new Error('Followers request yielded error response status code.');
                        }
                    }

                    // Expired sessionid or csrftoken; authentication issue in Cookie header
                    if (followingBatch.length === 0) {
                        throw new Error('Followers request yielded empty response collection.');
                    }

                    followingBatch.forEach(user => {
                        const followingUserPayload = {
                            fullName: user['node']['full_name'],
                            isVerified: user['node']['is_verified'],
                            profilePicUrl: user['node']['profile_pic_url'],
                            username: user['node']['username']
                        }
                        following.push(followingUserPayload);
                    });

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