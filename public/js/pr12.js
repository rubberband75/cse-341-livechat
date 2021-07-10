const socket = io('/') // This means your client will always be connected to your server, locally or on Heroku.

const errorContainer = document.getElementById('errMsg')
const usernameInput = document.getElementById('username')
const date = new Date()

// A simple async POST request function
const getData = async (url = '') => {
    const response = await fetch(url, {
        method: 'GET'
    })
    return response.json()
}

// A simple async POST request function
const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}

// Login user to access chat room.
const login = async () => {

    // Hide Error Message
    let errorMessage = document.getElementById("errMsg");
    errorMessage.classList.add('hidden')

    // Get Username Input
    let username = document.getElementById("username").value;

    // Login to server
    let response = await postData("/login", { username })

    // Display Error if needed
    if (response.error) {
        errorMessage.innerText = response.error;
        errorMessage.classList.remove('hidden')
    }
    else { // If successful, redirect to chat
        socket.emit('newUser', username, new Date())
        window.location.href = "/chat"
    }


}
