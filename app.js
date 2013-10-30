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
  "2": 0,
  painting: false
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

app.get('/fireworks', function (req, res) {
  res.render('fireworks');
});

//////////////////////////////////////////
///
/// EVENTS
///
//////////////////////////////////////////

//////////////////////////////////////////
/// Canvas events
//////////////////////////////////////////

canvas.on('connection', function (canvas) {
  canvas.emit("welcome","You're a canvas!");
});

//////////////////////////////////////////
/// Conductor events
//////////////////////////////////////////

conductor.on('connection', function (conductor) {
  console.log('conductor connected');
  conductor.emit("welcome","You're a conductor!");
  conductor.on('changeColor',function(data){
    console.log('changecolor event');
    clients.emit('changeColor', data);
  });
  conductor.on('splitColors', function(data){
    clients.in("1").emit('changeColor', {color: (data.color)[0]});
    clients.in("2").emit('changeColor', {color: (data.color)[1]});
  });
  conductor.on('allRandomColors', function(data){
    clients.emit('randomColor', {color: data.color});
  });
  conductor.on('switchPainting', function(data){
    state.painting = !state.painting;
    clients.emit('switchPainting', data);
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
  canvas.emit('newBrush',{brushId: client.id})
  client.emit("welcome", {
    id: client.id,
    message: "You're a client on team " + team + "!",
    painting: state.painting
  });
  client.on('paint', function(data){
    console.log(data);
    canvas.emit('paint',data);
  });
  client.on('disconnect', function(){
    state[team] -= 1;
    state.connections -= 1;
  });
});
