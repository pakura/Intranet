require('./config/env');

const http = require('http');
const express = require('express');
const mongoose = require('./app/inc/mango_connect');
const socketIO = require('socket.io');
const path = require('path');
const publicPath = path.join(__dirname, './public');
const socketController = require('./app/controllers/socket');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

socketController(io);

server.listen(process.env.PORT || 3000, '0.0.0.0',() => {
    console.log(`Server is up on ${process.env.PORT || 3000}`);
});