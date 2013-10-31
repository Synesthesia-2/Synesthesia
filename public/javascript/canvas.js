//canvas.js
var canvasWrapper;
var brushServer = io.connect('/canvas');

$(document).ready(function() {
  canvasWrapper = new CanvasWrapper();
  // when a new client connects to brushServer,
  // notify the canvas change below to whatever
  // you need - data should contain a unique
  // id for each brush
  brushServer.on('refresh', function(data){
    canvasWrapper.addView(data.brushId);
  });

  brushServer.on('newBrush', function(data) {
    canvasWrapper.addView(data.brushId);
  });

  // brushServer sends a draw message with new accel
  // data. Takes a brush ID, and routes the
  // drawing to the appropriate canvas
  brushServer.on('paint', function(data) {
    console.log(data);
    canvasWrapper.assign(data);
  });

  // brushServer.on('clearAll', function(){
  //   canvasWrapper.removeViews();
  // });

});
