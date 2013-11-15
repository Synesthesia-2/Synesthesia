// TO RUN THESE TESTS:
// issue "mocha -R nyan test/test-sockets.js" from the root directory

// var Mocha = require('mocha');
var io = require('socket.io-client');
var assert = require('assert');
var should = require('should');

var socketURL = 'http://localhost:8080';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

// var mocha = new Mocha({
//     ui: 'bdd',
//     reporter: 'nyan'
// });

beforeEach(function(done){
  done();
});

describe("Server should handle incoming connections", function(){

  it("and should handle a client connection", function(done){
    var client1 = io.connect(socketURL+"/client");
    client1.on('welcome', function(data){
      (typeof data.id).should.equal("string");
      data.message.should.equal("welcome!");
      data.mode.should.equal("default");
      data.strobe.should.equal(false);
    });
    client1.disconnect();
    done();

  });

  it("and should handle a conductor connection", function(done){
    var conductor1 = io.connect(socketURL + "/conductor");
    conductor1.on('welcome', function(){
      conductor1.disconnect();
      done();
    });
  });

});

describe("should broadcast conductor commands to the client", function(){

  beforeEach(function(done){
    var conductor1 = io.connect(socketURL + "/conductor");
    // conductor1.on('welcome', function(){
      var client1 = io.connect(socketURL + "/client");
      // client1.on('welcome', function(){
        // done();
      // });
    // });
  });

  afterEach(function(done){
    conductor1.disconnect();
    client1.disconnect();
  });

  it('changes colors', function(done){
    conductor1.emit("changeColor");
    client1.on("changeColor", function(){
      done();
    });
  });

  it('sets random colors', function(done){
    conductor1.emit("randomColor");
    client1.on("randomColor", function(){
      done();
    });
  });

  it('toggles strobe', function(done){
    conductor1.emit("toggleStrobe", {strobe: true});
    client1.on("toggleStrobe", function(){
      done();
    });
  });

  it('changes fade time', function(done){
    conductor1.emit("newFadeTime", {fadeTime: 50});
    client1.on("newFadeTime", function(data){
      data.fadeTime === 50 && done();
    });
  });


});



// describe("should handle multiple clients", function(){
//   var conductor1 = io.connect(socketURL + "/conductor");
//   var client1 = io.connect(socketURL + "/client");
//   var client2 = io.connect(socketURL + "/client");


//   it('client1 should change', function(done){
//     client1.on("changeColor", function(){
//       done();
//     });
//   });
  
//   it('client2 should change', function(done){
//     client2.on("changeColor", function(){
//       done();
//     });
//   });
  
//   conductor1.emit("changeColor");

// });


  // it('sets random colors', function(done){
  //   conductor1.emit("randomColor");
  //   client1.on("randomColor", function(){
  //     done();
  //   });
  // });

  // it('toggles strobe', function(done){
  //   conductor1.emit("toggleStrobe", {strobe: true});
  //   client1.on("toggleStrobe", function(){
  //     done();
  //   });
  // });

  // it('changes fade time', function(done){
  //   conductor1.emit("newFadeTime");
  //   client1.on("newFadeTime", function(){
  //     done();
  //   });
  // });

// });





