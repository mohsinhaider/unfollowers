const request = require('request');

module.exports = {
    followers: (username) => {
        console.log(username);
        request.get({
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.8',
                'Connection': 'keep-alive',
                'Content-Length': 100,
                'Host': process.env.INSTAGRAM_URI_BASE_WWW,
                'Origin': process.env.INSTAGRAM_URI_BASE_HTTPS_WWW,
                'Referer': 'https://www.instagram.com/roxy.tillerson/followers/',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36',
                'X-CSRFToken': username,
                'X-IG-App-ID': '936619743392459',
                'X-Requested-With': 'XMLHttpRequest'
            },
            url: 'https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a' + '&variables=' + encodeURIComponent('{ id:19288260011, include_reel: true, fetch_mutual: true, first: 24 }')
        }, (error, response) => {
            console.log(response.body);
        });
    }
}