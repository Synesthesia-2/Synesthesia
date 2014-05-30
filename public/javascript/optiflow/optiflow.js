var server = io.connect('/optiflow');
var flow = new oflow.WebCamFlow();
var printed = false;

var sendData = function(optiFlowData) {
  optiFlowData.zones = optiFlowData.zones.filter(function(flowzone, index){
    return (index % 16 === 0);
  });
  // optiFlowData.zones = optiFlowData.zones.slice(150,200);
  server.emit('optiFlowData', optiFlowData);
  if (!printed) {
    console.log(optiFlowData.zones.length);  
    printed = true;
    
  }
};

var throttledSendData = _.throttle(sendData, 50);

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

