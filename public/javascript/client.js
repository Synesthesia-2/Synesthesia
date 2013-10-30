// client.js

var server = io.connect('/client');
server.on('welcome', function(data){
  console.log(data);
});
// TEST CODE
server.on('changeColor', function(data){
  $('body').append(data.color);
});

server.on('randomColor', function(data){
  var i = Math.floor(Math.random() * 10);
  $('body').append(data.color[i]);
});