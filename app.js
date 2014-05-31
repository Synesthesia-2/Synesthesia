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
var port = process.env.PORT || 8080;
var oscPort = process.env.OSC_PORT || 3333;
server.listen(port);
var io = require('socket.io').listen(server);
var oscIo = require('node-osc');
app.set('io', io);
app.set('oscIo', oscIo);
// var db = require('./server/database_server');
// var helpers = require('./server/helpers');
var routes = require('./config/routes.js');
var middleware = require('./config/middleware.js');

console.log('Synesthesia server listing on ', port, "\nListening for OSC on port ", oscPort);

 // --- osc routing 
var webcamio = require('socket.io').listen(8081);

webcamio.set('log level', 1);

var oscServer, oscClient;
oscServer = new oscIo.Server(3333, '127.0.0.1');
oscClient = new oscIo.Client(3334, '127.0.0.1');

// define socket.io spaces
var conductor = io.of('/conductor');
var clients = io.of('/client');
var fireworks = io.of('/fireworks');
var dancer = io.of('/dancer');
var flock = io.of('/flock');
var audio = io.of('/audio');
var optiflow = io.of('/optiflow');
var linedance = io.of('/linedance');
var osc = new oscIo.Client('127.0.0.1', oscPort);
osc.send('/oscAddress', 200);
var fone = io.of('/fone');
var shakemeter = io.of('/shakemeter');
var shakebattle = io.of('/shakebattle');
var spotlights = io.of('/spotlights');
var grassfield = io.of('/grassfield');
var particles = io.of('/particles');
var satellite = io.of('/satellite');


// instantiate state object (keeps track of performance state)
var state = {
  connections: 0,
  strobe: false,
  audio: false,
  audioLights: false,
  motionTrack: false,
  optiFlowTrack: true, //init as true for testing
  optiflowFlocking: false,
  currentColor: '#000000',
  resetMC: function() {
    this.strobe = false;
    this.audio = false;
    this.audioLights = false;
    this.motionTrack = false;
  }
};

// set middleware
middleware.setSettings(app, express);

//////////////////////////////////////////
/// ROUTES
//////////////////////////////////////////


// render routes
app.get('/', routes.renderClient);
app.get('/conductor', routes.renderConductor);
app.get('/fireworks', routes.renderFireworks);
app.get('/audio', routes.renderAudio);
app.get('/optiflow', routes.renderOptiFlow);
app.get('/linedance', routes.renderLineDance);
app.get('/grassfield', routes.renderGrassField);
app.get('/fone', routes.renderFone);
app.get('/shakemeter', routes.renderFoneMotion);
app.get('/shakebattle', routes.renderShakeBattle);
app.get('/spotlights', routes.renderSpotlights);
app.get('/satellite', routes.renderSatellite);
app.get('/dancer', routes.renderDancer);
app.get('/flock', routes.renderFlock);
app.get('/update', routes.renderUpdate);
app.get('/particles', routes.renderParticles);
app.get('*', routes.render404);
app.use(function(err, req, res, next){
  if(err) {
    console.log(err);
  }
  res.send(500, 'Houston, your server has a problem.');
});

//////////////////////////////////////////
/// EVENTS
//////////////////////////////////////////

webcamio.sockets.on('connection', function (socket) {
  socket.on("config", function (obj) {
    // oscServer = new osc.Server(obj.server.port, obj.server.host);
    // oscClient = new osc.Client(obj.client.host, obj.client.port);

    // oscClient.send('/status', socket.sessionId + ' connected');

    oscServer.on('message', function(msg, rinfo) {
      // console.log(msg, rinfo);
      socket.emit("message", msg);
      flock.emit("blob", msg);
      particles.emit("blob", msg);
      satellite.emit("blob", msg);
      console.log('Sent blob to flock, satellite, and particles!');
    });
  });
  socket.on("message", function (obj) {
    
    oscClient.send(obj);
  });
});

//////////////////////////////////////////
/// Visualizer events
//////////////////////////////////////////

fireworks.on('connection', function (firework) {
  firework.emit("welcome", "Visualizer connected.");
});

flock.on('connection', function (flock) {
  flock.emit("welcome", "Flock visualizer connected.");
});

particles.on('connection', function (particles) {
  particles.emit("welcome", "Particle visualizer connected.");
});

satellite.on('connection', function(satellite) {
  satellite.emit('hello','hi');
  var d = [["#bundle",2.3283064365386963e-10,["/cur",238,54,410.5]],["#bundle",2.3283064365386963e-10,["/cur",238,54,410.5]],["#bundle",2.3283064365386963e-10,["/cur",239,44,394]],["#bundle",2.3283064365386963e-10,["/cur",239,44,394]],["#bundle",2.3283064365386963e-10,["/cur",238,54,410.5]],["#bundle",2.3283064365386963e-10,["/cur",238,54,410.5]],["#bundle",2.3283064365386963e-10,["/cur",239,44,394]],["#bundle",2.3283064365386963e-10,["/cur",239,44,394]]];
  for (var i = 0; i < d.length; i++) {
      satellite.emit('blob', d[i]);
  }
});

//////////////////////////////////////////
/// Dancer / Motion Tracker events
//////////////////////////////////////////

dancer.on('connection', function (dancer) {
  dancer.emit('welcome', {
    message: "Connected for motion tracking.",
    tracking: state.motionTrack
  });
  dancer.on('motionData', function (data) {
    fireworks.emit('motionData', data);
  });
});

//////////////////////////////////////////
/// Conductor events
//////////////////////////////////////////

conductor.on('connection', function (conductor) {
  state.resetMC();
  clients.emit('reset');
  dancer.emit('reset');
  audio.emit('reset');

  conductor.emit("welcome");

  conductor.on('changeColor',function (data){
    var clients = io.of('/client');
    state.currentColor = data.color;
    clients.emit('changeColor', data);
  });

  conductor.on('randomColor', function (data){
    var clients = io.of('/client');
    state.currentColor = '#000000';    // Set current to black in the case of random
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

  conductor.on('toggleOptiflowFlocking', function (data){
    var flock = io.of('/flock');
    if (data.flocking) {
      state.optiflowFlocking = true;
    } else {
      state.optiflowFlocking = false;
    }
    flock.emit('toggleOptiflowFlocking', data);
    console.log('toggleOptiflowFlocking: ', data.flocking);
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

  conductor.on('newFadeTime', function (data){
    var clients = io.of('/client');
    clients.emit('newFadeTime', data);
  });

  conductor.on('tiltGrid', function (data){
    console.log('app hears tilt');
    var satellite = io.of('/satellite');
    state.currentColor = '#000000';    // Set current to black in the case of random
   satellite.emit('tiltGrid', data);
  });
});

//////////////////////////////////////////
/// Client events
//////////////////////////////////////////

clients.on('connection', function (client) {
  state.connections += 1;

  client.emit("welcome", {
    id: client.id,
    message: "welcome!",
    mode: {
      color: state.currentColor,
      strobe: state.strobe,
      audioLights: state.audioLights
    }
  });

  client.on('disconnect', function (){
    state.connections -= 1;
  });

});

//////////////////////////////////////////
/// Audio events
//////////////////////////////////////////

audio.on('connection', function (audio) {
  audio.emit('welcome', {audio: state.audio});
  audio.on('audio', function (data){
    console.log(data);  // Leave in for test logging until Monday
    var clients = io.of('/client');
    if (state.audioLights) {
      clients.emit('audio', data);
    }
    fireworks.emit('audio', data);
    satellite.emit('audio', data);
  });
});

//////////////////////////////////////////
/// Optical Flow
//////////////////////////////////////////

optiflow.on('connection', function (optiflow) {
  //console.log('optiflow connected'); //temp logging to check socket connection establishment
  optiflow.emit('welcome', { 
    message: "Connected for optical flow tracking.",
    tracking: state.optiFlowTrack
  });
  optiflow.on('optiFlowData', function (optiFlowData) {
    // console.log(optiFlowData); 
    linedance.emit('optiFlowData', optiFlowData);
    flock.emit('optiFlowData', optiFlowData);
    grassfield.emit('optiFlowData', optiFlowData);
    satellite.emit('optiFlowData', optiFlowData);
  });
});

//////////////////////////////////////////
/// Audience Motion Detection
//////////////////////////////////////////

fone.on('connection', function (fone) {
  fone.emit('sessionId', fone.id);
  fone.emit('welcome', {
    message: "Connected for motion tracking.",
    tracking: state.motionTrack
  });
  fone.on('motionData', function (data) {
    shakemeter.emit('motionData', data);
    shakebattle.emit('motionData', data);
    spotlights.emit('motionData', data);
  });
  fone.on('disconnect', function(){
    console.log(fone.id + " disconnected.");
    spotlights.emit("foneDisconnect", fone.id);
  });
});

