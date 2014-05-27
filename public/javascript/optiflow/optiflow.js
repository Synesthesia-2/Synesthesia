var server = io.connect('/optiflow');
var flow = new oflow.WebCamFlow();
var printed = false;

var sendData = function(optiFlowData) {
  optiFlowData.zones = optiFlowData.zones.filter(function(flowzone, index){
    return (index % 4 === 0);
  });
  server.emit('optiFlowData', optiFlowData);
  if (!printed) {
    console.log(optiFlowData.zones.length);  
    printed = true;
    
  }
};

var throttledSendData = _.throttle(sendData, 200);

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

flow.onCalculated(throttledSendData);

