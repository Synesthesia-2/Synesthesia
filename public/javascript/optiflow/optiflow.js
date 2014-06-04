var server = io.connect('/opticalFlow');
var flow = new oflow.WebCamFlow();

server.on('reset', function() {
  flow.stopCapture(); 
});

var sendData = function(opticalFlow) {
  opticalFlow.zones = opticalFlow.zones.filter(function(flowzone, index){
    // Reduce this to increase the amount of data emitted.
    // Sending too much might bog down your visualizations.
    return (index % 16 === 0); 
  });
  server.emit('opticalFlow', opticalFlow);
};

var throttledSendData = _.throttle(sendData, 50);

flow.onCalculated(throttledSendData);
