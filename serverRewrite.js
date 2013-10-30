var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
server.listen(8080);
var io = require('socket.io').listen(server);
var canvas = io.of('/canvas');
var conductor = io.of('/conductor');
var clients = io.of('/client');
var state = {
  connections: 0,
  "1": 0,
  "2": 0
};

app.set('views', __dirname + '/views');
app.set("view engine", "jade");
app.use(require('stylus').middleware({ src: __dirname + '/public'}));
app.use(express.static(__dirname + '/public'));
io.set('log level', 1); // reduce logging
io.set('browser client gzip', true);

//////////////////////////////////////////
///
/// ROUTES
///
//////////////////////////////////////////

app.get('/', function (req, res) {
  res.render('client');
});

app.get('/conductor', function (req, res) {
  res.render('conductor');
});

app.get('/canvas', function (req, res) {
  res.render('canvas');
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

conductor.on('connection', function (conductor) {
  conductor.emit("welcome","You're a conductor!");
  conductor.on('changeColor',function(data){
    clients.emit('changeColor', data);
  });
  conductor.on('splitColors', function(data){
    clients("1").emit('changeColor', {color: (data.color)[0]});
    clients("2").emit('changeColor', {color: (data.color)[1]});
  });
});

//////////////////////////////////////////
/// Client events
//////////////////////////////////////////
clients.on('connection', function (client) {
  var team = state["1"] - state["2"] >= 0 ? "2" : "1";
  client.join(team);
  state[team] += 1;
  state.connections += 1;
  client.emit("welcome","You're a client on team " + team + "!");
  client.on('disconnect', function(){
    state[team] -= 1;
    state.connections -= 1;
  });
});
