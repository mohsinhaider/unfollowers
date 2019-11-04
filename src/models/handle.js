const mongoose = require('mongoose');

const HandleSchema = new mongoose.Schema({
    handle: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const HandleModel = mongoose.model('Handle', HandleSchema);

module.exports = HandleModel;