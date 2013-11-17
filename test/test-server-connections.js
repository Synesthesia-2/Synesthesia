// TO RUN THESE TESTS:
// issue "mocha -R nyan test/test-server-connections.js" from the root directory

var io = require('socket.io-client');
var assert = require('assert');
var should = require('should');

var socketURL = 'http://localhost:8080';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe("Server should handle incoming connections", function(){
  var client1, conductor1;

  it("and should handle a client connection", function(done){
    client1 = io.connect(socketURL+"/client");
    client1.on('welcome', function(data){
      (typeof data.id).should.equal("string");
      data.message.should.equal("welcome!");
      data.strobe.should.equal(false);
      done();
    });
  });

  it("and should handle a conductor connection", function(done){
    var finished = false;
    conductor1 = io.connect(socketURL+"/conductor");
    conductor1.on('welcome', function(){
      if (!finished) {
        finished = true;
        done();
      }
    });

  });

  after(function(done){
    client1.disconnect();
    conductor1.disconnect();
    done();
  });

});
