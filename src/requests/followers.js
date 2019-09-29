const request = require('request');
const { userid } = require('./userid');

module.exports = {
    followers: (targetInstagramUsername, csrfToken, sessionId) => {
        return new Promise((resolve, reject) => {
            userid(targetInstagramUsername);

            const followersGraphqlQueryHash = 'c76146de99bb02f6415203be841dd25a';
            const followersVariables = {
                id: '19288260011',
                include_reel: true,
                fetch_mutual: true,
                first: 24
            }

            const followersRequestUrl = `https://www.instagram.com/graphql/query/?query_hash=${followersGraphqlQueryHash}&variables=${encodeURIComponent(JSON.stringify(followersVariables))}`;
            const sessionIdCookieKeyValuePair = 'sessionid=' + sessionId + ';';

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
                if (response.statusCode != 200 || error) {
                    // Request is malformed or Instagram could not respond successfully
                    return reject('Followers request completed unsuccessfully, response status code was not 200 or there was an error.')
                }

                const responseObject = JSON.parse(response.body);
                const followers = responseObject['data']['user']['edge_followed_by']['edges'];

                if (followers.length == 0) { // TODO: Consider case where user has 0 followers.
                    // Authentication issue in Cookie header
                    return reject('Followers request completed unsuccessfully, response status code was 200, but edges array is empty.');
                }

                return resolve(followers);
            });
        })
    }
}