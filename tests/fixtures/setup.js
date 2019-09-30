/**
 * @file setup.js 
 * Sets up a login() call, used before requests tests are executed.
 *
 * @author Mohsin Haider
 */

const { login } = require('../../src/requests/login');

const setup = async () => { 
    return new Promise(async (resolve, reject) => {
        try {
            await login();
            resolve();
        }
        catch (error) {
            reject();
        }
    });
}

module.exports = setup;