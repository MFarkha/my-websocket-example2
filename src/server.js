const http = require('http');
const { Server } = require('socket.io');

const api = require('./api');
const sockets = require('./sockets');

const PORT = 3000 || process.env.PORT;

async function startServer() {
    const httpServer = http.createServer(api);
    const socketServer = new Server(httpServer, {
        connectionStateRecovery: {}
    });
    httpServer.listen(PORT, () => {
        console.log('Listening the port: ', PORT);
    })
    sockets.listen(socketServer);
}

startServer();