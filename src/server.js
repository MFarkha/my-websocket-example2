const cluster = require('cluster');
const { availableParallelism } = require('os');
const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter');

const http = require('http');
const { Server } = require('socket.io');

const api = require('./api');
const sockets = require('./sockets');

if (cluster.isPrimary) {
    const numCPUs = availableParallelism();
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork({
            PORT: 3000 + i
        })
    }
    return setupPrimary();
}
// const PORT = 3000 || process.env.PORT;

async function startServer() {
    const httpServer = http.createServer(api);
    const socketServer = new Server(httpServer, {
        connectionStateRecovery: {},
        adapter: createAdapter(),
    });
    const port = process.env.PORT;
    httpServer.listen(port, () => {
        console.log('Listening the port: ', port);
    })
    sockets.listen(socketServer);
}

startServer();