const mongoose = require('mongoose');

const BotSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    sessionId: {
        type: String,
        required: true
        // TODO: add validate for this to check first part if userId
    },
    csrfToken: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const BotModel = mongoose.model('Bot', BotSchema);

module.exports = BotModel;