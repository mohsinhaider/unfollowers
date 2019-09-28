const request = require('request').defaults({ jar: true });
const Bot = require('../models/bot');

const { getCookieStringValue } = require('../helpers/login');
const { initialCsrfTokenHeaders, loginHeaders } = require('../helpers/headers');

module.exports = {
    login: async () => {
        return new Promise((resolve, reject) => {
            // TODO: Check bots collection under process.env.SERVER_INSTAGRAM_USER_USERNAME to see if csrftoken and sessionid exist
            // if we find existing auth info, then check if they've expired.
                // if not expired, resolve.
            // execute code blow if the tokens do not exist OR if they have expired.

            const csrfTokenKey = 'csrftoken';
            const sessionIdKey = 'sessionid';
            const userIdKey = 'ds_user_id';

            // Explicitly create a request Cookie jar for reuse throughout the request module calls
            let jar = request.jar();

            // Initial request to /web/__mid to get pre-login CSRF token
            request.get({
                headers: initialCsrfTokenHeaders,
                url: process.env.INSTAGRAM_URI_GET_CSRF_TOKEN,
                jar
            }, (error, response, body) => {
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
                }, (error, response, body) => {
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
                    
                    // TODO: use async/await
                    Bot.findOneAndUpdate({ userId: process.env.SERVER_INSTAGRAM_USER_ID }, {
                        userId: process.env.SERVER_INSTAGRAM_USER_ID,
                        username: process.env.SERVER_INSTAGRAM_USER_USERNAME,
                        sessionId: process.env.SERVER_SESSION_ID_VALUE,
                        csrfToken: process.env.SERVER_CSRF_TOKEN_VALUE
                    }, {
                        upsert: true, 
                        new: true
                    }, (error, document) => {
                        if (!error && document) {
                            console.log(`Bot \'${process.env.SERVER_INSTAGRAM_USER_USERNAME}\' had its document upserted successfully.`);
                            reject(error);
                        }
                    });

                    resolve(response);
                });
            });
        })
    }
}