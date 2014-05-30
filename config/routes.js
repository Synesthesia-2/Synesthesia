exports.renderClient = function(req, res){
  res.render('client');
};

exports.renderConductor = function(req, res){
  res.render('conductor');
};

exports.renderFireworks = function(req, res){
  res.render('fireworks');
};

exports.renderAudio = function(req, res){
  res.render('audio');
};

exports.renderDancer = function(req, res){
  res.render('dancer');
};

exports.renderFlock = function(req, res){
  res.render('flock');
};

exports.renderUpdate = function(req, res){
  res.render('update');
};

exports.renderOptiFlow = function(req, res) {
  res.render('optiflow');
};

exports.renderLineDance = function(req, res) {
  res.render('linedance');
};

exports.renderGrassField = function(req, res) {
  res.render('grassfield');
};

exports.renderFone = function(req, res) {
  res.render('fone');
};

exports.renderFoneMotion= function(req, res) {
  res.render('shakemeter');
};

exports.renderShakeBattle= function(req, res) {
  res.render('shakebattle');
};

exports.renderSpotlights= function(req, res) {
  res.render('spotlights');
};

exports.render404 = function(req, res){
  res.writeHead(404);
  res.end("That page doesn't exist. Go to a page that exists.");
};