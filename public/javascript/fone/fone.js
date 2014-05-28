var server = io.connect('/fone');
var $h1 = $('h1');

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
  var motion = {
    alpha: Math.floor(event.alpha),
    beta: Math.floor(event.beta),
    gamma: Math.floor(event.gamma),
  };
  $('#alpha').text("Alpha: " + (motion.alpha));
  $('#beta').text("Beta: " + (motion.beta));
  $('#gamma').text("Gamma: " + (motion.gamma));
  server.emit('orientationData', motion);
};

var onDeviceMotion = function(event) {
  var accel = event.acceleration;
  var totalAcc = Math.floor(Math.abs(accel.x + accel.y + accel.z));
  server.emit('motionData', totalAcc);
};

var sendDummyAccelData = function(){
  var data = Math.floor(Math.random() * 100);
  server.emit('motionData', data);
};

var boundDeviceMotion = onDeviceMotion.bind(this);
var boundDeviceOrientation = onDeviceOrientation.bind(this);
startTrack();

// setInterval(sendDummyAccelData, 100);