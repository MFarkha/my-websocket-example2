const socket = io({
    auth: {
      serverOffset: 0
    }
});

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const toggleButton = document.getElementById('toggle-btn');

toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (socket.connected) {
        toggleButton.innerText = 'Connect';
        socket.disconnect();
    } else {
        toggleButton.innerText = 'Disconnect';
        socket.connect();
    }
})
    
form.addEventListener('submit', (e) => {
    e.preventDefault(); // prevent submit of the form action
    const message = input.value;
    if (message) {
        socket.emit('chatMessage', message);
        input.value = '';
    }
})

function renderMessage(message) {
    const item = document.createElement('li');
    item.textContent = message;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}

socket.on('chatMessage', (message, serverOffset) => {
    renderMessage(message);
    socket.auth.serverOffset = serverOffset;
})

socket.on('connect', () => {
    if (socket.recovered) {
        renderMessage(`${socket.id} recovered on the chat`);
    } else {
        renderMessage(`${socket.id} joined the chat`);
    }
})