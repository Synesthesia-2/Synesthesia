var express = require('express')
    , app=express()
    , http=require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)

server.listen(8080);

app.use(express.static(__dirname + "/public"));

app.get('/browser', function (req, res) {
  res.sendfile(__dirname + '/public/index.html');
});

app.get('/browser_org', function (req, res) {
  // debugger;
  console.log(__dirname);
  res.sendfile(__dirname + '/public/index_org.html');
});

app.get('/phone', function (req, res) {
  res.sendfile(__dirname + '/phone.html');
});

app.get('/control', function (req, res) {
  res.sendfile(__dirname + '/control.html');
});

io.sockets.on()

io.sockets.on('connection', function (client) {
  client.emit('from server', {hello:'from server'});
  client.on('from client', function(data){console.log(data);});
  client.on('from control', function(data){console.log(data);});

  client.on('motion', function(data){
    client.broadcast.emit('motion', data);
  });

  client.on('touchstart', function(data){
      client.broadcast.emit('touchstart', data);
  });
  
  client.on('touchmove', function(data){
      client.broadcast.emit('touchmove', data);
  });
  
  client.on('touchend', function(data){
      client.broadcast.emit('touchend', data);
  });
  client.on('switch', function(data){
    client.broadcast.emit('switch', data);
  });
  client.on('control', function(data){
    client.broadcast.emit('control', data);
  });

});