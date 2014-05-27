var server = io.connect('/flock');

$(document).ready(function() {
  var count = 0;
  server.on('welcome', function(data) {
    console.log("flock visualizer welcomed", data);
  });

  server.on('optiFlowData', function(data) {
    window.boidData = [data.u, data.v];
  })

});
