const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

const PORT = process.env.PORT || 5000 // So we can run on heroku || (OR) localhost:5000

const app = express()

const liveChat = require('./routes/liveChat')

app.set('view engine', 'ejs')
    .set('views', 'views')
    .use(express.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(express.static(path.join(__dirname, 'public')))
    .use(
        session({
            // Simple and not very secure session
            secret: 'random_text',
            cookie: {
                httpOnly: false // Permit access to client session
            }
        })
    )
    .use((req, res, next) => {
        console.log(` * ${req.method} ${req.originalUrl}`)
        next()
    })
    .use('/', liveChat)

const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`))

const io = require('socket.io')(server)
io.on('connection', socket => {
    console.log('Client connected!')

    let socketUsername = '';

    socket
        .on('disconnect', () => {
            console.log('A client disconnected!')

            // A user (with a username) logs off.
            if (socketUsername) {
                const message = `${socketUsername} has logged off. :(`
                io.emit('newMessage', {
                    date: new Date(),
                    message,
                    username: 'admin'
                })
            }

        })

        .on('newUser', (username, date) => {
            console.log({ username, date })
            // A new user logs in.
            const message = `${username} has logged on.`
            socket.broadcast.emit('newMessage', {
                date,
                message,
                username: 'admin'
            })
        })

        .on('message', data => {
            // Receive a new message
            console.log('Message received')
            console.log(data)
            socket.broadcast.emit('newMessage', {
                ...data,
            })
        })

        .on('enteredChat', username => {
            socketUsername = username;
        })
})
