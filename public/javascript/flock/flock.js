var server = io.connect('/flock');

$(document).ready(function() {
  var count = 0;
  var optiFlowTracking = false;

  server.on('welcome', function(data) {
    console.log("flock visualizer welcomed", data);
  });

  server.on('optiFlowData', function(data) {
    window.boidData = {u: data.u, v: data.v};
  });

  server.on('toggleOptiflowFlocking', function(data) {
    console.log('toggleOptiflowFlocking', data.flocking);
    optiFlowTracking = data.flocking;
  });

});
