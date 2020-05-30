const request = require('request');

module.exports = {
    geolocate: (ipAddress) => {
        return new Promise((resolve, reject) => {
            const iplocateUri = 'https://www.iplocate.io/api/lookup/' + ipAddress;

            request.get({
                url: iplocateUri
            }, (error, response) => {
                if (!error) {
                    // Generic ipAddress will give a responseObject that has null values
                    let responseObject = null;
                    try {
                        responseObject = JSON.parse(response.body);
                    }
                    catch(error) {
                        console.log('[ERROR] There was an error parsing iplocate response: ' + error);
                        responseObject = {};
                    }
                    return resolve(responseObject);
                } else {
                    console.log('Error - request to iplocate failed');
                    console.log(`Error: ${error}`);
                    return reject();
                }
            });
        });
    }
}