var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connectedUsers = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/users/', function(req, res){
  res.send(connectedUsers);
});


function User(values) {
  var _id,
      _name,
      properties = {};
  
  _id = values.id,
  _name = values.name;
  
  properties.id = {
    enumerable: true,
    get: function() {
      return _id;
    }
  };

  properties.name = {
    enumerable: true,
    get: function() {
      return _name;
    },
    set: function(value) {
      _name = value;
    }
  };
  
	Object.defineProperties(this, properties);
  Object.seal(this);
}

io.on('connection', function(socket){
  console.log('a user connected', socket.id);
  var user = new User({id: socket.id, name: "User (" + socket.id + ")"});
  connectedUsers.push(user);
  //console.log(socket);
  socket.broadcast.emit('chat message', {
    message: 'welcome to the chat'
  });

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(data){
    connectedUsers.find( user => user.id === socket.id).name = data.name;
    socket.broadcast.emit('chat message', data);
  });
});

http.listen(3100, function(){
  console.log('listening on *:3100');
});