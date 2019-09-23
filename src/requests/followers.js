const request = require('request');

module.exports = {
    followers: (username) => {
        const followersGraphqlQueryHash = 'c76146de99bb02f6415203be841dd25a';
        const followersVariables = {
            id: '19288260011',
            include_reel: true,
            fetch_mutual: true,
            first: 24
        }

        const followersRequestUrl = `https://www.instagram.com/graphql/query/?query_hash=${followersGraphqlQueryHash}&variables=${encodeURIComponent(JSON.stringify(followersVariables))}`;

        request.get({
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                // Cookie below is for Debug, figure out how to get 'sessionid', probably just have to pass cookie jar here.
                'Cookie': `rur=PRN; mid=XYgftwAEAAHE3ymbOB2HlsZOfchQ; shbid=1866; shbts=1569202116.8307796; csrftoken=92Zjf6ocrF5evMWaRtVvCMqJrOx2na4n; ds_user_id=19288260011; sessionid=19288260011%3APhjZnUqhAZcwPr%3A19;`,
                'Connection': 'keep-alive',
                'Host': process.env.INSTAGRAM_URI_BASE_WWW,
                'Referer': 'https://www.instagram.com/roxy.tillerson/followers/',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36',
                'X-CSRFToken': username,
                'X-IG-App-ID': '936619743392459',
                'X-Requested-With': 'XMLHttpRequest'
            },
            gzip: true,
            url: followersRequestUrl
        }, (error, response) => {
            console.log(response.body);
        });
    }
}