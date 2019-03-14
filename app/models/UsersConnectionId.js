var mongoose = require('mongoose');
const Schema  = mongoose.Schema;
var UserConnectionId = new Schema({
    userId: {
        type: String,
        require: true,
    },
    connectionId: {
        type: String,
        require: true,
        minlength: 1,
        trim: true
    },
    createdAt: {
        type: Number,
        default: null
    }
});

module.exports = mongoose.model('userconnectionids', UserConnectionId);