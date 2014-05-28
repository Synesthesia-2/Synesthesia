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
  window.addEventListener('deviceorientation', boundDeviceMotion);
};

var removeMotionListener = function() {
  window.removeEventListener('deviceorientation', boundDeviceMotion);
};

var onDeviceMotion = function(event) {
  var alpha = event.alpha;
  var beta = event.beta;
  var gamma = event.gamma;
  var data = {
    alpha: alpha,
    beta: beta,
    gamma: gamma,
  };
  $('#alpha').text(data.alpha);
  $('#beta').text(data.beta);
  $('#gamma').text(data.gamma);
  server.emit('motionData', data);
};

var boundDeviceMotion = onDeviceMotion.bind(this);
startTrack();