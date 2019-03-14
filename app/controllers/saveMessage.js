const Message = require('./../models/Messages');


module.exports = {
    saveMessage : function(message) {
        let newMessage = new Message({
            userId : '123',
            message: 'test',
            createdAT: new Date()
        });
        newMessage.save();
    }
};