var server = io.connect('/fireworks');

$(document).ready(function() {

  server.on('welcome', function(data) {
    console.log("welcomed", data);
  });

  server.on('motionData', function(data) {
    initialize(data);
  });

  server.on('audio', function(data) {
    initialize(data);
  });

});
