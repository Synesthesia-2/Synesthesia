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
server.listen(port);
var io = require('socket.io').listen(server);
app.set('io', io);
// var db = require('./server/database_server');
// var helpers = require('./server/helpers');
var routes = require('./config/routes.js');
var middleware = require('./config/middleware.js');

// define socket.io spaces
var conductor = io.of('/conductor');
var clients = io.of('/client');
var fireworks = io.of('/fireworks');
var dancer = io.of('/dancer');
var audio = io.of('/audio');
var optiflow = io.of('/optiflow');
var fone = io.of('/fone');
var optiflow = io.of('/optiflow');
var fonemotion = io.of('/fonemotion');
var grassfield = io.of('/grassfield');

// instantiate state object (keeps track of performance state)
var state = {
  connections: 0,
  strobe: false,
  audio: false,
  audioLights: false,
  motionTrack: false,
  optiFlowTrack: true, //init as true for testing
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
app.get('/fonemotion', routes.renderFoneMotion);
app.get('/dancer', routes.renderDancer);
app.get('/update', routes.renderUpdate);
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
    grassfield.emit('optiFlowData', optiFlowData);
  });
});

//////////////////////////////////////////
/// Audience Motion Detection
//////////////////////////////////////////

fone.on('connection', function (fone) {
  fone.emit('welcome', {
    message: "Connected for motion tracking.",
    tracking: state.motionTrack
  });
  fone.on('orientationData', function (data) {
    fonemotion.emit('orientationData', data);
    console.log("Orientation Data: " + JSON.stringify(data)); // for testing purposes
  });
  fone.on('motionData', function (data) {
    fonemotion.emit('motionData', data);
  });
});
