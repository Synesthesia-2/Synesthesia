var server = io.connect('/fireworks');

$(document).ready(function() {
  // when a new client connects to brushServer,
  // notify the canvas change below to whatever
  // you need - data should contain a unique
  // id for each brush
  server.on('welcome', function(data) {
    console.log("welcomed", data);
  });

  server.on('gyro', function(data) {
    initialize(data);
  });

  server.on('audio', function(data) {
    console.log(data);
    initialize(data);
  })

});
