var url = require('url');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.sendResponse = sendResponse = function(res, object, statusCode, contentType) {
  statusCode = statusCode || 200;
  contentType = contentType || 'application/json';
  object = (typeof object === 'string') ? object : JSON.stringify(object);
  headers["content-type"] = contentType;
  res.writeHead(statusCode, headers);
  res.end(object);
};

exports.processPost = processPost = function(req, cb) {
  var data = "";
  req.on("data", function(chunk) {
    data += chunk;
  });
  req.on("end", function() {
    cb(JSON.parse(data));
  });
};
