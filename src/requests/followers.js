const request = require('request');
const { userid } = require('./userid');
const { FOLLOWERS_REQUEST_ERROR } = require('../constants/responses');

module.exports = {
    followers: (targetInstagramUsername, csrfToken, sessionId) => {
        return new Promise(async (resolve, reject) => {
            let instagramUserId;
            try {
                instagramUserId = await userid(targetInstagramUsername);
            }
            catch (error) {
                return reject(error);
            }

            // Setup query string and payload for Instagram followers request
            const followersGraphqlQueryHash = 'c76146de99bb02f6415203be841dd25a';
            const followersVariables = {
                id: instagramUserId,
                include_reel: true,
                fetch_mutual: true,
                first: 24
            }
            const followersRequestUrl = `https://www.instagram.com/graphql/query/?query_hash=${followersGraphqlQueryHash}&variables=${encodeURIComponent(JSON.stringify(followersVariables))}`;
            const sessionIdCookieKeyValuePair = 'sessionid=' + sessionId + ';';

            // Instagram user ID is guarentee to be stored in `instagramUserId` before this request is sent
            request.get({
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cookie': sessionIdCookieKeyValuePair,
                    'Connection': 'keep-alive',
                    'Host': process.env.INSTAGRAM_URI_BASE_WWW,
                    'Referer': `https://www.instagram.com/${process.env.SERVER_INSTAGRAM_USER_USERNAME}/followers/`,
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36',
                    'X-CSRFToken': csrfToken,
                    'X-IG-App-ID': '936619743392459',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                gzip: true,
                url: followersRequestUrl
            }, (error, response) => {
                // Breaking Instagram followers endpoint changes
                if (response.statusCode != 200 || error) {
                    return reject(FOLLOWERS_REQUEST_ERROR);
                }
                
                // Should be in try-catch if properties change
                const responseObject = JSON.parse(response.body);
                const followers = responseObject['data']['user']['edge_followed_by']['edges'];

                // Expired sessionid or csrftoken; authentication issue in Cookie header; user has 0 followers
                if (followers.length == 0) { // TODO: Fix 0 followers case
                    return reject(FOLLOWERS_REQUEST_ERROR);
                }

                return resolve(followers);
            });
        })
    }
}