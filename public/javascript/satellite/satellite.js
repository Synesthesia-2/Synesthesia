var server = io.connect('/satellite');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

var width = Math.max(260, innerWidth), //640
    height = Math.max(260, innerHeight); //480

var projectionParams = {
  distance: 1.1,
  scale: 6500,
  rotate: [76.00, -34.50, 32.12],
  center: [-2, 5],
  tilt: 25,
  prevTilt:0,
  clipAngle: (Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6),
  precision: .1
};



var projection = d3.geo.satellite()
    .distance(1.1)
    .scale(6500)
    .rotate([76.00, -34.50, 32.12])
    .center([-2, 5])
    .tilt(25)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);
/////////


var projection2 = d3.geo.satellite()
    .distance(1.1)
    .scale(6500)
    .rotate([76.00, -34.50, 32.12])
    .center([-4, 2])
    .tilt(25)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);


var projection3 = d3.geo.satellite()
    .distance(1.1)
    .scale(6500)
    .rotate([76.00, -34.50, 32.12])
    .center([-4, 2])
    .tilt(23)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);

var projection4 = d3.geo.satellite()
    .distance(1.1)
    .scale(6500)
    .rotate([76.00, -34.50, 32.12])
    .center([-4, 2])
    .tilt(11)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);


//////

var makeProjPath = function(uVect, vVect) {
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

var makeProjPath2 = function(projParams) {
  var projection = d3.geo.satellite()
    .distance(projParams.distance)
    .scale(projParams.scale)
    .rotate(projParams.rotate)
    .center(projParams.center)
    .tilt(projParams.tilt)
    .clipAngle(projParams.clipAngle)
    .precision(projParams.precision);

  return d3.geo.path()
    .projection(projection);
}

var tiltProjPath = function() {
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
};

var graticule = d3.geo.graticule()
    .extent([[-93, 27], [-47 + 1e-6, 57 + 1e-6]])
    .step([1, 1]);

var path = d3.geo.path()
    .projection(projection);

var path2 = d3.geo.path()
    .projection(projection2);

var path3 = d3.geo.path()
    .projection(projection3);

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



var nextMove = function () {

    // var uSim = (Math.random() - 0.5) * 5;
    // var vSim = (Math.random() - 0.5) * 5;
    var nextPath;
    var globe = d3.select(this);
    // console.log(globe.attr("stroke"))
    // globe.attr("stroke", 'red');
    // console.log(globe);
    if(projectionParams.prevTilt !== projectionParams.tilt) {
      console.log("tilting!")
      projectionParams.prevTilt = projectionParams.tilt;
      nextPath = makeProjPath2(projectionParams);
      globe
        .transition()
        .duration(200)
        // .attr("opacity", 0.2)
        // .transition()
        // .duration(10)
        .attr("d", nextPath)
        // .transition()
        // .duration(2000)
        // .attr("opacity", 0.9)
        // .transition()
        // .duration(1000)
        // .attr("opacity", 0.3)
        .each("end", nextMove)

    } else {
      console.log(projectionParams.center, 'center');
      nextPath = makeProjPath2(projectionParams);
      globe
        .transition()
        .duration(3000)
        .attr("d", nextPath)
        .each("end", nextMove)
    }



    // globe
    // .transition()
    // .duration(3000)
    // .attr("d", nextPath)
    // .each("end", nextMove)

    // this
    // console.log(node);
    // debugger;
}
d3.select("path")
    .transition()
    .duration(500)
    .attr("d", path2) //move center
    // .transition()
    // .duration(500)
    // .attr("opacity", 0.5) //fade out

    ////////
    // .transition()
    // .duration(1000)
    // // .attr("class", "na")
    // .attr("d", path3) //tilt
    // // .transition()
    // // .duration(500)
    // // .attr("opacity", 1) //fade in
    
    // .transition()
    // .duration(500)
    // // .attr("opacity", 0.3) //fade out
    // // .transition()
    // // .duration(10)
    // // .attr("class", "na")
    // .attr("d", path4) //tilt
    // .transition()
    // .duration(500)
    // .attr("opacity", 1) //fade in

   ////////
    .each("end", nextMove);




    // .transition()
    // .duration(1000)
    // .attr("opacity", 0.2)
    // .transition()
    // .duration(1000)
    // .attr("opacity", 1)
    // .attr("d", path4);
    // .attr("class", "graticule")



var throttledUpdate = _.throttle(function(optiFlowData) {
      // console.log('u,v',optiFlowData.u, optiFlowData.v)
    // var path = makeProjPath(optiFlowData.u, optiFlowData.v);
    // d3.select("path")
    // .transition()
    // .duration(300)
    // .attr("d", path)
    if (!optiFlowData) {
        console.log("no data!!!!");
    } else {
        console.log(optiFlowData.u, optiFlowData.v, "data in")
    };
    var threshold = 0.01;
    if( Math.random() < threshold ) {
        var tiltScale = (Math.random() - 0.5) * 7;
        projectionParams.tilt += tiltScale;
    } 
    else {
        console.log("centershift");
        if ((Math.abs(optiFlowData.u) > 0.3 ||  Math.abs(optiFlowData.v) > 0.3 )){
            var scaledU = optiFlowData.u * 2;
            var scaledV  = optiFlowData.v * 2;
            projectionParams.center = [scaledU, scaledV];
        } else {
            // projectionParams.center = [Math.random() * 5, Math.random() * 5]
            projectionParams.center[0] += 0.05;
            projectionParams.center[1] += 0.05;
        }
    }
    // nextMove();

}, 100);


server.on('optiFlowData', throttledUpdate);
d3.select(self.frameElement).style("height", height + "px");