var express = require('express');
var app=express();
var http=require('http');
var server = http.createServer(app);
server.listen(8080);
var io = require('socket.io').listen(server);
var canvas = io.of('/canvas');
var conductor = io.of('/conductor');
var client = io.of('/client');

app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

app.get('/canvas', function (req, res) {
  res.sendfile(__dirname + '/canvas.html');
});

app.get('/conductor', function (req, res) {
  res.sendfile(__dirname + '/conductor.html');
});

canvas.on('connection', function (canv) {
  canv.emit("welcome","You're a canvas!");
});

conductor.on('connection', function (cond) {
  cond.emit("welcome","You're a conductor!");
});

client.on('connection', function (cli) {
  cli.emit("welcome","You're a client!");
});

