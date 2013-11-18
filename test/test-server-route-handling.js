// TO RUN THESE TESTS:
// issue "mocha -R nyan test/test-server-route-handling.js" from the root directory

var should = require('should');
var http = require('http');

var socketURL = 'http://localhost:8080';

describe("Server should handle incoming connections", function(){

  it("should retrieve the main route", function(done){
    http.get(socketURL+'/', function(res){
      res.statusCode.should.equal(200);
      done();
    });
  });  

  it("should retrieve the dancer endpoint", function(done){
    http.get(socketURL+'/dancer', function(res){
      res.statusCode.should.equal(200);
      done();
    });
  });  

  it("should retrieve the conductor route", function(done){
    http.get(socketURL+'/conductor', function(res){
      res.statusCode.should.equal(200);
      done();
    });
  });  

  it("should retrieve the audio route", function(done){
    http.get(socketURL+'/audio', function(res){
      res.statusCode.should.equal(200);
      done();
    });
  });

  it("should 404 on a bad route", function(done){
    http.get(socketURL+'/DNE', function(res){
      res.statusCode.should.equal(404);
      done();
    });
  });

});
