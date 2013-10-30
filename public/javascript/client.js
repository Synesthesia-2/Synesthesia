// client.js
var client;

$(document).ready(function() {
  client = new Client();
  // pass in socket from socket.io and id from server to the above instance
  
  // when switching to paint mode just $('#wrapper').show()


  // When socket is emiting accel data, trigger initMotionListener
  // WHen socket is just doing color disply, removeMotionListener

  // Close a model on OK click
  $('#modelWindow button').on('click touchend', closeModelMessage, false);

  $('#brushSize').on('touchend', function(e){
    client.brushSize = this.value;
    client.emit('brushChange', { brushSize: this.value });
  });

  $('.colorBlock').on('touchstart', function(e) {
    var color = $(this).data('color');
    client.color = color;
    client.emit('colorChange', { color: color });
  });
});



var initMotionListener = function() {
  window.addEventListener('devicemotion', function(event) {
    var aX = Math.floor(event.acceleration.x);
    var aY = Math.floor(event.acceleration.y);
    var aZ = Math.floor(event.acceleration.z);
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

