// TO RUN THESE TESTS:
// issue "mocha -R nyan test/test-conductor-events.js" from the root directory

var io = require('socket.io-client');
var assert = require('assert');
var should = require('should');

var socketURL = 'http://localhost:8080';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe("should broadcast conductor commands to the client", function(){
  var conductor2, client2;
  var counter = 0;

  before(function(done){

    conductor2 = io.connect(socketURL + "/conductor");
    conductor2.on('welcome', function(){
      counter === 1 ? done() : counter++;
    });

    client2 = io.connect(socketURL + "/client");
    client2.on('welcome', function(){
      counter === 1 ? done() : counter++;
    });

  });

  it('changes colors', function(done){
    conductor2.emit("changeColor");
    client2.on("changeColor", function(){
      done();
    });
  });

  it('sets random colors', function(done){
    conductor2.emit("randomColor");
    client2.on("randomColor", function(){
      done();
    });
  });

  it('toggles strobe', function(done){
    conductor2.emit("toggleStrobe", {strobe: true});
    client2.on("toggleStrobe", function(){
      done();
    });
  });

  it('changes fade time', function(done){
    conductor2.emit("newFadeTime", {fadeTime: 50});
    client2.on("newFadeTime", function(data){
      data.fadeTime === 50 && done();
    });
  });

  after(function(done){
    client2.disconnect();
    conductor2.disconnect();
    done();
  });

});
