const request = require('request');

module.exports = {
    userid: (username) => {
        return new Promise((resolve, reject) => {
            const instagramUserMetadataUriQueryString = '?__a=1';
            const instagramUserMetadataUri = process.env.INSTAGRAM_URI_BASE_HTTPS_WWW + '/' + username + '/' + instagramUserMetadataUriQueryString;

            request.get({
                url: instagramUserMetadataUri
            }, (error, response) => {
                if (response.statusCode === 404) {
                    return reject('Instagram user does not exist.');
                }

                if (error || response.statusCode != 200) {
                    return reject('Instagram user metadata endpoint could not respond with success.');
                }

                const responseObject = JSON.parse(response.body);
                return resolve(responseObject.graphql.user.id);
            })
        }) ;
    }
}