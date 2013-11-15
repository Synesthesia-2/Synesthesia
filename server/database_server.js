var mysql = require('mysql');
var helpers = require('./helpers');

var dbConnection = mysql.createConnection({
  host: "localhost",
  port: '3306',
  user: "root",
  password: "",
  database: "kinetech"
});

exports.dbConnection = dbConnection;
dbConnection.connect();

exports.getCast = function(res) {
  var query = "SELECT * FROM cast;";
  dbConnection.query(query, function(err, result){
    if (!err) {
      sendResponse(res, result, 200);
    } else {
      console.log(err);
    }
  });
};

exports.getUpcomingShows = function(res) {
  var query = "SELECT * FROM shows;";
  dbConnection.query(query, function(err, result){
    if (!err) {
      sendResponse(res, result, 200);
    } else {
      console.log(err);
    }
  });
};

exports.postNewCast = function(data, res) {
  var query = "INSERT INTO `cast` (name, portrait, role, bio) VALUES ('" + data.name + "', '" + data.portrait + "', '" + data.role + "', '" + data.bio + "');";
  dbConnection.query(query, data, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      sendResponse(res, "Cast Member Added", 201);
    }
  });
};

exports.postNewEvent = function(data, res) {
  var query = "INSERT INTO `shows` (title, link, description, location, showdate) VALUES ('" + data.title + "', '" + data.link + "', '" + data.description + "', '" + data.location + "', '" + data.showdate + "');";
  dbConnection.query(query, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      sendResponse(res, "Event Added", 201);
    }
  });
};
