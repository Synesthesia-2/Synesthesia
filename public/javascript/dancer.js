var server = io.connect('/dancer');

$(document).ready(function() {

  server.on('welcome', function(data) {
    console.log("welcomed", data);
  })
  server.on('newBrush', function(data) {
    canvasWrapper.addView(data.brushId);
  });

  server.on('audio', function(data) {
    console.log("dancer receiving audio");

  });

});