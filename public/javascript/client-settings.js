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
};

server.on('welcome', function(data){
  brushSettings.id = data.id;
  console.log(data.message);
  if (data.mode === "switchPaintingOn") {
    switchPainting({paint: true});
  } else if (data.mode === "switchPaintingOff") {
    switchPainting({paint: false});    
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
      // removeMotionListener();
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

  server.on('refresh', function(data){
    if (data.mode === "switchPaintingOn") {
      switchPainting({paint: true});
    } else if (data.mode === "switchPaintingOff") {
      switchPainting({paint: false}); 
    }
    server.emit('refresh', {brushId: brushSettings.id});
  });
  
  $('#modelWindow button').on('click touchend', closeModelMessage, false);
});
