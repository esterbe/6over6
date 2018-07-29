const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = module.exports.io = require('socket.io')(server);


const PORT = process.env.PORT || 3231;
const SocketManager = require("./socketManager");

io.on('connection', SocketManager);
server.listen(PORT, () => console.log(`Listening on port ${PORT}`))