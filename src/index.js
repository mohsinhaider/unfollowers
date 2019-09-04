const request = require('request').defaults({ jar: true });

const COOKIES = [ 'sessionid=', 'mid=', 'ig_pr=1', 'ig_vw=1920', 'ig_cb=1', 'csrftoken=', 's_network=', 'ds_user_id=' ]
const HEADERS_BASE = {
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'en-US,en;q=0.8',
    'Connection': 'keep-alive',
    'Content-Length': 40,
    'Host': process.env.INSTAGRAM_URI_BASE_WWW,
    'Origin': process.env.INSTAGRAM_URI_BASE_HTTPS_WWW,
    'Referer': process.env.INSTAGRAM_URI_BASE_HTTPS_WWW,
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36',
    'X-Instagram-AJAX': '1',
    'X-Requested-With': 'XMLHttpRequest'
}

let jar = request.jar();

COOKIES.forEach(cookie => {
    jar.setCookie(cookie, process.env.INSTAGRAM_URI_BASE);
});

request.get({
    headers: HEADERS_BASE,
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

    const csrfTokenValue = cookieStringsArray[csrfTokenIndex].split('=')[1].slice(0, -1);

    const HEADERS_LOGIN= {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': process.env.INSTAGRAM_URI_BASE_WWW,
        'Origin': process.env.INSTAGRAM_URI_BASE_HTTPS_WWW,
        'Pragma': 'no-cache',
        'Referer': process.env.INSTAGRAM_URI_BASE_HTTPS_WWW,
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36',
        'X-CSRFToken': csrfTokenValue,
        'X-Instagram-AJAX': '1',
        'X-Requested-With': 'XMLHttpRequest'
    }

    request.post({
        headers: HEADERS_LOGIN,
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
    });
});