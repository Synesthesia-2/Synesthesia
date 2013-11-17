// TO RUN THESE TESTS:
// issue "mocha -R nyan test/test-multiple-clients.js" from the root directory

var io = require('socket.io-client');
var assert = require('assert');
var should = require('should');

var socketURL = 'http://localhost:8080';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe("should broadcast conductor commands to the client", function(){
  var conductor3, client3, client4;
  var counter = 0;

  before(function(done){

    conductor3 = io.connect(socketURL + "/conductor");
    conductor3.on('welcome', function(){
      counter === 2 ? done() : counter++;
    });

    client3 = io.connect(socketURL + "/client");
    client3.on('welcome', function(){
      counter === 2 ? done() : counter++;
    });

    client4 = io.connect(socketURL + "/client");
    client4.on('welcome', function(){
      counter === 2 ? done() : counter++;
    });

  });

  it('changes colors', function(done){
    var counter = 0;
    conductor3.emit("changeColor");
    client3.on("changeColor", function(){
      counter === 1 ? done() : counter++;
    });
    client3.on("changeColor", function(){
      counter === 1 ? done() : counter++;
    });
  });

  it('sets random colors', function(done){
    var counter = 0;
    conductor3.emit("randomColor");
    client3.on("randomColor", function(){
      counter === 1 ? done() : counter++;
    });
    client3.on("randomColor", function(){
      counter === 1 ? done() : counter++;
    });
  });

  it('toggles strobe', function(done){
    var counter = 0;
    conductor3.emit("toggleStrobe", {strobe: true});
    client3.on("toggleStrobe", function(){
      counter === 1 ? done() : counter++;
    });
    client3.on("toggleStrobe", function(){
      counter === 1 ? done() : counter++;
    });
  });

  it('changes fade time', function(done){
    var counter = 0;
    conductor3.emit("newFadeTime", {fadeTime: 50});
    client3.on("newFadeTime", function(data){
      data.fadeTime === 50 && (counter === 1 ? done() : counter++);
    });
    client3.on("newFadeTime", function(data){
      data.fadeTime === 50 && (counter === 1 ? done() : counter++);
    });
  });

  after(function(done){
    client3.disconnect();
    client4.disconnect();
    conductor3.disconnect();
    done();
  });

});
