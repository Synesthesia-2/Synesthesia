var server = io.connect('/client');
var brushSettings = {
  brushSize: 5,
  color: "#000000"
};

var changeColor = function(data){
  $("#wrapper").hide();
  console.log(data.color);
  $('body').css({'background-color': data.color});
};

var randomColor = function(data){
  var i = Math.floor(Math.random() * 10);
  var color = data.color[i];
  console.log(color);
  $('body').css({'background-color': color});
  $('#modelWindow button').on('click touchend', closeModelMessage, false);  
};

var switchPainting = function(data){
  data.paint ? initMotionListener() : removeMotionListener();
}

server.on('welcome', function(data){
  brushSettings.id = data.id;
  console.log(data.message);
  if (data.mode === "switchPainting") {
    switchPainting({paint: true});
  }
});

server.on('changeColor', function(data){
  changeColor(data);
});

server.on('randomColor', function(data){
  randomColor(data);
});

$(document).ready(function() {
  $('body').on("touchstart",function(){
      removeMotionListener();
  });

  $('#brushSize').on('touchend', function(e){
    brushSettings.brushSize = this.value;
  });

  $('.colorBlock').on('touchstart', function(e) {
    var color = $(this).data('color');
    brushSettings.color = color;
  });

  server.on('switchPainting', function(data){
    switchPainting(data);
  });
  

  $('#modelWindow button').on('click touchend', closeModelMessage, false);
});

var initMotionListener = function() {
  $('#wrapper').fadeIn();
  window.addEventListener('devicemotion', function(event) {
    var aX = Math.floor(event.acceleration.x);
    var aY = Math.floor(event.acceleration.y);
    var aZ = Math.floor(event.acceleration.z);
    // var beta = Math.floor(event.orientation.beta);
    server.emit('paint',{
      aX: aX,
      aY: aY,
      aZ: aZ,
      color: brushSettings.color,
      brushSize: brushSettings.brushSize,
      brushId: brushSettings.id//,
      // beta: beta
    });
  }, false);
};

// TODO: Fix removeMotionListener
var removeMotionListener = function() {
  // $('#wrapper').fadeOut();
  // alert('inside removeMotionListener')
  window.removeEventListener('devicemotion', function(event) {
    var aX = Math.floor(event.acceleration.x);
    var aY = Math.floor(event.acceleration.y);
    var aZ = Math.floor(event.acceleration.z);
  }, false);
};


// Message Functions for Later
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
