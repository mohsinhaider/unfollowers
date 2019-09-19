const request = require('request').defaults({ jar: true });
const { initialCsrfTokenHeaders, loginHeaders } = require('../headers/headers');
const { follow } = require('./follow');

module.exports = {
    login: async (callback) => {
        let jar = request.jar();

        request.get({
            headers: initialCsrfTokenHeaders,
            url: process.env.INSTAGRAM_URI_GET_CSRF_TOKEN,
            jar
        }, (error, response, body) => {
            const cookieStringsArray = jar.getCookieString(process.env.INSTAGRAM_URI_GET_CSRF_TOKEN).split(' ');
            let csrfTokenIndex = 0;
            
            for (let i = 0; i < cookieStringsArray.length; i++) {
                if (cookieStringsArray[i].includes('csrftoken')) {
                    csrfTokenIndex = i;
                }    
            }

            // Add CSRF token required for login request to http headers
            loginHeaders['X-CSRFToken'] = cookieStringsArray[csrfTokenIndex].split('=')[1].slice(0, -1);

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

                let cookieStringsArray2 = jar.getCookieString(process.env.INSTAGRAM_URI_BASE_HTTPS_WWW).split(' ')

                let csrfTokenIndex2 = 0;
                for (let i = 0; i < cookieStringsArray2.length; i++) {
                    if (cookieStringsArray2[i].includes('csrftoken')) {
                        csrfTokenIndex2 = i;
                    }    
                }

                // As long as the new csrf token is fetched, requests will continue to stay authenticated.
                const csrfTokenValue2 = cookieStringsArray2[csrfTokenIndex2].split('=')[1].slice(0, -1);
                process.env.SERVER_CSRF_TOKEN_VALUE = csrfTokenValue2;
                
                // TODO: send in error and response in below call to callback()
                // callback();

                follow('8542252', csrfTokenValue2, jar);
            });
        });
    }
}