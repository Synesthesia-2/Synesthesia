// client.js

var server = io.connect('/client');

// TEST CODE
server.on('changeColor', function(data){
  $('body').append(data.color);
});