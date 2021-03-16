const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const roomId = 12;

app.use('/',express.static('public'));
app.use(cors());

io.on('connection',socket => {
    socket.on('join',() => {
        const room = io.sockets.adapter.rooms[roomId] || { length: 0 };
        const clients = room.length;
        console.log('Actualmente hay: '+clients+' personas en el chat');
    
        if(clients === 0){
            console.log(`Chat room created with id: ${roomId}`);
            socket.join(roomId);
            socket.broadcast.emit('joined');
        }
        else if(clients > 2){
            console.log(`Chat room is full as of now: ${roomId}`);
            socket.emit('full-room');
        }
    });
    socket.on('newMessage',messageInfo => {
        messageInfo.className = 'receiver';
        console.log('new message sent: ',messageInfo);
        socket.broadcast.emit('message', messageInfo);
    })
});


const port = process.env.PORT || 6580;
server.listen(port,() => {
    console.log('El servidor esta activo en http://localhost:'+port);
})