const mongoose = require('mongoose');

const databaseUri = process.env.MONGODB_DEV_URI;

// TODO: Add callback to handle error case
mongoose.connect(databaseUri, {
    useNewUrlParser: true,
    useCreateIndex: true
});