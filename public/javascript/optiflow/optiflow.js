var flow = new webCamFlow();
var server = io.connect('/optiflow');

var sendData = function(optiFlowData) {
  server.emit('optiFlowData', optiFlowData);
}

server.on('welcome', function(data) {
  if (data.tracking) {
    flow.startCapture();
  } else {
    $h1.text('Connected. Optical flow tracking off.');
  }
});

server.on('reset', function() {
  flow.stopCapture();
});

flow.onCalculated(sendData);



