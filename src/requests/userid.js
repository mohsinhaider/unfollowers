const request = require('request');

module.exports = {
    userid: (username) => {
        // TODO: validate username
        const instagramUserMetadataUriQueryString = '?__a=1';
        const instagramUserMetadataUri = process.env.INSTAGRAM_URI_BASE_HTTPS_WWW + '/' + username + '/' + instagramUserMetadataUriQueryString;
    }
}