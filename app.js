var express = require('express');
var app=express();
var http=require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var canvasSocket = io.of('/canvas');
server.listen(8080);

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

canvasSocket.on('connection', function (client) {
  client.emit("welcome","You're a canvas!");
});
