var express = require('express');
var app=express();
var http=require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(8080);

app.set('views', __dirname + '/views');
app.set("view engine", "jade");
app.use(require('stylus').middleware({ src: __dirname + '/public'}));
app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.render('client');
});

app.get('/conductor', function (req, res) {
  res.render('conductor');
});

app.get('/canvas', function (req, res) {
  res.render('canvas');
});