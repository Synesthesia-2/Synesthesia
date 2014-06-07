var server = io.connect('/fone');
var $h3 = $('h3');
var currentOrientation = {}; // This object will act as a container for all of the orientation/motion data
var isTracking = false;

// On connection, the server will send this socket's sessionId back to it.
// By attaching it to currentOrientation we can tag the motion data sent to the
// server with a unique id. This is used in the 'spotlights' visualizer to
// allow individual control of each circle. You might be able to use it for other
// multi-user interactive visualizers...
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

// Right now, this is just hooked up to a simple jQuery listener in fone.jade
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

  // For testing. Uncomment these to display the phones orientation data on it
  // $('#alpha').text("Alpha: " + (currentOrientation.alpha));
  // $('#beta').text("Beta: " + (currentOrientation.beta));
  // $('#gamma').text("Gamma: " + (currentOrientation.gamma));
};

// Notice that 'onDeviceOrientation' is constantly updating currentOrientation
// as the device rotates but 'onDeviceMotion' does the actual emitting, along
// with the motion data.
var onDeviceMotion = function(event) {
  var accel = event.acceleration;
  // Find magnitude of accelertation vector
  var totalAcc = Math.sqrt(Math.pow(accel.x, 2) + Math.pow(accel.y, 2) + Math.pow(accel.z, 2));
  currentOrientation.accel = accel;
  currentOrientation.totalAcc = totalAcc;
  server.emit('audienceMotionData', currentOrientation);
};
