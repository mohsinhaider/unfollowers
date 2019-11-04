const { login } = require('../requests/login');

module.exports = {
    botLogin: async (req, res, next) => {
        try {
            const serviceAccountHandles = ['charlottebrandstatter', 'sloohbru6', 'itsbentleybo'];

            let accountNumber = null;
            // console.log(global.serviceAccountsInUse);
            do {
                console.log('Trying....');
                accountNumber = Math.floor(Math.random() * 3) + 1;
            }
            while (global.serviceAccountsInUse.includes(serviceAccountHandles[accountNumber - 1]))

            global.counter += 1;
            // console.log(`${global.counter} ${serviceAccountHandles[accountNumber - 1]}`);
            global.serviceAccountsInUse.push(serviceAccountHandles[accountNumber - 1]);

            if (accountNumber === 1) {
                req.serviceAccountHandle = 'charlottebrandstatter';
                req.csrfTokenValue = process.env.INSTAGRAM_BOT_IG_CSRF_TOKEN_1;
                req.sessionId = process.env.INSTAGRAM_BOT_IG_SESSION_ID_1;
            } 
            else if (accountNumber === 2) {
                req.serviceAccountHandle = 'sloohbru6';
                req.csrfTokenValue = process.env.INSTAGRAM_BOT_IG_CSRF_TOKEN_2;
                req.sessionId = process.env.INSTAGRAM_BOT_IG_SESSION_ID_2;
            }
            else if (accountNumber == 3) {
                req.serviceAccountHandle = 'itsbentleybo';
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