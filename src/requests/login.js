const request = require('request').defaults({ jar: true });

const { getCookieStringValue } = require('../helpers/login');
const { initialCsrfTokenHeaders, loginHeaders } = require('../headers/headers');

module.exports = {
    login: async (callback) => {
        const csrfTokenKey = 'csrftoken';

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
                let loginCsrfTokenCookieValue = getCookieStringValue(jar, process.env.INSTAGRAM_URI_BASE_HTTPS_WWW, csrfTokenKey);
                loginCsrfTokenCookieValue = loginCsrfTokenCookieValue.slice(0, -1);

                // Set an environment variable with the CSRF token retrieved at login time
                process.env.SERVER_CSRF_TOKEN_VALUE = loginCsrfTokenCookieValue;

                if (error) {
                    callback(error, null);
                }

                callback(null, response);
            });
        });
    }
}