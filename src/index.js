const app = require('./app');
const { login } = require('./requests/login');

const port = process.env.PORT || 3000;

// Log in the server to Instagram immediately, then start the API server
login()
    .then((response) => {
        console.log('Log in succeeded');

        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    })
    .catch((error) => {
        // API server will not start, node process exits gracefully
        console.log('Log in failed');
        console.log('Log in request error: ' + error);
    });