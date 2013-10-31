
var server = io.connect('/fireworks');

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
  server.on('paint', function(data) {
    console.log('Within fireworks.js ',data);
    initialize(data);
  });

});
