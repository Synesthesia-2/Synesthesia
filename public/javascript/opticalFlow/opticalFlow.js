var server = io.connect('/opticalFlow');
var flow = new oflow.WebCamFlow();


server.on('welcome', function(data) {
    if (data.tracking) {
      flow.startCapture();
    } else {
      $h1.text('Connected. Optical flow tracking off.');
    }
  });
console.log("flow");

server.on('reset', function() {
  flow.stopCapture(); 
});

var sendData = function(opticalFlow) {
  opticalFlow.zones = opticalFlow.zones.filter(function(flowzone, index){
    // Reduce this to increase the amount of data emitted.
    // Sending too much might bog down your visualizations.
    return (index % 13 === 0); 
  });
  server.emit('opticalFlowData', opticalFlow);
};

var throttledSendData = _.throttle(sendData, 50);

flow.onCalculated(throttledSendData);
