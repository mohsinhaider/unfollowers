const request = require('request');
const { USERID_REQUEST_ERROR, USERID_REQUEST_ERROR_LOGIC, USERID_REQUEST_ERROR_404, USERID_REQUEST_ERROR_PRIVATE_USER } 
    = require('../constants/responses');

module.exports = {
    metadata: (username) => {
        return new Promise((resolve, reject) => {
            // User metadata URL format: 'https://www.instagram.com/{username}/?__a=1'
            const instagramUserMetadataUriQueryString = '?__a=1';
            const instagramUserMetadataUri = process.env.INSTAGRAM_URI_BASE_HTTPS_WWW + '/' + username + '/' + instagramUserMetadataUriQueryString;

            request.get({
                url: instagramUserMetadataUri
            }, (error, response) => {
                if (response === undefined) {
                    return reject(USERID_REQUEST_ERROR_404);
                }

                // User does not exist or metadata endpoint has been removed/changed
                if (response.statusCode === 404) {
                    return reject(USERID_REQUEST_ERROR_404);
                }
                
                // Request did not yield the expected response
                if (error || response.statusCode != 200) {
                    return reject(USERID_REQUEST_ERROR);
                }

                let instagramUserId, isPrivate, responseObject, didMetadataParseSucceed;
                
                for (let i = 0; i < 2; i++) {
                    try {
                        responseObject = JSON.parse(response.body);
                        didMetadataParseSucceed = true;
                        break;
                    }
                    catch(error) {
                        console.log('[ERROR] There was an error parsing metada response: ' + error);
                        didMetadataParseSucceed = false;
                    }
                }

                if (!didMetadataParseSucceed) {
                    return reject(USERID_REQUEST_ERROR_LOGIC);
                }

                try {
                    instagramUserId = responseObject.graphql.user.id
                    isPrivate = responseObject.graphql.user.is_private;
                    if (isPrivate) {
                        return reject(USERID_REQUEST_ERROR_PRIVATE_USER);
                    }
                }
                catch (error) {
                    // Object structure is not as expected; may have changed
                    return reject(USERID_REQUEST_ERROR_LOGIC);
                }

                return resolve(responseObject.graphql.user);
            })
        }) ;
    }
}