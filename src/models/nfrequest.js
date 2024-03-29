const mongoose = require('mongoose');

const NonfollowerRequestSchema = new mongoose.Schema({
    handle: {
        type: String,
        required: true
    },
    originIp: {
        type: String,
        required: true
    },
    originLatitude: {
        type: Number
    },
    originLongitude: {
        type: Number
    }
}, {
    timestamps: true
});

const NonfollowerRequestModel = mongoose.model('NonfollowerRequest', NonfollowerRequestSchema);

module.exports = NonfollowerRequestModel;