module.exports = {
    botLogin: async (req, res, next) => {
        try {
            const serviceAccountHandles = ['charlottebrandstatter', 'sloohbru6', 'itsbentleybo'];
            // console.log(global.serviceAccountsInUse);
            
            let assignmentAttempts = 0;
            let accountNumber = null;
            do {
                assignmentAttempts++;
                accountNumber = Math.floor(Math.random() * 4) + 1;
            }
            while (global.serviceAccountsInUse.includes(serviceAccountHandles[accountNumber - 1])
                    && assignmentAttempts < 100)
            
            if (assignmentAttempts === 100) {
                return res.status(200).send({ error: 'Oops! We\'re busy. Can you try again in a few seconds?' }); 
            }

            const requestedUser = req.body.metadata.username;
            const assignedServiceAccount = serviceAccountHandles[accountNumber - 1];
            console.log(`[Info] Assigned \'${requestedUser}\' to \'${assignedServiceAccount}\' service account`);

            global.counter += 1;
            global.serviceAccountsInUse.push(serviceAccountHandles[accountNumber - 1]);
            // console.log(`${global.counter} ${serviceAccountHandles[accountNumber - 1]}`);

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
            else if (accountNumber == 4) {
                req.serviceAccountHandle = 'dobeen.mike';
                req.csrfTokenValue = process.env.INSTAGRAM_BOT_IG_CSRF_TOKEN_4;
                req.sessionId = process.env.INSTAGRAM_BOT_IG_SESSION_ID_4;
            }
            
            next();
        }
        catch (error) {
            console.log(`Login process failed. Error message: ${error}`);
        }
    }
}