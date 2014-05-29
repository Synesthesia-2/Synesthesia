// var server = io.connect('/optiflow');
// var flow = new oflow.WebCamFlow();
// var printed = false;
// var sendData = function(optiFlowData) {
//   server.emit('optiFlowData', optiFlowData);
//   if (!printed) {
//     console.log(optiFlowData.zones.length);  
//     printed = true;
    
//   }
// }

// server.on('welcome', function(data) {
//   if (data.tracking) {
//     flow.startCapture();
//   } else {
//     $h1.text('Connected. Optical flow tracking off.');
//   }
// });

// server.on('reset', function() {
//   flow.stopCapture();
// });

// flow.onCalculated(sendData);

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
  if (true) {
    flow.startCapture();
  } else {
    $h1.text('Connected. Optical flow tracking off.');
  }
});

server.on('reset', function() {
  flow.stopCapture();
});

var sendData = function(optiFlowData) {
  optiFlowData.zones = optiFlowData.zones.filter(function(flowzone, index){
    // Reduce this to increase the amount of data emitted.
    // Sending too much might bog down your visualizations.
    return (index % 16 === 0); 
  });
  server.emit('optiFlowData', optiFlowData);
};

var throttledSendData = _.throttle(sendData, 50);

flow.onCalculated(throttledSendData);
