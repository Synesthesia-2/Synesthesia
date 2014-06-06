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

  // $('body').append($("canvas")).attr("id", "webGLCanvas");
  var canvas = document.createElement("canvas");
  canvas.id = "webGLCanvas";
  document.body.appendChild(canvas);

});
