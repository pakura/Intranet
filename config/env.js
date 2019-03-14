var env = process.env.NODE_ENV || 'development';
if(env === 'development' || env === 'production'){
    var ENV = require('./../env.json');
    var envConfig = ENV[env];
    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    })
}