var server = io.connect('/satellite');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

var width = Math.max(960, innerWidth), //640
    height = Math.max(960, innerHeight); //480

var projection = d3.geo.satellite()
    .distance(1.1)
    .scale(6500)
    .rotate([76.00, -34.50, 32.12])
    .center([-2, 5])
    .tilt(25)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);

var projection2 = d3.geo.satellite()
    .distance(1.1)
    .scale(6500)
    .rotate([76.00, -34.50, 32.12])
    .center([-4, 2])
    .tilt(25)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);


// var projection3 = d3.geo.satellite()
//     .distance(1.1)
//     .scale(6500)
//     .rotate([76.00, -34.50, 32.12])
//     .center([2, 2])
//     .tilt(24)
//     .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
//     .precision(.1);

var projection4 = d3.geo.satellite()
    .distance(1.1)
    .scale(6500)
    .rotate([76.00, -34.50, 32.12])
    .center([-4, 2])
    .tilt(25)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);
    
var makeProjectionPath = function(uVect, vVect) {
  var projection = d3.geo.satellite()
    .distance(1.1)
    .scale(6500)
    .rotate([76.00, -34.50, 32.12])
    .center([3 * uVect, 3 * vVect])
    .tilt(25)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);

  return d3.geo.path()
    .projection(projection);
}

var graticule = d3.geo.graticule()
    .extent([[-93, 27], [-47 + 1e-6, 57 + 1e-6]])
    .step([3, 3]);

var path = d3.geo.path()
    .projection(projection);

var path2 = d3.geo.path()
    .projection(projection2);

// var path3 = d3.geo.path()
//     .projection(projection3);

var path4 = d3.geo.path()
    .projection(projection4);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

//get oflow data
//u, v typically [-1.5, 1.5]
// make a new projection with updated center
//transition


// d3.select("path")
//     .transition()
//     .duration(3000)
//     .attr("d", path2)
//     .transition()
//     .duration(3000)
//     .attr("d", path)
//     .transition()
//     .duration(1000)
//     .attr("d", path4);



var throttledUpdate = _.throttle(function(optiFlowData) {
      // console.log('u,v',optiFlowData.u, optiFlowData.v)
    var path = makeProjectionPath(optiFlowData.u, optiFlowData.v);
    d3.select("path")
    .transition()
    .duration(300)
    .attr("d", path)

}, 200);


server.on('optiFlowData', throttledUpdate);
d3.select(self.frameElement).style("height", height + "px");