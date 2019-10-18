axios({
    method: 'get',
    url: '/api/nonfollower/follower',
    params: {
        username: 'roxy.tillerson'
    }
}).then((response) => {
    console.log(response.data);
}).catch((error) => {
    console.log(error);
});