exports.renderClient = function(req, res){
  res.render('../views/client');
};

exports.renderConductor = function(req, res){
  res.render('../views/conductor');
};

exports.renderFireworks = function(req, res){
  res.render('../views/fireworks');
};

exports.renderAudio = function(req, res){
  res.render('../views/audio');
};

exports.renderDancer = function(req, res){
  res.render('../views/dancer');
};

exports.renderUpdate = function(req, res){
  res.render('../views/update');
};
