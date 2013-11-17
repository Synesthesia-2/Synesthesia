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

var status;

describe("Server should handle incoming connections", function(){
  status = 'running';
  var client1, conductor1;
  console.log("first set starting");

  it("and should handle a client connection", function(done){
    console.log("first test starting");
    client1 = io.connect(socketURL+"/client");
    client1.on('welcome', function(data){
      (typeof data.id).should.equal("string");
      data.message.should.equal("welcome!");
      data.strobe.should.equal(false);
      console.log("first test ending");
      done();
    });
  });

  it("and should handle a conductor connection", function(done){
    console.log("second test starting");
    var finished = false;
    conductor1 = io.connect(socketURL+"/conductor");
    conductor1.on('welcome', function(){
      if (!finished) {
        finished = true;
        console.log("second test ending");
        done();
      }
    });

  });

  after(function(done){
    client1.disconnect();
    client1 = '';
    conductor1.disconnect();
    conductor1 = '';
    status = 'not running';
    console.log("first set ending");
    done();
  });

});

// describe("should broadcast conductor commands to the client", function(){
//   var conductor2, client2;
//   var counter = 0;

//   before(function(done){
//     // var checkIfReady = setInterval(function(){
//     //   console.log("timeout");
//     //   if (status === 'not running'){

//         console.log("second set cleared to start");
//         status = 'running';
//         // clearInterval(checkIfReady);

//         conductor2 = io.connect(socketURL + "/conductor");
//         conductor2.on('welcome', function(){
//           console.log('hiconductor');
//           counter === 1 ? done() : counter++;
//         });

//         client2 = io.connect(socketURL + "/client");
//         client2.on('welcome', function(){
//           console.log('hiclient');
//           counter === 1 ? done() : counter++;
//         });

//     //   }
//     // }, 25);
//   });

//   // beforeEach(function(done){
//   //   console.log("second set starting");
//   //   conductor2 = io.connect(socketURL + "/conductor");
//   //   conductor2.on('welcome', function(){
//   //     client2 = io.connect(socketURL + "/client");
//   //     client2.on('welcome', function(){
//   //       console.log("client welcomed");
//   //       done();
//   //     });
//   //   });
//   // });

//   // afterEach(function(done){
//   //   conductor2.disconnect();
//   //   client2.disconnect();
//   //   done();
//   // });

//   it('changes colors', function(done){
//     conductor2.emit("changeColor");
//     client2.on("changeColor", function(){
//       done();
//     });
//   });

//   it('sets random colors', function(done){
//     conductor2.emit("randomColor");
//     client2.on("randomColor", function(){
//       done();
//     });
//   });

//   it('toggles strobe', function(done){
//     conductor2.emit("toggleStrobe", {strobe: true});
//     client2.on("toggleStrobe", function(){
//       done();
//     });
//   });

//   it('changes fade time', function(done){
//     conductor2.emit("newFadeTime", {fadeTime: 50});
//     client2.on("newFadeTime", function(data){
//       data.fadeTime === 50 && done();
//     });
//   });


// });



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





