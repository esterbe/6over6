const io = require('./index').io;
const Events = require('../src/events');
const Clients = require('../src/clients');


let connectedClients = {};
module.exports = function(socket) {

    //save connected clients
    socket.on(Events.CLIENT_CONNECTED, (clientType) => {
        connectedClients[clientType.name] = socket.id;
        console.log("Socket Id: " + socket.id);
        console.log("Client type: " + clientType.name);
    });

    //notify receiver when upload starts
    socket.on(Events.UPLOAD_STARTED, (data) => {
        console.log("UPLOAD_STARTED");
        let receiverSocketId = connectedClients[Clients.RECEIVER];
        io.to(receiverSocketId).emit(Events.UPLOAD_STARTED, data);
    });
}