const app = require('./app');
const { login } = require('./requests/login');

const port = process.env.PORT || 3000;

// Log in the server to Instagram immediately, then start the API server
login((error, response) => {
    if (error) {
        throw new Error('Server could not log into Instagram, exiting abruptly.')
    }
    console.log('Login was successful');

    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});