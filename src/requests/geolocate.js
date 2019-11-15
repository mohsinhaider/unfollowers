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
                    const responseObject = JSON.parse(response.body);
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