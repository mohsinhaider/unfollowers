module.exports = {
    botLogin: async (req, res, next) => {
        try {
            let assignmentAttempts = 0;
            let accountNumber = null;
            do {
                assignmentAttempts++;
                accountNumber = Math.floor(Math.random() * 3) + 1;
            }
            while (global.serviceAccountsInUse.includes(global.serviceAccountHandles[accountNumber - 1])
                    && assignmentAttempts < 100)
            
            if (assignmentAttempts === 100) {
                return res.status(200).send({ error: 'Oops! We\'re busy. Can you try again in a few seconds?' }); 
            }

            const requestedUser = req.body.metadata.username;
            const assignedServiceAccount = global.serviceAccountHandles[accountNumber - 1];
            console.log(`[Info] Assigned \'${requestedUser}\' to \'${assignedServiceAccount}\' service account`);

            global.counter += 1;
            global.serviceAccountsInUse.push(global.serviceAccountHandles[accountNumber - 1]);
            // console.log(`${global.counter} ${global.serviceAccountHandles[accountNumber - 1]}`);

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