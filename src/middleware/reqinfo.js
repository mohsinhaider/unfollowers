const NonfollowerRequest = require('../models/nfrequest');
const { geolocate } = require('../requests/geolocate');

module.exports = {
    saveNonfollowerRequestInfo: async (req, res, next) => {
        const handle = req.body.metadata.username;
        const originIp = req.ip;
        let originLatitude = originLongitude = null;

        try {
            let geolocateResponse = await geolocate(originIp);
            originLatitude = geolocateResponse.latitude;
            originLongitude = geolocateResponse.longitude;
        }
        catch (error) {
            console.log('Error occured when geolocation user');
            console.log(`Error: ${error}`);
        }

        try {
            let nonfollowerRequest;

            if (originLatitude === null || originLongitude === null) {
                nonfollowerRequest = new NonfollowerRequest({ handle, originIp });
            }
            else {
                nonfollowerRequest = new NonfollowerRequest({ handle, origin, originLatitude, originLongitude });
            }

            await nonfollowerRequest.save();
        }
        catch (error) {
            console.log('Error when writing NonfollowerRequest info to database');
            console.log(`Error: ${error}`);
        }

        return next();
    }
}