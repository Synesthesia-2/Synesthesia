var mysql = require('mysql');
var helpers = require('./helpers');

var dbConnection = mysql.createConnection({
  host: "localhost",
  port: '3306',
  user: "root",
  password: "",
  database: "kinetech"
});

dbConnection.connect();

exports.getCast = function(res) {
  var query = "SELECT * FROM cast;";
  dbConnection.query(query, function(err, result){
    if (!err) {
      sendResponse(res, result, 201);
    } else {
      console.log(err);
    }
  });
};

exports.getUpcomingShows = function(res) {
  var query = "SELECT * FROM shows;";
  dbConnection.query(query, function(err, result){
    if (!err) {
      sendResponse(res, result, 201);
    } else {
      console.log(err);
    }
  });
};