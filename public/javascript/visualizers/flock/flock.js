var server = io.connect('/flock');
window.FlockState = {
  speedFactor: 1000,
  separationFactor: 1,
  cohesionFactor: .5,
  alignmentFactor: 8
};

$(document).ready(function() {
  var FlockState = window.FlockState;
  FlockState.opticalFlowTracking = false;

  server.on('welcome', function(data) {
    console.log("flock visualizer welcomed", data);
  });

  server.on('newSeparationFactor', function(data) {
    FlockState.separationFactor = data.separationFactor / 1000;
  });

  server.on('newCohesionFactor', function(data) {
    FlockState.cohesionFactor = data.cohesionFactor / 1000;
  });

  server.on('newAlignmentFactor', function(data) {
    FlockState.alignmentFactor = data.alignmentFactor / 1000;
  });

  server.on('newSpeedFactor', function(data) {
    FlockState.speedFactor = data.speedFactor;
  });

});
