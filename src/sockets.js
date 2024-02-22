const db = require('./db');

async function listen(io) {
    await db.initDB();

    io.on('connection', async (socket) => {
        console.log(`The user ${socket.id} has connected`);
        socket.on('chatMessage', async (message, clientOffset, callback) => {
            const result = await db.addMessage(message, clientOffset, callback);
            console.log(`Message: '${message}' from user ${socket.id}`);
            io.emit('chatMessage', `${socket.id}: ${message}`, result.lastID); // broadcast the message to everyone
            callback();
        })
        if (!socket.recovered) {
            await db.getMessage([socket.handshake.auth.serverOffset || 0], (_err, data) => {
                const [socketId, _] = data.client_offset.split('-');
                console.log(`RECOVERED: message: ${data.content} from user ${socketId}`);
                socket.emit('chatMessage', `RECOVERED: ${socketId} ${data.content}`, data.id)
            })
        }

        socket.on('disconnect', (reason) => {
            console.log(`The user ${socket.id} has disconnected: ${reason}`);
        })
    })
}

module.exports = {
    listen,
}