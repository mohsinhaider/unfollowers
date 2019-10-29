const { login } = require('../requests/login');

module.exports = {
    botLogin: async (req, res, next) => {
        try {
            await login();
            next();
        }
        catch (error) {
            console.log(`Login process failed. Error message: ${error}`);
        }
    }
}