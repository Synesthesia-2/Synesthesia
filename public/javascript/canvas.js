//canvas.js

var canvasWrapper;

$(document).ready(function() {
  canvasWrapper = new CanvasWrapper();
  
  // when a new client connects to server,
  // notify the canvas change below to whatever
  // you need - data should contain a unique
  // id for each brush
  socket.on('newBrush', function(data) {
    canvasWrapper.addView(data.brushId);
  });

  // server sends a draw message with new accel
  // data. Takes a brush ID, and routes the
  // drawing to the appropriate canvas
  socket.on('draw', function(data) {
    canvasWrapper.assign(data);
  });
});
