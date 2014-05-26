var server = io.connect('/optiflow');
var flow = new oflow.WebCamFlow();
var printed = false;

var filterOptiFlowData = function(data){
  data.zones = _.filter(data.zones, function(flowzone, index){
    return !(flowzone.x % 4);
  });
  return data;
};

var sendData = function(optiFlowData) {
  optiFlowData = filterOptiFlowData(optiFlowData);
  if (optiFlowData.zones.length < 252) {console.log((optiFlowData));}
  server.emit('optiFlowData', optiFlowData);
  if (!printed) {
    console.log(optiFlowData.zones.length);  
    printed = true;
    
  }
};

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

