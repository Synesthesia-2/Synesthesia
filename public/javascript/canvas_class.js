var CanvasWrapper = function() {
  // if we ever want multiple canvases
  // this.id = id;
  // this.socket = socket;

  this.canvases = {};
};

CanvasWrapper.prototype.message = function(headline, message) {
  $('#modelWindow h1').text(headline);
  $('#modelWindow p').text(message);
  $('#modelMask').fadeIn(300, function() {
    $('#modelWindow').fadeIn(400);
  });
};

CanvasWrapper.prototype.addView = function(brushId) {
  // adds a new canvas for a new brush
  var canvas = new Canvas(brushId);
  this.canvases[brushId] = canvas;
};

// CanvasWrapper.prototype.removeViews = function(){
  // for (keys in this.canvases) {
  //   delete this.canvases[keys];
  // }
// }

CanvasWrapper.prototype.assign = function(data) {
  // routes a command to draw to the correct canvas
  if (this.canvases[data.brushId]) {
    this.canvases[data.brushId].calculateMove(data.aX, data.aY, data.aZ, data.color, data.brushSize);
  }
};


var Canvas = function(brushId) {
  this.brushId = brushId;
  this.height = $(window).height();
  this.width = $(window).width();
  this.x = this.width / 2;
  this.y = this.height / 2;
  this.lastX = this.x;
  this.lastY = this.y;
  var newC = document.createElement('canvas');
  var shell = document.getElementById('canvasShell');
  shell.appendChild(newC);
  this.c = newC;
  this.c.height = this.height;
  this.c.width = this.width;
  this.ctx = this.c.getContext('2d');
};

Canvas.prototype.emit = function(event, args) {
  this.socket.emit(events, args);
};

Canvas.prototype.draw = function(color, brushSize) {
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
  if (this.x > this.width/2) {
    this.x = this.x + aX - 0.05*Math.sqrt(this.x - this.width/2);
  } else {
    this.x = this.x + aX + 0.05*Math.sqrt(this.width/2 - this.x);
  }

  if (this.y > this.height/2) {
    this.y = this.y + aZ/2 - 0.05*Math.sqrt(this.y - this.height/2);
  } else {
    this.y = this.y + aZ/2 + 0.05*Math.sqrt(this.height/2 - this.y);
  }

  // this.color = '#'+ (Math.floor(this.x%256)).toString(16) + (Math.floor(this.y%256)).toString(16) + 'dd';  
  // this.brushSize = this.x%15;

  this.draw(color, brushSize);
};
