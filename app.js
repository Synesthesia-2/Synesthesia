var express = require('express')
var app=express();
var http=require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (client) {
  client.on()
});
