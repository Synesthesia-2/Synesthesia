// client.js
var server = io.connect('/client');
server.on('welcome', function(data){
  console.log(data);
});
// TEST CODE
server.on('changeColor', function(data){
  console.log(data);
});

server.on('randomColor', function(data){
  var i = Math.floor(Math.random() * 10);
  console.log(data.color[i]);
});


$(document).ready(function() {
  server.on('switchPainting', function(data){
    data.paint ? initMotionListener() : removeMotionListener();
  });

  $('#modelWindow button').on('click touchend', closeModelMessage, false);
});



var initMotionListener = function() {
  window.addEventListener('devicemotion', function(event) {
    var aX = Math.floor(event.acceleration.x);
    var aY = Math.floor(event.acceleration.y);
    var aZ = Math.floor(event.acceleration.z);
    console.log(aX,aY,aZ);
    server.emit('paint',{
      aX: aX,
      aY: aY,
      aZ: aZ
    });
  }, false);
};

var removeMotionListener = function() {
  window.removeEventListener('devicemotion', function(event) {
    var aX = Math.floor(event.acceleration.x);
    var aY = Math.floor(event.acceleration.y);
    var aZ = Math.floor(event.acceleration.z);
  }, false);
};

var makeModelMessage = function(headline, message) {
  $('#modelWindow h1').text(headline);
  $('#modelWindow p').text(message);
  $('#modelMask').fadeIn(300, function() {
    $('#modelWindow').fadeIn(400);
  });
};

var closeModelMessage = function(e) {
  e.preventDefault();
  $('#modelWindow').fadeOut(300, function() {
    $('#modelMask').fadeOut(200);
    $('#modelWindow h1').text('');
    $('#modelWindow p').text('');
  });
};

