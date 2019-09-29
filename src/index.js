const app = require('./app');
const { login } = require('./requests/login');

const port = process.env.PORT || 3000;

// Log in the server to Instagram immediately, then start the API server
login()
    .then((response) => {
        console.log(response);
        console.log('Login process succeeded.');

        app.listen(port, () => {
            console.log(`Server listening on port ${port}`);
        });
    })
    .catch((error) => {
        // API server will not start, node process exits gracefully
        console.log('Login process failed');
        console.log('Error during login process: ' + error);
    });