var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
server.listen(8080);
var io = require('socket.io').listen(server);
var conductor = io.of('/conductor');
var clients = io.of('/client');
var fireworks = io.of('/fireworks');
var dancer = io.of('/dancer');
var audio = io.of('/audio');
var state = {
  strobe: false,
  connections: 0,
  mode: "default",
  audio: false,
  audioLights: false,
  motionTrack: false,
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

app.get('/fireworks', function (req, res) {
  res.render('fireworks');
});

app.get('/audio', function (req, res) {
  res.render('audio');
});

app.get('/dancer', function (req, res) {
  res.render('dancer');
});

//////////////////////////////////////////
///
/// EVENTS
///
//////////////////////////////////////////

//////////////////////////////////////////
/// Visualizer events
//////////////////////////////////////////

fireworks.on('connection', function (firework) {
  firework.emit("welcome", "Visualizer connected.");
});

//////////////////////////////////////////
/// Dancer / Motion Tracker events
//////////////////////////////////////////

dancer.on('connection', function (dancer) {
  dancer.emit('welcome', "Connected for motion tracking.");

  dancer.on('motionData', function (data) {
    fireworks.emit('motionData', data);
  });

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

  conductor.on('toggleMotion', function (data){
    var dancer = io.of('/dancer');
    if (data.motion) {
      state.motionTrack = true;
    } else if (!data.paint) {
      state.motionTrack = false;
    }
    dancer.emit('toggleMotion', data);
  });

  conductor.on('toggleStrobe', function (data){
    var clients = io.of('/client');
    if (data.strobe) {
      state.strobe = true;
    } else {
      state.strobe = false;
    }
    clients.emit('toggleStrobe');
  });

  conductor.on('audioLightControl', function (data){
    var clients = io.of('/client');
    if (data.audio) {
      state.audioLights = true;
    } else {
      state.audioLights = false;
    }
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

  client.emit("welcome", {
    id: client.id,
    message: "welcome!",
    mode: state.mode,
    strobe: false
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

});

audio.on('connection', function (audio) {

  audio.on('audio', function (data){
    var clients = io.of('/client');
    console.log(data);
    if (state.audioLights) {
      clients.emit('audio', data);
    }
    fireworks.emit('audio', data);
  });

});
