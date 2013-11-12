var server = io.connect('/dancer');
var $h1 = $('h1');

server.on('welcome', function(data) {
  console.log(data);
  $h1.text('Connected. Motion tracking off.');
});

server.on('toggleMotion', function(data) {
  if (data.motion) {
    console.log('Tracking motion...');
    $h1.text('Now tracking motion.');
    initMotionListener();
  } else {
    console.log('Motion tracking off');
    $h1.text('Motion tracking off.');
    removeMotionListener();
  }
});

var initMotionListener = function() {
  console.log('init');
  window.addEventListener('deviceorientation', boundDeviceMotion);
};

var removeMotionListener = function() {
  console.log('remove');
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
  console.log(data);
  server.emit('motionData', data);
};

var boundDeviceMotion = onDeviceMotion.bind(this);
