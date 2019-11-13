const NonfollowerRequest = require('../models/nfrequest');

module.exports = {
    saveNonfollowerRequestInfo: async (req, res, next) => {
        const handle = req.body.metadata.username;
        const originIp = req.ip;
        const originLatitude = -33.0;
        const originLongitude = 44.5;

        try {
            const nonfollowerRequst = new NonfollowerRequest({ handle, originIp, originLatitude, originLongitude });
            await nonfollowerRequst.save();
        }
        catch (error) {
            console.log('Error when writing NonfollowerRequest info to database');
            console.log(`Error: ${error}`);
        }

        return next();
    }
}