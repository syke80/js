var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('chat message', {
    message: 'welcome to the chat'
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(data){
    socket.broadcast.emit('chat message', data);
  });
});

http.listen(3100, function(){
  console.log('listening on *:3100');
});