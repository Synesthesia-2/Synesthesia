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
};

var removeMotionListener = function() {
  window.removeEventListener('deviceorientation', boundDeviceMotion);
};

var onDeviceMotion = function(event) {
  // var alpha = event.alpha;
  // var beta = event.beta;
  // var gamma = event.gamma;
  // var data = {
  //   alpha: alpha,
  //   beta: beta,
  //   gamma: gamma,
  // };
  var accel = event.acceleration;
  var totalAcc = accel.x + accel.y + accel.z;
  // var motion = event.rotationRate;
  var motion = {
    alpha: Math.floor(event.rotationRate.alpha * 1000),
    beta: Math.floor(event.rotationRate.beta * 1000),
    gamma: Math.floor(event.rotationRate.gamma * 1000),
  };
  // motion.alpha = Math.floor(motion.alpha * 1000);
  // motion.beta = Math.floor(motion.beta * 1000);
  // motion.gamma = Math.floor(motion.gamma * 1000);
  $('#alpha').text("Alpha: " + (motion.alpha));
  $('#beta').text("Beta: " + (motion.beta));
  $('#gamma').text("Gamma: " + (motion.gamma));
  server.emit('motionData', [totalAcc, motion]);
};

var boundDeviceMotion = onDeviceMotion.bind(this);
startTrack();