var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
server.listen(8080);
var io = require('socket.io').listen(server);
var canvas = io.of('/canvas');
var conductor = io.of('/conductor');
var clients = io.of('/client');
var fireworks = io.of('/fireworks');
var audio = io.of('/audio');
var state = {
  strobe: false,
  connections: 0,
  mode: "default",
  audio: false
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

app.get('/audio', function (req, res) {
  res.render('audio');
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
  clients.emit('refresh', {mode: state.mode});
});

canvas.on('refresh', function (canvas){
  clients.emit('refresh');
  clients.on('refresh', function (data){
    canvas.emit('refresh', data);
  });
});

fireworks.on('connection', function (firework) {
  firework.emit("welcome", "You're a fireworks!");
});

//////////////////////////////////////////
/// Conductor events
//////////////////////////////////////////

conductor.on('connection', function (conductor) {
  // reset on connection
  state.audio = false;
  state.strobe = false;

  conductor.emit("welcome");

  conductor.on('changeColor',function (data){
    var clients = io.of('/client');
    state.mode = "changeColor";
    clients.emit('changeColor', data);
  });

  conductor.on('randomColor', function (data){
    var clients = io.of('/client');
    state.mode = "randomColor";
    clients.emit('randomColor', data);
  });

  conductor.on('toggleSound', function (data){
    state.audio = data.sound;
    audio.emit('startAudio', data);
  });

  conductor.on('switchPainting', function (data){
    var clients = io.of('/client');
    if (data.paint) {
      state.mode = "switchPaintingOn";
    } else if (!data.paint) {
      state.mode = "switchPaintingOff";
      canvas.emit("clearAll");
    }
    clients.emit('switchPainting', data);
  });

  conductor.on('toggleStrobe', function (data){
    var clients = io.of('/client');
    if (data.strobe) {
      state.strobe = true;
    } else if (!data.toggleStrobe) {
      state.strobe = false;
    }
    clients.emit('toggleStrobe');
  });

  conductor.on('newFadeTime', function (data) {
    var clients = io.of('/client');
    clients.emit('newFadeTime', data);
  });
  
});

//////////////////////////////////////////
/// Client events
//////////////////////////////////////////

clients.on('connection', function (client) {
  var clients = io.of('/client');
  state.connections += 1;

//  canvas.emit('newBrush',{brushId: client.id});
  // fireworks.emit('newBrush',{brushId: client.id});

  client.emit("welcome", {
    id: client.id,
    message: "welcome!",
    mode: state.mode,
    strobe: false
  });

  client.on('paint', function (data){
    canvas.emit('paint',data);
    console.log('client.on(paint)');
  });

  client.on('refresh', function (data){
    canvas.emit('refresh', data);
  });

  client.on('disconnect', function (){
    state.connections -= 1;
  });

  client.on('reconnect', function (){
    // canvas.emit('refresh', data);
    // client.emit("welcome", {
    //   id: client.id,
    //   mode: state.mode
    // });
  });

  client.on('gyro', function (data){
    fireworks.emit('gyro', data);
  });

});

audio.on('connection', function (audio) {

  audio.on('audio', function (data){
    var clients = io.of('/client');
    console.log(data);
    clients.emit('audio', data);
    fireworks.emit('audio', data);
  });

});
