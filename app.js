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

var http = require('http');
var express = require('express');
var oscIo = require('node-osc');
var routes = require('./config/routes.js');
var middleware = require('./config/middleware.js');
var fs = require('fs');
var _ = require('underscore');

// Instantiate server
var app = express();
var server = http.createServer(app);
var port = process.env.PORT || 8080;
var oscPort = process.env.OSC_PORT || 3333;
server.listen(port);
var io = require('socket.io').listen(server);
app.set('io', io);
app.set('oscIo', oscIo);

console.log('Synesthesia server listing on ', port, "\nListening for OSC on port ", oscPort);

 // --- osc routing 
var webcamio = require('socket.io').listen(8081);

webcamio.set('log level', 1);

var oscServer, oscClient;
oscServer = new oscIo.Server(3333, '127.0.0.1');
oscClient = new oscIo.Client(3334, '127.0.0.1');


var inputChannels = {
  audio: [],
  opticalFlow: [],
  blob: []
};

// Gathers names of visualizers and reads config.json files in their respective directories
var visualizers = (function() {
  var parentDir = __dirname + '/public/javascript/visualizers';
  var dirs = fs.readdirSync(parentDir);
  
  var visualizers = [];

  dirs.forEach(function(dirname){
    var configFile = parentDir + '/' + dirname + '/config.json';
    var configObj = require(configFile);

    var defaultConfig = {
      name: dirname,
      inputs: null,
      extraJS: null,
      extraStyl: null,
      socket: io.of('/' + dirname)
    };

    visualizers.push(_.extend(defaultConfig,configObj));
  });
  return visualizers;
}());

// var visualizers = init();

// Sets up socket.io connections for each visualizer collected above
var connectSockets = function (routeInfoArr ) {
  routeInfoArr.forEach(function(routeObj) {
    routeObj.socket.on('connection', function(event){
      event.emit("Welcome", "Visualizer conected.");
    });

    // Maps inputs to the visualizers that require them in their config.json files
    routeObj.inputs.forEach(function (input) {
      if(inputChannels[input]) {
        inputChannels[input].push(routeObj.socket);
      } else {
        inputChannels[input] = [routeObj.socket];
      }
    });
  });
};

connectSockets(visualizers);


// Emit data to multiple visualizers, according to 'inputChannels'
var emitData = function (eventName, data) {
  var emitList = inputChannels[eventName] || [];
  emitList.forEach(function(socket) {
    socket.emit(eventName, data);
  });
};

// define socket.io spaces
var conductor = io.of('/conductor');
var conductor2 = io.of('/conductor2');
var clients = io.of('/client');
var dancer = io.of('/dancer');
var audio = io.of('/audio');
var opticalFlow = io.of('/opticalFlow');
// var linedance = io.of('/linedance');
var osc = new oscIo.Client('127.0.0.1', oscPort);
var fone = io.of('/fone');

osc.send('/oscAddress', 20130);

// instantiate state object (keeps track of performance state)
var state = {
  connections: 0,
  strobe: false,
  audio: false,
  audioLights: false,
  motionTrack: false,
  opticalFlowTrack: true, //init as true for testing
  opticalFlowFlocking: false,
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
// app.get('*', routes.renderView);

app.get('*', function(req,res){
  routes.renderView(req,res,visualizers);
});
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
      socket.emit("message", msg);
      flock.emit("blob", msg);
      particles.emit("blob", msg);
    });
  });
  socket.on("message", function (obj) {
    
    oscClient.send(obj);
  });
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
    emitData('motionData', data);
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
    emitData('changeColor', data);
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
    emitData('newFadeTime', data);
  });
});

conductor2.on('connection', function(conductor2){
  conductor2.on('newSeparationFactor', function (data){
    emitData('newSeparationFactor', data);
  });

  conductor2.on('newCohesionFactor', function (data){
    emitData('newCohesionFactor', data);
  });

  conductor2.on('newAlignmentFactor', function (data){
    emitData('newAlignmentFactor', data);
  });

  conductor2.on('newSpeedFactor', function (data){
    emitData('newSpeedFactor', data);
  });
});

//////////////////////////////////////////
/// Client events
//////////////////////////////////////////

clients.on('connect', function (client) {
  state.connections += 1;

  clients.emit("welcome", {
    id: client.id,
    message: "welcome!",
    mode: {
      color: state.currentColor,
      strobe: state.strobe,
      audioLights: state.audioLights
    }
  });

  clients.on('disconnect', function (){
    state.connections -= 1;
  });

});

//////////////////////////////////////////
/// Audio events
//////////////////////////////////////////

audio.on('connection', function (audio) {
  console.log('Audio connected');
  audio.emit('welcome', {audio: state.audio});
  audio.on('audio', function (data){
    var clients = io.of('/client');
    if (state.audioLights) {
      clients.emit('audio', data);
    }
    // fireworks.emit('audio', data);
    // satellite.emit('audio', data);
    emitData('audio', data);
  });
});

//////////////////////////////////////////
/// Optical Flow
//////////////////////////////////////////

opticalFlow.on('connection', function (opticalFlow) {
  console.log('opticalFlow connected');
  opticalFlow.emit('welcome', { 
    message: "Connected for optical flow tracking.",
    tracking: state.opticalFlowTrack
  });
  opticalFlow.on('opticalFlowData', function (opticalFlowData) {
    emitData('opticalFlow', opticalFlowData);
  });
});

//////////////////////////////////////////
/// Audience Motion Detection
//////////////////////////////////////////

fone.on('connection', function (fone) {
  console.log('fone connected'); //temp logging to check socket connection establishment
  fone.emit('sessionId', fone.id);
  console.log(fone.id + " connected.");
  fone.emit('welcome', {
    message: "Connected for motion tracking.",
    tracking: state.motionTrack
  });
  fone.on('audienceMotionData', function (data) {
    console.log(data);
    emitData('audienceMotionData', data);
  });
  fone.on('disconnect', function(){
    console.log(fone.id + " disconnected.");
    emitData("foneDisconnect", fone.id);
  });
});

