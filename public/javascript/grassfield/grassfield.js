var server = io.connect('/linedance');
  server.on('welcome', function (data) {
  console.log('welcomed', data);
});

var width = Math.max(960, innerWidth), //640
    height = Math.max(500, innerHeight); //480

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var reformatOptiFlowZones = function (optiFlowData) {
  var zones = optiFlowData.zones;
  var scalingFactor = 3;
  _.each(zones, function(zone) {
    zone.xPrime = zone.x + scalingFactor*zone.u;
    zone.yPrime = zone.y + scalingFactor*zone.v;
  });
  return zones;
};

var update = function(optiFlowData){

  var lineHeight = 10;
  var randomFactor = 16;
  var transitionTime = 300;

  var linedata = reformatOptiFlowZones(optiFlowData);
  console.log("length: ", optiFlowData.zones.length);
  console.log("first point: ", optiFlowData.zones[0]);

  var line = svg.selectAll("line")
     .data(linedata, function(d,i) { return (d.x + "x" + d.y);});

      line
        .transition()
        .duration(transitionTime)
        .attr("x1", function(d) {return d.x * width / 640;})
        .attr("y1", function(d) {return d.y * height / 480;})
        .attr("x2", function(d) {return (d.x + d.u) * width / 640;})
        .attr("y2", function(d) {return (d.y - lineHeight + d.v) * height / 480;})
        .style("stroke", "green")
        .transition()
        .duration(transitionTime)
        .attr("x2", function(d) {return (d.x + (Math.random() - 0.5)*randomFactor) * width / 640;})
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

var randomMovement = function(){

  var lineHeight = 10;
  var randomFactor = 16;

  // var linedata = reformatOptiFlowZones(optiFlowData);
  
  var line = svg.selectAll("line");
     // .data(linedata, function(d,i) { return (d.x + "x" + d.y);});
      line
        .transition()
        .duration(function(){return Math.random()*500;})
        .attr("x2", function(line) {return (line.x + (Math.random() - 0.5)*randomFactor) * width / 640;})
        .attr("y2", function(line) {return (line.y - lineHeight) * height / 480;});
        // .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
        // .style("stroke-opacity", 1);
};



// d3.timer(randomMovement, 500);

server.on('optiFlowData', update);
