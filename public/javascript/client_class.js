var Client = function() {
  this.socket = {};
  this.id = 0;
  this.color = '#FF0000';
  this.brushSize = 1;
};

Client.prototype.emit = function(event, args) {
  this.socket.emit(event, args);
};

Client.prototype.message = function(headline, message) {
  $('#modelWindow h1').text(headline);
  $('#modelWindow p').text(message);
  $('#modelMask').fadeIn(300, function() {
    $('#modelWindow').fadeIn(400);
  });
};