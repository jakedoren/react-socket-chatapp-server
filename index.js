const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io')
const io = socket(server, {
    cors: {
     origin: "*",
      credentials: true
    }
  });
const PORT = process.env.PORT || 8080;
const { userJoin, getCurrentUser } = require('./users')


// Runs when the client connects

io.on('connection', (socket) => {
    console.log('a user has connected');

    socket.on('join', userObj => {
      const user = userJoin(socket.id, userObj.name, userObj.room)

      socket.join(user.room)

      const messageObj = {
        body: `${user.username} has entered the chat!`
      }

      socket.broadcast.to(user.room).emit('message', messageObj)

      console.log(`${userObj.name} entered room ${userObj.room}`)
    })

    socket.emit('your id', socket.id);

    socket.on('send message', body => {
      const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', body)
    })

    socket.on('disconnect', () => console.log(`${socket.id} has disconnected`))


})




server.listen(PORT, console.log(`Server is running on ${PORT}`))





