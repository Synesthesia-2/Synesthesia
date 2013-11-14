//////////////////////////////////////////
///
/// SYNESTHESIA
/// A collaboration between Kinetech and Hack Reactor
///
/// November 2013
/// Weidong Yang
/// David Ryan Hall
/// George Bonner
/// Kate Jenkins
/// Joey Yang
///
/// Check out http://kine-tech.org/ for more information.
///
//////////////////////////////////////////

// Instantiate server
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
server.listen(8080);
var io = require('socket.io').listen(server);

// define socket.io spaces
var conductor = io.of('/conductor');
var clients = io.of('/client');
var fireworks = io.of('/fireworks');
var dancer = io.of('/dancer');
var audio = io.of('/audio');

// instantiate state object (keeps track of performance state)
var state = {
  connections: 0,
  strobe: false,
  audio: false,
  audioLights: false,
  motionTrack: false,
  mode: "default",
  resetMC: function() {
    this.strobe = false;
    this.audio = false;
    this.audioLights = false;
    this.motionTrack = false;
  }
};

// server settings
app.set('views', __dirname + '/views');
app.set("view engine", "jade");
app.use(require('stylus').middleware({ src: __dirname + '/public'}));
app.use(express.static(__dirname + '/public'));   
io.set('log level', 1);                           // reduce server-side logging
io.set('browser client gzip', true);              // gzip the static files

//////////////////////////////////////////
/// ROUTES
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
/// EVENTS
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
  state.resetMC();
  clients.emit('reset');

  conductor.emit("welcome");

  conductor.on('changeColor',function (data){
    var clients = io.of('/client');
    // Do we need to redefine this in each case?
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
    audio.emit('toggleSound', data);
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
    var clients = io.of('/client'); // not necessary
    if (data.audio) {
      state.audioLights = true;
    } else {
      state.audioLights = false;
    }
    // clients.emit?
  });

  conductor.on('newFadeTime', function (data){
    var clients = io.of('/client');
    clients.emit('newFadeTime', data);
  });
});

//////////////////////////////////////////
/// Client events
//////////////////////////////////////////

clients.on('connection', function (client) {
  // var clients = io.of('/client');
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

  // client.on('reconnect', function (){
    // canvas.emit('refresh', data);
    // client.emit("welcome", {
    //   id: client.id,
    //   mode: state.mode
    // });
  // });
});

//////////////////////////////////////////
/// Audio events
//////////////////////////////////////////

audio.on('connection', function (audio) {
  audio.emit('welcome', {audio: state.audio})
  audio.on('audio', function (data){
    var clients = io.of('/client');
    if (state.audioLights) {
      clients.emit('audio', data);
    }
    fireworks.emit('audio', data);
  });
});
