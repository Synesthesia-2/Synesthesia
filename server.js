var express = require('express'),
    http = require('http'),
    crypto = require('crypto');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, {
  transports: ['websocket'],
  log: false
});

app.set('views', __dirname + '/views');
app.set("view engine", "jade");
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.render("index");
});

var brushes = {};
var canvases = {};

io.sockets.on('connection', function(socket) {
  socket.on('device', function(data) {
    var id;
    if (data.type === 'brush') {
      id = getUniqueID(brushes);
      var brush = new Brush(socket, id);
      brushes[id] = brush;
      socket.broadcast.emit("brushAdd", { brushId:id } );
      socket.emit("welcome", { id : id });
    
    } else if (data.type === 'canvas') {
      id = getUniqueID(canvases);
      var canvas = new Canvas(socket, id);
      canvases[id] = canvas;
      socket.emit('welcome', { id: id });
    }
  });
  
  socket.on('paint', function(data) {
    socket.broadcast.emit('draw', data);
  });

});

io.sockets.on('disconnect', function(socket) {

  // add info to socket instead of vice cersa
});

var Brush = function(socket, id, model) {
  this.socket = socket;
  this.id = id;
  this.color = '#FF0000';
  this.brushSize = 1;
};

var Canvas = function(socket, id) {
  this.socket = socket;
  this.id = id;
};

var getUniqueID = function(set) {
  var id = crypto.randomBytes(3).toString('hex');
  while (id in set) {
    id = crypto.randomBytes(3).toString('hex');
  }
  return id;
};

var port = process.env.PORT || 9001;
server.listen(port);
