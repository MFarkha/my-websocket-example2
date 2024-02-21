function listen(io) {
    io.on('connection', (socket) => {
        console.log(`The user has connected: ${socket.id}`);
    })
}

module.exports = {
    listen,
}