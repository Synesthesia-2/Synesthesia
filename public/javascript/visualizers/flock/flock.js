var server = io.connect('/flock');
window.FlockState = {};

$(document).ready(function() {
  var FlockState = window.FlockState;
  FlockState.opticalFlowTracking = false;

  server.on('welcome', function(data) {
    console.log("flock visualizer welcomed", data);
  });

  server.on('opticalFlowData', function(data) {
    console.log('flowed!', data);
    FlockState.boidData = {u: data.u, v: data.v};
  });

  server.on('blob', function(data) {
    console.log('blobbed!');
    FlockState.blobData = data;
  })

  server.on('toggleOpticalFlowFlocking', function(data) {
    console.log('toggleOpticalFlowFlocking', data.flocking);
    FlockState.opticalFlowTracking = data.flocking;
  });

  server.on('newFadeTime', function(data) {
    console.log('received speed control of ', data);
    FlockState.speedFactor = data.fadeTime;
  });

});
