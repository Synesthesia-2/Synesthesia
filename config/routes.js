var validViews = {
  'conductor': true,
  'fireworks': true,
  'audio': true,
  'opticalFlow': true,
  'linedance': true,
  'grassfield': true,
  'fone': true,
  'shakebattle': true,
  'shakemeter': true,
  'spotlights': true,
  'dancer': true,
  'flock': true,
  'update': true,
  'satellite': true,
  'particles': true,
  'rain': true
};

exports.renderView = function (req, res, views) {
  var requestedView = req.url.slice(1);
  // console.log(req);
  if (views) {
    for (var i = 0; i < views.length; i++) {
      var view = views[i];
      if (view.name === requestedView){
        res.render("default", {
          extraJS: view.extraJS,
          extraStyl: view.extraStyl
        });
      }
    }
  } else {
    render404(req, res);
  }
};

exports.renderClient = function(req, res){
  res.render('client');
};

var render404 = function(req, res){
  res.writeHead(404);
  res.end("That page doesn't exist. Go to a page that exists.");
};

exports.render404 = render404;


// exports.renderConductor = function(req, res){
//   res.render('conductor');
// };

// exports.renderFireworks = function(req, res){
//   res.render('fireworks');
// };

// exports.renderAudio = function(req, res){
//     // console.log(req.route.path.slice(1));
//   res.render('audio');
// };

// exports.renderDancer = function(req, res){
//   res.render('dancer');
// };

// exports.renderFlock = function(req, res){
//   res.render('flock');
// };

// exports.renderUpdate = function(req, res){
//   res.render('update');
// };

// exports.renderOptiFlow = function(req, res) {
//   res.render('optiflow');
// };

// exports.renderLineDance = function(req, res) {
//   res.render('linedance');
// };

// exports.renderGrassField = function(req, res) {
//   res.render('grassfield');
// };

// exports.renderFone = function(req, res) {
//   res.render('fone');
// };

// exports.renderFoneMotion= function(req, res) {
//   res.render('shakemeter');
// };

// exports.renderShakeBattle= function(req, res) {
//   res.render('shakebattle');
// };

// exports.renderSpotlights= function(req, res) {
//   res.render('spotlights');
// };

// exports.renderParticles= function(req, res) {
//   res.render('particles');
// };

// exports.renderSatellite = function(req, res){
//   res.render('satellite');
// };

