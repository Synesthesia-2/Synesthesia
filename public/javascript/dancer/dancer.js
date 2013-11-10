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
  window.addEventListener('devicemotion', boundDeviceMotion);
};

var removeMotionListener = function() {
  console.log('remove');
  window.removeEventListener('devicemotion', boundDeviceMotion);
};

var onDeviceMotion = function(event) {
  var aX = event.acceleration.x;
  var aY = event.acceleration.y;
  var aZ = event.acceleration.z;
  var data = {
    aX: aX,
    aY: aY,
    aZ: aZ,
  };
  console.log(data);
  server.emit('motionData', data);
};

var boundDeviceMotion = onDeviceMotion.bind(this);
