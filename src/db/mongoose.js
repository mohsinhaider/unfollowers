const mongoose = require('mongoose');

const databaseUri = process.env.MONGODB_URI;

mongoose.connect(databaseUri, {
    useNewUrlParser: true,
    useCreateIndex: true
}).catch(error => {
    console.log('Could not connect to database');
    console.log(error);
});