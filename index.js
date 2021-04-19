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


io.on('connection', (socket) => {
    console.log('a user has connected')

    socket.emit('your id', socket.id);

    socket.on('send message', body => {
        io.emit('message', body)
    })

    socket.on('disconnect', () => console.log(`${socket.id} has disconnected`))


})




server.listen(PORT, console.log(`Server is running on ${PORT}`))





