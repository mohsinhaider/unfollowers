const { login } = require('../requests/login');

module.exports = {
    botLogin: async (req, res, next) => {
        try {
            const accountNumber = Math.floor(Math.random() * 3) + 1;

            if (accountNumber === 1) { // strawsapp_avondale
                req.csrfTokenValue = process.env.INSTAGRAM_BOT_IG_CSRF_TOKEN_1;
                req.sessionId = process.env.INSTAGRAM_BOT_IG_SESSION_ID_1;
            } 
            else if (accountNumber === 2) { // strawsapp_bucktown
                req.csrfTokenValue = process.env.INSTAGRAM_BOT_IG_CSRF_TOKEN_2;
                req.sessionId = process.env.INSTAGRAM_BOT_IG_SESSION_ID_2;
            }
            else if (accountNumber == 3) { // strawsapp_douglas
                req.csrfTokenValue = process.env.INSTAGRAM_BOT_IG_CSRF_TOKEN_3;
                req.sessionId = process.env.INSTAGRAM_BOT_IG_SESSION_ID_3;
            }
            
            next();
        }
        catch (error) {
            console.log(`Login process failed. Error message: ${error}`);
        }
    }
}