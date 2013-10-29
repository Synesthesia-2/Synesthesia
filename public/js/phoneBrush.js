var brush;
var canvasWrapper;

var CanvasWrapper = function(id, socket) {
  this.id = id;
  this.socket = socket;
  this.canvases = {};
};

CanvasWrapper.prototype.message = function(headline, message) {
  $('#modelWindow h1').text(headline);
  $('#modelWindow p').text(message);
  $('#modelMask').fadeIn(300, function() {
    $('#modelWindow').fadeIn(400);
  });
};

CanvasWrapper.prototype.addView = function(brushId, canvas) {
  this.canvases[brushId] = canvas;
};

CanvasWrapper.prototype.assign = function(data) {
  console.log(this.canvases);
  this.canvases[data.brushId].calculateMove(data.aX, data.aY, data.aZ, data.color, data.brushSize);
};

var Brush = function() {
  this.socket = {};
  this.id = 0;
  this.color = '#FF0000';
  this.brushSize = 1;
  this.initDevice();
};

Brush.prototype.initDevice = function() {
  $('#drawOptions').show();
};

Brush.prototype.emit = function(event, args) {
  this.socket.emit(event, args);
};

Brush.prototype.message = function(headline, message) {
  $('#modelWindow h1').text(headline);
  $('#modelWindow p').text(message);
  $('#modelMask').fadeIn(300, function() {
    $('#modelWindow').fadeIn(400);
  });
};

var Canvas = function(brushId) {
  this.brushId = brushId;
  this.height = $(window).height();
  this.width = $(window).width();
  this.x = this.width / 2;
  this.y = this.height / 2;
  this.lastX = this.x;
  this.lastY = this.y;
};

Canvas.prototype.emit = function(event, args) {
  this.socket.emit(events, args);
};

Canvas.prototype.draw = function(brushId, color, brushSize) {
  // clear old data.
  //this.ctx.clearRect(0,0,this.width, this.height);

  this.ctx.beginPath();
  this.ctx.strokeStyle = color;
  this.ctx.lineWidth = brushSize;
  this.ctx.lineJoin = "round";
  this.ctx.moveTo(this.lastX, this.lastY);
  this.ctx.lineTo(this.x, this.y);
  this.ctx.closePath();
  this.ctx.stroke();

  this.lastX = this.x;
  this.lastY = this.y;
};

Canvas.prototype.calculateMove = function(aX, aY, aZ, color, brushSize) {
  this.x += aX;
  this.y += aZ;
  this.draw(color, brushSize);
};

var init = function(server) {
  var socket = io.connect(server);
  if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    brush = new Brush();
    
    socket.emit('device', { type: 'brush', model: brush });
    brush.socket = socket;
    socket.on('welcome', function (data) {
      brush.id = data.id;
      brush.message('Welcome!', 'Use your phone like you would a paintbrush, and draw on the screen!');
    });

  } else {
    $('#canvasShell').show();
    socket.emit('device', { type: 'canvas' });
    socket.on('welcome', function(data) {
      canvasWrapper = new CanvasWrapper(data.id, socket);
      canvasWrapper.message('Welcome!', "Connect your phone to " + server + " to start drawing!");
    });
  }

  socket.on('brushAdd', function(data) {
    console.log('adding ', data);
    var canvas = new Canvas(data.brushId);
    canvasWrapper.addView(data.brushId, canvas);
  });

  socket.on('draw', function(data) {
    canvasWrapper.assign(data);
  });

};

$(document).ready(function() {

  $('#brushSize').on('touchend', function(e){
    brush.brushSize = this.value;
    brush.emit('brushChange', { brushSize: this.value });
  });

  $('.colorBlock').on('touchstart', function(e) {
    var color = $(this).data('color');
    brush.color = color;
    brush.emit('colorChange', { color: color });
  });

  // geolocation - have not touched this yet  
  // var position;
  // var watchId = navigator.geolocation.watchPosition(function(pos) {
  //   position = pos;
  // });
  
  window.addEventListener('devicemotion', function(event) {
    var aX = Math.floor(event.acceleration.x);
    var aY = Math.floor(event.acceleration.y);
    var aZ = Math.floor(event.acceleration.z);
    brush.emit("paint", {
      brushId: brush.id,
      aX: aX,
      aY: aY,
      aZ: aZ,
      color: brush.color,
      brushSize: brush.brushSize
    });
  }, false);
   
  $('#modelWindow button').on('click', function(e) {
    e.preventDefault();
    $('#modelWindow').fadeOut(300, function() {
      $('#modelMask').fadeOut(200);
      $('#modelWindow h1').text('');
      $('#modelWindow p').text('');
    });
  });

});
