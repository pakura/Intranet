const mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ChatroomsSchema = new Schema({
    members: [String],
    createdAt: {
        type: Number,
        default: null
    }
});


module.exports = mongoose.model('chatrooms', ChatroomsSchema);