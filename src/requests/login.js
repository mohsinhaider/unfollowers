const request = require('request').defaults({ jar: true });

const { follow } = require('./follow');
const { getCookieStringValue } = require('../helpers/login');
const { initialCsrfTokenHeaders, loginHeaders } = require('../headers/headers');

module.exports = {
    login: async (callback) => {
        // Explicitly create a request Cookie jar for reuse throughout the request module calls
        let jar = request.jar();

        // Initial request to /web/__mid to get pre-login CSRF token
        request.get({
            headers: initialCsrfTokenHeaders,
            url: process.env.INSTAGRAM_URI_GET_CSRF_TOKEN,
            jar
        }, (error, response, body) => {
            // Extract the cookie values that were populated in the request jar into an array
            let csrfTokenCookieValue = getCookieStringValue(jar, process.env.INSTAGRAM_URI_GET_CSRF_TOKEN, 'csrftoken');

            // Remove trailing semicolon that is added to the csrf token by Instagram
            csrfTokenCookieValue = csrfTokenCookieValue.slice(0, -1);

            // Add CSRF token required for login request to http headers
            loginHeaders['X-CSRFToken'] = csrfTokenCookieValue;

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
                console.log(response.body);

                let loginCookieStringsArray = jar.getCookieString(process.env.INSTAGRAM_URI_BASE_HTTPS_WWW).split(' ')

                // TODO: Fix code duplication by introducing helper method
                let loginCsrfTokenIndex = 0;
                for (let i = 0; i < loginCookieStringsArray.length; i++) {
                    if (loginCookieStringsArray[i].includes('csrftoken')) {
                        loginCsrfTokenIndex = i;
                    }    
                }

                // Set an environment variable with the CSRF token retrieved at login time
                process.env.SERVER_CSRF_TOKEN_VALUE = loginCookieStringsArray[loginCsrfTokenIndex].split('=')[1].slice(0, -1);
                
                // TODO: send in error and response in below call to callback()
                // callback();

                follow('8542252', process.env.SERVER_CSRF_TOKEN_VALUE, jar);
            });
        });
    }
}