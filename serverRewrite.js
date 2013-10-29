var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
server.listen(8080);
var io = require('socket.io').listen(server);
var canvas = io.of('/canvas');
var conductor = io.of('/conductor');
var clients = io.of('/client');
io.set('log level', 1); // reduce logging
io.set('browser client gzip', true);


app.use(express.static(__dirname + "/public"));

//////////////////////////////////////////
///
/// ROUTES
///
//////////////////////////////////////////

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/canvas', function (req, res) {
  res.sendfile(__dirname + '/canvas.html');
});

app.get('/conductor', function (req, res) {
  res.sendfile(__dirname + '/conductor.html');
});

//////////////////////////////////////////
///
/// EVENTS
///
//////////////////////////////////////////

//////////////////////////////////////////
/// Canvas events
//////////////////////////////////////////

canvas.on('connection', function (canv) {
  canv.emit("welcome","You're a canvas!");
});

//////////////////////////////////////////
/// Conductor events
//////////////////////////////////////////

conductor.on('connection', function (cond) {
  cond.emit("welcome","You're a conductor!");
  cond.on('changeColor',function(data){
    canvas.emit('changeColor', data);
    clients.emit('changeColor', data);
  });
});

//////////////////////////////////////////
/// Client events
//////////////////////////////////////////

clients.on('connection', function (cli) {
  var team = Math.round(Math.random()) ? "1" : "2";
  cli.join(team);
  cli.emit("welcome","You're a client on team " + team + "!");
});
