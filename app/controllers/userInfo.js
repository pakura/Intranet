const request = require('request');

var userInfo = (data) => {
    return new Promise(function(resolve, reject) {
        var msg = [];
        for (let member of data.members){
            msg.push(requestForUser(member))
        }
        Promise.all(msg).then(res =>{
            resolve({
                roomId: data._id,
                createdAt: data.createdAt,
                members : res
            });
        });

    });
};

var requestForUser = (userId)=>{
    return new Promise(function (resolve, reject) {
        request({
            url: process.env.CORE_URL+"getUserInfo/"+userId,
            json: true
        }, (error, response, body) => {
            if(error){
                reject(error)
            } else {
                console.log('userId ', userId);
                resolve(body);
            }
        });
    });

}

module.exports.get = userInfo;