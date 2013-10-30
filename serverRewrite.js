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
io.set('log level', 1); // reduce logging


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
  cond.on('changeColorSplit', function(data){
    // clients("1").emit(data[1].colors);   // presumes existence of data.colors
    // clients("2").emit(data[1].colors);   // presumes existence of data.colors
  });
});

//////////////////////////////////////////
/// Client events
//////////////////////////////////////////
clients.on('connection', function (cli) {
  var team = state["1"] - state["2"] >= 0 ? "2" : "1";
  cli.join(team);
  state[team] += 1;
  state.connections += 1;
  cli.emit("welcome","You're a client on team " + team + "!");
  console.log("team 1 has ", state["1"], " team 2 has", state["2"], " and total is ", state.connections);
  cli.on('disconnect', function(){
    state[team] -= 1;
    state.connections -= 1;
    console.log("team 1 has ", state["1"], " team 2 has", state["2"], " and total is ", state.connections);
  });
});
