const Chatrooms = require('../models/Chatrooms');
const Messages = require('../models/Messages');
const UserConnectionId = require('../models/UsersConnectionId');
const userInfo = require('./userInfo');
const request = require('request');
const fs = require('fs');

module.exports = {


    getUserActiveRooms: (user) => {
        return Chatrooms.find({members: {'$in': [user.toString()]}}).sort([['createdAt', 1]]).then((data) => {
            var msg = [];
            for (let member of data){
                msg.push(userInfo.get(member));
            }
            return Promise.all(msg).then(function(values) {
                return values;
            });
        }).catch((err) => {
            return [];
        });
    },


    registerOrFindRoom: (data) => {
        var members = [data.userId.toString()];
        members = members.concat(data.oponentId);
        return Chatrooms.findOne({members: members}).then((res) => {
            if(!res){
                return new Promise(function(resolve, reject) {
                    var newRoom = new Chatrooms({
                        members: members,
                        status: 1
                    }).save().then((newRoom)=>{
                        var msg = [];
                        msg.push(userInfo.get(newRoom));
                        return Promise.all(msg).then(function(values) {
                            return values;
                        });
                    });
                    resolve(newRoom);
                });
            }
            var msg = [];
            msg.push(userInfo.get(res));
            return Promise.all(msg).then(function(values) {
                return values;
            });
        }).catch((err) => {
            return [];
        });
    },


    getRoomHistory: (data) => {
        return Messages.find({
                roomId: data.roomId.toString(),
                delete: {'$nin': [data.userId.toString()]}
            }).sort({createdAt: -1}).limit(30).skip(data.skip).then((res)=>{
                var chat = [];
                res = res.reverse();
                for(ii in res){
                    chat.push({
                        id: res[ii]._id,
                        roomId: res[ii].roomId,
                        userId: res[ii].userId,
                        createdAt: res[ii].createdAt,
                        message: res[ii].message,
                        msgType: res[ii].msgType,
                        seen: res[ii].seen,
                        delete: res[ii].delete
                    });
                }
                return chat;
        }).catch((err) => {
            return [];
        });
    },

    saveMessage: (data) => {
        if(data.msgType == 'image'){
            var base64Data = data.message.replace(/^data:image\/png;base64,/, "").replace(/^data:image\/jpeg;base64,/, "");
            if (!fs.existsSync("public/uploads/"+data.roomId)){
                fs.mkdirSync("public/uploads/"+data.roomId);
            }
            var imgUrl = "public/uploads/"+data.roomId+"/"+(new Date().getTime())+".png";
            fs.writeFileSync(imgUrl, base64Data, 'base64');
            var message = imgUrl.replace('public/', '');
        } else {
            var message = data.message;
        }
        return new Messages({
            roomId: data.roomId,
            userId: data.userId,
            message: message,
            seen: [],
            delete: [],
            msgType: data.msgType,
            createdAt: new Date()
        }).save().then((res)=>{
             Chatrooms.findById(res.roomId).then((room)=>{
                 room.createdAt = new Date();
                 Chatrooms.findByIdAndUpdate(res.roomId, room).then();
            });
            return res;
        });
    },

    deleteMessages: (data) => {
        return Messages.find({
            roomId: data.roomId
        }).then((res)=>{
            for (let message of res){
                if(message.delete.indexOf(data.userId) == -1){
                    message.delete.push(data.userId);
                    Messages.findByIdAndUpdate(message._id, message).then();
                }
            }
        }).catch((err) => {
            return [];
        });
    },

    makeMessageSeen: (data) => {
        return Messages.findById(data.messageId).then((res)=>{
            if(res){
                if(res.seen.indexOf(data.userId) == -1){
                    res.seen.push(data.userId);
                    Messages.findByIdAndUpdate(res._id, res).then();
                    return res;
                } else {
                    return res;
                }
            } else {
                return null;
            }
        }).catch((err) => {
            return null;
        });
    },


    addOponent: (data) => {
         return Chatrooms.findById(data.roomId).then((res)=>{
            if(res.members.length>2){
                for(let opopnent of data.oponentId){
                    if(res.members.indexOf(opopnent.toString()) == -1){
                        res.members.push(opopnent.toString());
                    }
                }

                return Chatrooms.findByIdAndUpdate(res._id, res).then((res)=>{
                    return new Promise(function(resolve, reject) {
                        var returnRoom = Chatrooms.findById(res._id).then((newRoom)=>{
                            var msg = [];
                            msg.push(userInfo.get(newRoom));
                            return Promise.all(msg).then(function(values) {
                                return values;
                            });
                        });
                        resolve(returnRoom);
                    });
                });
            } else {
                var members = res.members;
                for(let opopnent of data.oponentId){
                    if(members.indexOf(opopnent.toString()) == -1){
                        members.push(opopnent.toString());
                    }
                }
                return new Promise(function(resolve, reject) {
                    var newRoom = new Chatrooms({
                        members: members,
                    }).save().then((newRoom)=>{
                        var msg = [];
                        msg.push(userInfo.get(newRoom));
                        return Promise.all(msg).then(function(values) {
                            return values;
                        });
                    });
                    resolve(newRoom);
                });
            }
        });
        return null;
    },


    leaveRoom: (data) => {
        return Chatrooms.findById(data.roomId).then((res)=>{
            if(res.members.indexOf(data.userId.toString())>-1)
                res.members.splice(res.members.indexOf(data.userId.toString()), 1);
            return Chatrooms.findByIdAndUpdate(res._id, res).then((res)=>{
                return new Promise(function(resolve, reject) {
                    var returnRoom = Chatrooms.findById(res._id).then((newRoom)=>{
                        var msg = [];
                        msg.push(userInfo.get(newRoom));
                        return Promise.all(msg).then(function(values) {
                            return values;
                        });
                    });
                    resolve(returnRoom);
                });
            });
        });
    },

    openRoom: (data) => {
        return Chatrooms.findById(data.roomId).then((res)=>{
            return new Promise(function(resolve, reject) {
                var returnRoom = Chatrooms.findById(res._id).then((newRoom)=>{
                    var msg = [];
                    msg.push(userInfo.get(newRoom));
                    return Promise.all(msg).then(function(values) {
                        return values;
                    });
                });
                resolve(returnRoom);
            });
        });
    },

    updateUserConnectionId: (data, connection) => {
        var connectionId = UserConnectionId.findOne({
            userId: data.userId
        }).then((res)=>{
            $dat = {
                userId: data.userId,
                connectionId: connection,
                createdAt: new Date()
            };
            if(!res){
                var conn = new UserConnectionId($dat).save().then();
            } else {
                UserConnectionId.findByIdAndUpdate(res.id, $dat).then();
            }
        }).catch((err) => {
            return [];
        });
    },

    joinNewOponents: (data) => {
        for(let member of data.members){
            UserConnectionId.findOne({
                userId: member.id
            }).then((res)=>{
                socket.join()
            });
        }
    },


    sendPushNotification: (data, io) => {
        Chatrooms.findById(data.roomId).then((res)=>{
            for(let member of res.members){
                UserConnectionId.findOne({userId: member}).then((connection) => {
                    if(connection){
                        var socketList = io.sockets.server.eio.clients;
                        if (socketList[connection.connectionId] === undefined){
                            //TODO send push
                            var url = process.env.CORE_URL+"messagenotification?oponentId="+connection.userId+
                                "&userId="+data.userId+"&message="+data.message+"&msgType="+data.msgType;
                            new Promise(function (resolve, reject) {
                                request({
                                    url: url,
                                    json: true
                                }, (error, response, body) => {
                                    if(error){
                                        reject(error)
                                    } else {
                                        resolve(body);
                                    }
                                });
                            });
                        }
                    }
                });
            }
        });
    }
};
