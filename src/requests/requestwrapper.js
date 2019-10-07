const request = require('request');

module.exports = {
    requestWrapper: (requestTask) => {
        return new Promise(async (resolve, reject) => {
            await requestTask();
            resolve();
        });
    }
}