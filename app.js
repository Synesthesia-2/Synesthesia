var express = require('express')
    , app=express()
    , http=require('http')
    , server = http.createServer(app)
    , io = require('socket.io').listen(server)
    , projector = require('projector.js');

server.listen(8080);

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/controller', function (req, res) {
  res.sendfile(__dirname + '/controller.html');
});

io.sockets.on('connection', function (client) {
  client.on('device', function(data){
    (data.type).listeners();
});