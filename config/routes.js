exports.inputRoutes = [
  'conductor',
  'fireworks',
  'audio',
  'opticalFlow',
  'fone',
  'dancer',
  'update',
];

exports.renderView = function (req, res, views) {
  var requestedView = req.url.slice(1);
  if (views) {
    // Check if route matches one gathered from visualizer config.json files
    for (var i = 0; i < views.length; i++) {
      var view = views[i];
      if (view.name === requestedView){
        res.render("default", {
          extraJS: view.extraJS,
          extraStyl: view.extraStyl
        });
        console.log("Served /" + requestedView);
        return;
      }
    }
    // ...or, if it matches one of the data inputs
    for (var j = 0; j < exports.inputRoutes.length; j++) {
      var inputView = exports.inputRoutes[j];
        console.log(exports.inputRoutes);
        // console.log(requestedView);
      if (inputView === requestedView){
        res.render(requestedView);
        console.log("Served /" + requestedView);
        return;
      }
    }
  } 
  // If neither, then end with a 404
  exports.render404(req, res);
  console.log("404: /" + requestedView + " is not a valid route.");
};

exports.renderClient = function(req, res){
  res.render('client');
};

exports.render404 = function(req, res){
  res.writeHead(404);
  res.end("That page doesn't exist. Go to a page that exists.");
};
