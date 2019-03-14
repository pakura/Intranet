const usersRoom = require('./usersRooms');

module.exports = function (io) {
    io.on('connection', function (socket) {

        socket.on('goOnline', (data) => {
            usersRoom.getUserActiveRooms(data.userId).then((rooms) => {
                for(let room of rooms){
                    socket.join(room.roomId);
                }
            });
            usersRoom.updateUserConnectionId(data, socket.id);
            usersRoom.getUserActiveRooms(data.userId).then((rooms) => {
                socket.emit('goOnline', rooms);
            });
        });

        socket.on('activeRooms', (data) => {
            usersRoom.getUserActiveRooms(data.userId).then((rooms) => {
                socket.emit('activeRooms', rooms);
            });
        });

        socket.on('registerRoom', (data) => {
            usersRoom.registerOrFindRoom(data).then((room) => {
                socket.join(data.roomId);
                socket.emit('registerRoom', room);
            });
        });

        socket.on('roomHistory', (data) => {
            usersRoom.getRoomHistory(data).then((messages) => {
                if(data.skip > 0){
                    socket.emit('roomOldHistory', messages);
                } else {
                    socket.emit('roomHistory', messages);
                }
            });
        });

        socket.on('openRoom', (data) => {
            socket.join(data.roomId);
            usersRoom.openRoom(data).then((room) => {
                socket.join(data.roomId);
                socket.emit('openRoom', room);
            });
        });

        socket.on('createMessage', (data) => {
            usersRoom.saveMessage(data).then((res)=>{
                socket.join(res.roomId);
                io.to(res.roomId).emit('newMessage', res);
                // usersRoom.sendPushNotification(res, io);
            });
        });


        socket.on('addOponent', (data) => {
            usersRoom.addOponent(data).then((room)=>{
                usersRoom.joinNewOponents(room).then((room)=>{

                });
                io.to(data.roomId).emit('registerRoom', room);
            });
        });

        socket.on('leaveRoom', (data) => {
            usersRoom.leaveRoom(data).then((room)=>{
                socket.leave(room.roomId).then(function () {
                    io.to(data.roomId).emit('registerRoom', room);
                });
            });
        });


        socket.on('makeSeen', (data) => {
            usersRoom.makeMessageSeen(data).then((res) => {
                if(res && res.hasOwnProperty('roomId')){
                    io.to(res.roomId).emit('seen',res);
                }
            });
        });

        socket.on('isTyping', (data) => {
            io.to(res.roomId).emit('isTyping',data);
        });



        socket.on('deleteMessages', (data) => {
            usersRoom.deleteMessages(data);
            socket.emit('roomDeleted', {roomId: data.roomId});
        });




        socket.on('error', ()=>{
            console.log('error');
        });
    });

};