const express = require('express');         

const app = express();
const server = require('http').createServer(app);     
const io = new require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');      
const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
    debug: true
});

app.set('view engine', 'ejs');
app.use(express.static('public'));          // we're using public folder here, if the public folder is not being used in the server, we're getting an error.

app.use('/peerjs', peerServer);
app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req, res) => {
    res.render('room', {roomId: req.params.room})
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId);
        socket.on('message', message => {
            io.to(roomId).emit('createMessage', message);
        })
        // socket.on('close-tab', () => {
        //   socket.disconnect(); // Close the socket connection
        //   console.log('Tab closed from client');
        // });      
    })
})

  

server.listen(process.env.PORT||3030);