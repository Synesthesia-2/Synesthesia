var emitMove = function(event){
  var aX = Math.floor(event.acceleration.x);
  var aY = Math.floor(event.acceleration.y);
  var aZ = Math.floor(event.acceleration.z);
  console.log(aX,aY,aZ);
  var data = {
    aX: aX,
    aY: aY,
    aZ: aZ,
    color: brushSbrrettings.color,
    brushSize: state.brushSize,
    brushId: state.id
  };
  server.emit('paint',data);
};

var emitGyro = function(event){
  var alpha = Math.round(event.alpha);
    var beta = Math.round(event.beta);
    var gamma = Math.round(event.gamma);
    var data = {
      alpha: alpha,
      beta: beta,
      gamma: gamma,
      color: state.color,
      brushSize: state.brushSize,
      brushId: state.id
    };
    server.emit('gyro', data);
};

var initMotionListener = function() {
  $('#wrapper').fadeIn();
  window.addEventListener('devicemotion', emitMove, false);
  window.addEventListener('deviceorientation', emitGyro, false)
};

// TODO: Fix removeMotionListener
var removeMotionListener = function() {
  $('#wrapper').fadeOut();
  window.removeEventListener('devicemotion', emitMove, false);
};