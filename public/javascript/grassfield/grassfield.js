var server = io.connect('/linedance');
  server.on('welcome', function (data) {
  console.log('welcomed', data);
});

var width = Math.max(960, innerWidth), //640
    height = Math.max(500, innerHeight); //480

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// var reformatOptiFlowZones = function (optiFlowData) {
//   var zones = optiFlowData.zones;
//   var scalingFactor = 3;
//   _.each(zones, function(zone) {
//     zone.xPrime = zone.x + scalingFactor*zone.u;
//     zone.yPrime = zone.y + scalingFactor*zone.v;
//   });
//   return zones;
// };

var update = function(optiFlowData){

  var lineHeight = 0;
  var randomFactor = 16;
  var transitionTime = 300;
  var linedata = (optiFlowData.zones);
  // var linedata = reformatOptiFlowZones(optiFlowData);
  // console.log("length: ", optiFlowData.zones.length);
  // console.log("first point: ", linedata[0]);

  var line = svg.selectAll("line")
     .data(linedata, function(d,i) { return (d.x + "x" + d.y);});

      line
        .transition()
        .duration(transitionTime)
        .attr("x1", function(d) {return d.x * width / 640;})
        .attr("y1", function(d) {return d.y * height / 480;})
        .attr("x2", function(d) {return (d.x - d.u) * width / 640;})
        .attr("y2", function(d) {return (d.y - lineHeight - d.v) * height / 480;})
        .style("stroke", "green")
        .transition()
        .duration(transitionTime)
        .attr("x2", function(d) {return d.x * width / 640;})
        .attr("y2", function(d) {return (d.y - lineHeight) * height / 480;})
        .style("stroke", "red"); //d3.hsl((i = (i + 1) % 360), 1, .5)
        // .style("stroke-opacity", 1);

      line.enter()
        .append('line')
        .transition()
        .duration(transitionTime)
        .attr("x1", function(d) {return d.x * width / 640;})
        .attr("y1", function(d) {return d.y * height / 480;})
        .attr("x2", function(d) {return d.x * width / 640;})
        .attr("y2", function(d) {return (d.y - lineHeight) * height / 480;})
        .style("stroke", "red"); //d3.hsl((i = (i + 1) % 360), 1, .5)
        // .style("stroke-opacity", 1);
};

var makeDummyData = function(xrange, xstep, ydomain, ystep){
  var output = [];
  for (var i=0; i<xrange; i+=xstep){
    for (var j=0; j<ydomain; j+=ystep){
      output.push({x:i,y:j});
    }
  }
  return output;
};

var randomMovement = function(transitionTime, inputData){

  inputData = inputData || realData;
  transitionTime = transitionTime || 2000;
  var lineHeight = 25;
  var randomFactor = 9;

  inputData = inputData.zones ? inputData.zones: inputData;
  console.log(inputData.length);
  
  var line = svg.selectAll("path").data(inputData, function(d){return d.x + "x" + d.y;});

      line
        .transition()
        // .duration(function(){return Math.random()*transitionTime;})
        .duration(transitionTime/2)
        .ease('elastic')
        .attr("d", function(d){
          var randomFactor = 5;
          var rf = randomFactor*(Math.random() - 0.5);
          var path = "";
          path += "M" + d.x * width / 640 + "," + d.y * height / 480;
          path += " Q" + (d.x - lineHeight/8) * width / 640 + "," + (d.y - lineHeight/4) * height / 480;
          path += " " + (d.x - rf/2) * width / 640 + "," + (d.y - lineHeight/2) * height / 480;
          path += " T" + (d.x - d.u - rf) * width / 640 + "," + (d.y - lineHeight) * height / 480;
          return path;
        })
       .style("stroke", function(d,i){return "hsl(" + 15*(d.u+d.v) + ",100%,50%)";});
       // .each("end", function(){

       // });

      line.enter()
        .append('path')
        .transition()
        .duration(transitionTime/2)
        .attr("d", function(d){
          var rx = 1*(Math.random() - 0.5);
          var path = "";
          path += "M" + (d.x + rx) * width / 640 + "," + d.y * height / 480;
          path += " Q" + (d.x - lineHeight/8) * width / 640 + "," + (d.y - lineHeight/4) * height / 480;
          path += " " + (d.x) * width / 640 + "," + (d.y - lineHeight/2) * height / 480;
          path += " T" + (d.x) * width / 640 + "," + (d.y - lineHeight) * height / 480;
          return path;
        })
        .style("stroke", "white") 
       .each("end", randomMovement);
 
};

var realData = [];
// var dummydata = makeDummyData(800,16,500,20);
var transitionTime = 200;

setInterval(function(){randomMovement(transitionTime);}, transitionTime);

server.on('optiFlowData', function(data){
  realData = data;
});
