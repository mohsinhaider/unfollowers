const request = require('request').defaults({ jar: true });
const Bot = require('../models/bot');

const { getCookieStringValue } = require('../helpers/login');
const { initialCsrfTokenHeaders, loginHeaders } = require('../helpers/headers');

module.exports = {
    login: async () => {
        return new Promise(async (resolve, reject) => {
            const responseSuccess = 'Sucessfully retrieved login secrets from storage or by logging in';
            
            try {
                const serverInstagramBot = await Bot.findOne({
                    username: process.env.SERVER_INSTAGRAM_USER_USERNAME
                });

                process.env.SERVER_INSTAGRAM_USER_ID = serverInstagramBot.userId;
                process.env.SERVER_SESSION_ID_VALUE = serverInstagramBot.sessionId;
                process.env.SERVER_CSRF_TOKEN_VALUE = serverInstagramBot.csrfToken;

                return resolve(responseSuccess);
            }
            catch (error) {
                console.log(`Bot ${process.env.SERVER_INSTAGRAM_USER_USERNAME} is missing login secrets, attempting to generate them now.`);
            }

            const csrfTokenKey = 'csrftoken';
            const sessionIdKey = 'sessionid';
            const userIdKey = 'ds_user_id';

            // Create a cookie jar to store cookies associated with requests
            let jar = request.jar();

            // Initial request to /web/__mid to get pre-login CSRF token
            request.get({
                headers: initialCsrfTokenHeaders,
                url: process.env.INSTAGRAM_URI_GET_CSRF_TOKEN,
                jar
            }, async (error, response, body) => {
                // Extract the cookie values that were populated in the request jar into an array
                let preLoginCsrfTokenCookieValue = getCookieStringValue(jar, process.env.INSTAGRAM_URI_GET_CSRF_TOKEN, csrfTokenKey);

                // Remove trailing semicolon that is added to the csrf token by Instagram
                preLoginCsrfTokenCookieValue = preLoginCsrfTokenCookieValue.slice(0, -1);

                // Add CSRF token required for login request to http headers
                loginHeaders['X-CSRFToken'] = preLoginCsrfTokenCookieValue;

                // Request to /accounts/login that gets login CSRF token value that is reusable across successive Instagram requests
                request.post({
                    headers: loginHeaders,
                    url: process.env.INSTAGRAM_URI_LOGIN,
                    followAllRedirects: true,
                    gzip: true,
                    form: {
                        'username': process.env.SERVER_INSTAGRAM_USER_USERNAME,
                        'password': process.env.SERVER_INSTAGRAM_USER_PASSWORD
                    },
                    jar
                }, async (error, response, body) => {
                    if (error) {
                        reject(error);
                    }

                    let loginCsrfTokenCookieValue = getCookieStringValue(jar, process.env.INSTAGRAM_URI_BASE_HTTPS_WWW, csrfTokenKey);
                    loginCsrfTokenCookieValue = loginCsrfTokenCookieValue.slice(0, -1);

                    let sessionIdCookieValue = getCookieStringValue(jar, process.env.INSTAGRAM_URI_BASE_HTTPS_WWW, sessionIdKey);
                    let userIdCookieValue = getCookieStringValue(jar, process.env.INSTAGRAM_URI_BASE_HTTPS_WWW, userIdKey);
                    userIdCookieValue = userIdCookieValue.slice(0, -1);

                    // Set an environment variable with the CSRF token retrieved at login time
                    process.env.SERVER_CSRF_TOKEN_VALUE = loginCsrfTokenCookieValue;
                    process.env.SERVER_INSTAGRAM_USER_ID = userIdCookieValue;
                    process.env.SERVER_SESSION_ID_VALUE = sessionIdCookieValue;
                    
                    try {
                        await Bot.findOneAndUpdate({ 
                            userId: process.env.SERVER_INSTAGRAM_USER_ID 
                        }, {
                            userId: process.env.SERVER_INSTAGRAM_USER_ID,
                            username: process.env.SERVER_INSTAGRAM_USER_USERNAME,
                            sessionId: process.env.SERVER_SESSION_ID_VALUE,
                            csrfToken: process.env.SERVER_CSRF_TOKEN_VALUE
                        }, {
                            upsert: true, 
                            new: true
                        });

                        console.log(`Bot \'${process.env.SERVER_INSTAGRAM_USER_USERNAME}\' had new login secrets generated and upserted successfully.`);
                    }
                    catch (error) {
                        return reject(error);
                    }

                    return resolve(responseSuccess);
                });
            });
        })
    }
}