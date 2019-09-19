module.exports = {
    followHeaders: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'Connection': 'keep-alive',
        'Content-Length': 0,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Host': process.env.INSTAGRAM_URI_BASE_WWW,
        'Origin': process.env.INSTAGRAM_URI_BASE_HTTPS_WWW,
        'Referer': process.env.INSTAGRAM_URI_BASE_HTTPS_WWW,
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36',
        'X-IG-App-ID': '936619743392459',
        'X-Instagram-AJAX': '6c66f7292327-hot',
        'X-Requested-With': 'XMLHttpRequest'
    },
    initialCsrfTokenHeaders: {
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
}