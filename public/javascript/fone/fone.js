var server = io.connect('/fone');
var $h3 = $('h3');
var currentOrientation = {};
var isTracking = false;

server.on('sessionId', function(data){currentOrientation.id = data; });

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
  window.addEventListener('devicemotion', onDeviceMotion);
  window.addEventListener('deviceorientation', onDeviceOrientation);
};

var removeMotionListener = function() {
  window.removeEventListener('devicemotion', onDeviceMotion);
  window.removeEventListener('deviceorientation', onDeviceOrientation);
};

var onDeviceOrientation = function(event) {
  currentOrientation.alpha = Math.floor(event.alpha);
  currentOrientation.beta = Math.floor(event.beta);
  currentOrientation.gamma = Math.floor(event.gamma);

  // For testing:
  // $('#alpha').text("Alpha: " + (currentOrientation.alpha));
  // $('#beta').text("Beta: " + (currentOrientation.beta));
  // $('#gamma').text("Gamma: " + (currentOrientation.gamma));
};

var onDeviceMotion = function(event) {
  var accel = event.acceleration;
  var totalAcc = Math.floor(Math.abs(accel.x) + Math.abs(accel.y) + Math.abs(accel.z));
  currentOrientation.accel = accel;
  currentOrientation.totalAcc = totalAcc;
  server.emit('audienceMotionData', currentOrientation);
};
