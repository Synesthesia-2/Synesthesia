var express = require('express');
var app=express();
var http=require('http');
var server = http.createServer(app);
server.listen(8080);
var io = require('socket.io').listen(server);
var canvas = io.of('/canvas');
var conductor = io.of('/conductor');
var clients = io.of('/client');

app.set('views', __dirname + '/views');
app.set("view engine", "jade");
app.use(require('stylus').middleware({ src: __dirname + '/public'}));
app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.render('client');
});

// <<<<<<< HEAD
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
  cond.on('changeColor',function(data){
    clients.emit('changeColor',data);
  });
});

clients.on('connection', function (cli) {
  cli.emit("welcome","You're a client!");
});

// =======
// app.get('/conductor', function (req, res) {
//   res.render('conductor');
// });

// app.get('/canvas', function (req, res) {
//   res.render('canvas');
// });
// >>>>>>> 4c90b9bc51edbfcb52157aacf91a91de464c70e6
