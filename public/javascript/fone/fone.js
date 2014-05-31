var server = io.connect('/fone');
var $h3 = $('h3');
var currentOrientation = {};
var isTracking = false;

server.on('sessionId', function(data){
  currentOrientation.id = data;
});

server.on('welcome', function(data) {
  if (data.tracking) {
    startTrack();
  } else {
    $h3.text('Connected. Motion tracking off.');
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

var toggleTracking = function(){
  isTracking = !isTracking;
  if (isTracking) {
    startTrack();
  } else {
    stopTrack();
  }
};

var startTrack = function() {
  $h3.text('Connected. Now tracking motion.');
  initMotionListener();
};

var stopTrack = function() {
  $h3.text('Motion tracking off.');
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

  // $('#alpha').text("Alpha: " + (currentOrientation.alpha));
  // $('#beta').text("Beta: " + (currentOrientation.beta));
  // $('#gamma').text("Gamma: " + (currentOrientation.gamma));
};

var onDeviceMotion = function(event) {
  var accel = event.acceleration;
  var totalAcc = Math.floor(Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z));
  currentOrientation.accel = accel;
  currentOrientation.totalAcc = totalAcc;
  server.emit('motionData', currentOrientation);
};

// For testing purposes
var sendDummyAccelData = function(){
  var data = Math.floor(Math.random() * 140);
  server.emit('motionData', data);
};

var boundDeviceMotion = onDeviceMotion.bind(this);
var boundDeviceOrientation = onDeviceOrientation.bind(this);

// $(startTrack); // for testing

// setInterval(sendDummyAccelData, 10);