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
    if (data.type === 'brush') {                  // TODO: Let user import case switching statement
      var brush = new Brush(socket, setUniqueID());
      brushes[brush.id] = brush;
      socket.broadcast.emit("brushAdd", { brushId: brush.id } );
      socket.emit("welcome", { id : brush.id });
    } else if (data.type === 'canvas') {
      var canvas = new Canvas(socket, setUniqueID());
      canvases[canvas.id] = canvas;
      socket.emit("welcome", { id : canvas.id });
    }
  });
  
  socket.on('paint', function(data) {
    socket.broadcast.emit('draw', data);
  });

});

io.sockets.on('disconnect', function(socket) {
  socket.on('device', function(data) {
    if (data.type === 'brush') {                  // TODO: Let user import case switching statement
      
    } else if (data.type === 'canvas') {

    }    
  }
  // add info to socket instead of vice cersa
});

//////////////////////////////////////////
// constructor functions
//////////////////////////////////////////

var Brush = function(socket, id, model) { // pseudoclassical instantiation, model? (is model 'options'?)
  this.socket = socket;
  this.id = id;
  this.color = '#FF0000';                 // TODO: remove hardcoding?
  this.brushSize = 1;                     // TODO: remove hardcoding?
};

var Canvas = function(socket, id) {
  this.socket = socket;
  this.id = id;
};

//////////////////////////////////////////
// helper functions
//////////////////////////////////////////

var getUniqueID = function(set) {                   // TODO: is this function necessary?
  var id = crypto.randomBytes(3).toString('hex');
  while (id in set) {                               // for? || while (!id in set)
    id = crypto.randomBytes(3).toString('hex');
  }
  return id;
};

var setUniqueID = function() {
  return crypto.randomBytes(3).toString('hex');
};

var checkIDs = function(id, set) {                   // TODO: is this function necessary?
  for (items in set) {
    if (id === set[items].id) {
      return false;
    }
  }
  return true;
};

var port = process.env.PORT || 9001;
server.listen(port);
