
var server = io.connect('/soulwire');

$(document).ready(function() {
  // when a new client connects to brushServer,
  // notify the canvas change below to whatever
  // you need - data should contain a unique
  // id for each brush
  server.on('welcome', function(data) {
    console.log("welcomed", data);
  })
  server.on('newBrush', function(data) {
    canvasWrapper.addView(data.brushId);
  });

  // brushServer sends a draw message with new accel
  // data. Takes a brush ID, and routes the
  // drawing to the appropriate canvas
  server.on('gyro', function(data) {
    // debugger;
    gl.initialize(data);
  });

  server.on('audio', function(data) {
    gl.initialize(data);
    console.log('audio data received to client');
  })

});