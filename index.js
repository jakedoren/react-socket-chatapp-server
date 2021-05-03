const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io')
const cors = require('cors')
const io = socket(server, {
    cors: {
     origin: "*",
      credentials: true
    }
  });
const PORT = process.env.PORT || 8080;
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./users')

app.use(cors())
app.get('/', (req, res) => {
  res.send('<h1>Server is up and running</h1>')
})
// Runs when the client connects

io.on('connection', (socket) => {
    console.log('a user has connected');

    socket.on('join', userObj => {
      const user = userJoin(socket.id, userObj.userVal, userObj.room)

      socket.join(user.room)

      const messageObj = {
        body: `${user.username} has entered the chat!`,
      }

      const messageObj2 = {
        body: `Welcome to ${user.room}, ${user.username}`
      }

      socket.emit('message', messageObj2)

      const roomInfo = {
        room: user.room,
        users: getRoomUsers(user.room)
      }

      io.to(user.room).emit('roomUsers', roomInfo)

      socket.broadcast.to(user.room).emit('message', messageObj)

      console.log(`${userObj.userVal} entered room ${userObj.room}`)
    })

    socket.emit('your id', socket.id);

    socket.on('send message', body => {
        const user = getCurrentUser(socket.id)
        console.log(body)
          io.to(user.room).emit('message', body)
    })

    socket.on('disconnect', () => {
      const user = userLeave(socket.id)

      console.log(`${user.username} has left the chat`)
      const messageObj = {
        body: `${user.username} has left the chat :-(`
      }

      if(user) {
        io.to(user.room).emit('message', messageObj)
        io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)})
      }

    })

})


server.listen(PORT, console.log(`Server is running on ${PORT}`))





