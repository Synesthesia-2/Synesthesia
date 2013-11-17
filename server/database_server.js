var mysql = require('mysql');
var helpers = require('./helpers');
var db_config = require('../db/db_config');

var dbConnection;

function handleDisconnect() {
  dbConnection = mysql.createConnection(db_config.dbInfo);

  dbConnection.connect(function(err) {
    if(err) {
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    }
  });

  dbConnection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();


exports.getCast = function(res) {
  var query = "SELECT * FROM cast;";
  makeQuery(res, query, "", 200);
};

exports.getUpcomingShows = function(res) {
  var query = "SELECT * FROM shows;";
  makeQuery(res, query, "", 200);
};

exports.postNewCast = function(data, res) {
  var query = "INSERT INTO `cast` (name, portrait, role, bio) VALUES ('" + data.name + "', '" + data.portrait + "', '" + data.role + "', '" + data.bio + "');";
  makeQuery(res, query, "Cast Member Added", 201);
};

exports.postNewEvent = function(data, res) {
  var query = "INSERT INTO `shows` (title, link, description, location, showdate) VALUES ('" + data.title + "', '" + data.link + "', '" + data.description + "', '" + data.location + "', '" + data.showdate + "');";
  makeQuery(res, query, "Event Added", 201);
};

exports.updateCastMember = function(id, data, res) {
  var query = "UPDATE `cast` SET name='" + data.name + "', portrait='" + data.portrait + "', role='" + data.role + "', bio='" + data.bio + "' WHERE id=" + id + " ;";
  makeQuery(res, query, "Model Updated", 201);
};

exports.updateEvent = function(id, data, res) {
  var query = "UPDATE `shows` SET title='" + data.title + "', link='" + data.link + "', description='" + data.description + "', location='" + data.location + "', showdate='" + data.showdate + "' WHERE id=" + id + ";";
  makeQuery(res, query, "Model Updated", 201);
};

exports.deleteCastMember = function(id, res) {
  var query = "DELETE FROM `cast` WHERE id=" + id + ";";
  makeQuery(res, query, "Model Deleted", 204);
};

exports.deleteEvent = function(id, res) {
  var query = "DELETE FROM `shows` WHERE id=" + id + ";";
  makeQuery(res, query, "Event Deleted", 204);
};

var makeQuery = function(res, query, result, statusCode) {
  dbConnection.query(query, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      sendResponse(res, result, statusCode);
    }
  });
};

