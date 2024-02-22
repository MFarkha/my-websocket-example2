const db = require('./db');

async function listen(io) {
    await db.initDB();

    io.on('connection', async (socket) => {
        console.log(`The user has connected: ${socket.id}`);
        socket.on('chatMessage', async (message) => {
            const result = await db.addMessage(message);
            console.log(`Message: '${message}' from user ${socket.id}`);
            io.emit('chatMessage', `${socket.id}: ${message}`, result.lastID); // broadcast the message to everyone
        })
        if (!socket.recovered) {
            console.log(`${socket.id} has been recovered`);
            await db.getMessage([socket.handshake.auth.serverOffset || 0], (_err, data) => {
                socket.emit('chatMessage', `${socket.id}: ${data.content}`, data.id)
            })
        }

        socket.on('disconnect', (reason) => {
            console.log('The user has disconnected:', reason);
        })
    })
}

module.exports = {
    listen,
}