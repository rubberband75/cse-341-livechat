const socket = io('/') // This means your client will always be connected to your server, locally or on Heroku.

const chatContainer = document.getElementById('chatContainer')
const chatBox = document.getElementById('chatBox')
const messageEl = document.getElementById('message')
const user = document.getElementById('user')
const date = new Date() // Date implementation

// Let the server know the user has entered the chat room
// (This is to fascilitate letting other users know when this user logs off)
socket.on("connect", () => {
    socket.emit('enteredChat', user.value)
});

socket.on('newMessage', data => {
    addMessage(data, false)
})

// Post message to board
const postMessage = () => {
    let username = user.value;
    let message = messageEl.value.trim();

    // Do nothing if message is blank;
    if (!message) return;

    let messageData = {
        date: new Date(),
        message,
        username,
    }

    socket.emit('message', messageData)
    addMessage(messageData, true)

    messageEl.value = '';
}

// Add message from any user to chatbox, determine if added
// by current user.
const addMessage = (data = {}, user = false) => {
    let messageBox = document.createElement('li')

    // Create Element, and Add Class
    messageBox.classList.add('message')
    if (user) messageBox.classList.add('uMessage')
    if (data.username === 'admin') messageBox.classList.add('adminMessage')

    // Add username if not current user
    if (!user) {
        messageBox.innerHTML = `<b>${data.username}</b><br/>`
    }

    // Add Message text 
    messageBox.innerHTML += `<span>${data.message}</span>`

    // Add timestamp
    let timeString = new Date(data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    messageBox.setAttribute('date', timeString)

    // Add message to message list
    chatBox.appendChild(messageBox);

    // Scroll to the bottom of the message list
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
