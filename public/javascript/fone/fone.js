var server = io.connect('/fone');
var $h1 = $('h1');
var currentOrientation = {};
// currentOrientation.id = Math.floor(Math.random() * 10000);

server.on('sessionId', function(data){
  currentOrientation.id = data;
});

server.on('welcome', function(data) {
  if (data.tracking) {
    startTrack();
  } else {
    $h1.text('Connected. Motion tracking off.');
  }
});

server.on('reset', function() {
  stopTrack();
});

server.on('toggleMotion', function(data) {
  if (data.motion) {
    startTrack();
  } else {
    stopTrack();
  }
});

var startTrack = function() {
  $h1.text('Now tracking motion.');
  initMotionListener();
};

var stopTrack = function() {
  $h1.text('Motion tracking off.');
  removeMotionListener();
};

var initMotionListener = function() {
  window.addEventListener('devicemotion', boundDeviceMotion);
  window.addEventListener('deviceorientation', boundDeviceOrientation);
};

var removeMotionListener = function() {
  window.removeEventListener('devicemotion', boundDeviceMotion);
  window.removeEventListener('deviceorientation', boundDeviceOrientation);
};

var onDeviceOrientation = function(event) {
  currentOrientation.alpha = Math.floor(event.alpha);
  currentOrientation.beta = Math.floor(event.beta);
  currentOrientation.gamma = Math.floor(event.gamma);

  $('#alpha').text("Alpha: " + (currentOrientation.alpha));
  $('#beta').text("Beta: " + (currentOrientation.beta));
  $('#gamma').text("Gamma: " + (currentOrientation.gamma));
};

var onDeviceMotion = function(event) {
  var accel = event.acceleration;
  var totalAcc = Math.floor(Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z));
  currentOrientation.accel = accel;
  currentOrientation.totalAcc = totalAcc;
  server.emit('motionData', currentOrientation);
};

var sendDummyAccelData = function(){
  var data = Math.floor(Math.random() * 140);
  server.emit('motionData', data);
};

var boundDeviceMotion = onDeviceMotion.bind(this);
var boundDeviceOrientation = onDeviceOrientation.bind(this);
startTrack(); // for testing

// setInterval(sendDummyAccelData, 10);