var server = io.connect('/flock');

$(document).ready(function() {
  var count = 0;
  var optiFlowTracking = false;

  server.on('welcome', function(data) {
    console.log("flock visualizer welcomed", data);
  });

  server.on('opticalFlowData', function(data) {
    window.boidData = {u: data.u, v: data.v};
  });

  server.on('blob', function(data) {
    console.log('blobbed!');
    window.blobData = data;
  })

  server.on('toggleOpticalFlowFlocking', function(data) {
    console.log('toggleOpticalFlowFlocking', data.flocking);
    optiFlowTracking = data.flocking;
  });

  server.on('newFadeTime', function(data) {
    console.log('received speed control of ', data);
    window.speedFactor = data.fadeTime;
  });

});