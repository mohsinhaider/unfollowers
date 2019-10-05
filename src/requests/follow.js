const request = require('request');
const { followHeaders } = require('../constants/headers');

module.exports = {
    // Example usage in index.js: follow('1369572015', HEADERS_FOLLOW, jar);
    follow: (instagramAccountId, csrfToken, cookieJar) => {
        followHeaders['X-CSRFToken'] = csrfToken;
        
        request.post({
            headers: followHeaders,
            url: `https://www.instagram.com/web/friendships/${instagramAccountId}/follow/`, // didn't need gzip or redirect options for /follow
            jar: cookieJar
        }, (error, response, body) => {
            console.log(body);
        });
    }
}