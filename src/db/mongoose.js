const mongoose = require('mongoose');

const databaseUri = process.env.MONGODB_DEV_URI;

mongoose.connect(databaseUri, {
    useNewUrlParser: true,
    useCreateIndex: true
});