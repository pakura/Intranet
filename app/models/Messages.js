var mongoose = require('mongoose');
const Schema  = mongoose.Schema;
var MessagesSchema = new Schema({
    roomId: {
        type: String,
        require: true
    },
    userId: {
        type: String,
        require: true,
    },
    message: {
        type: String,
        require: true,
        minlength: 1,
        trim: true
    },
    seen:[String],
    delete:[String],
    msgType: {
        type: String
    },
    createdAt: {
        type: Number,
        default: null
    }
});

module.exports = mongoose.model('message', MessagesSchema);