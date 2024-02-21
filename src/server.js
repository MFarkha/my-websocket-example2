const http = require('http');
const api = require('./api');
const { Server } = require('socket.io');
const sockets = require('./sockets');

const PORT = 3000 || process.env.PORT;
const httpServer = http.createServer(api);
const socketServer = new Server(httpServer);
    
httpServer.listen(PORT, () => {
    console.log('Listening the port: ', PORT);
})

sockets.listen(socketServer);
