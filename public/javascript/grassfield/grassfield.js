var server = io.connect('/linedance');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });


var width = Math.max(960, innerWidth), //640
    height = Math.max(500, innerHeight); //480

var update = function(optiFlowData){

    var lineHeight = 10;
    var randomFactor = 16;

    var linedata = reformatOptiFlowZones(optiFlowData);
    
    var line = svg.selectAll("line")
       .data(linedata, function(d,i) { return (d.x + "x" + d.y);});

        line
          .transition()
          .duration(300)
          .attr("x1", function(d) {return d.x * width / 640;})
          .attr("y1", function(d) {return d.y * height / 480;})
          .attr("x2", function(d) {return d.xPrime * width / 640;})
          .attr("y2", function(d) {return d.yPrime * height / 480;});
          // .transition()
          // .duration(300)
          // .attr("x2", function(d) {return (d.x + (Math.random() - 0.5)*randomFactor) * width / 640;})
          // .attr("y2", function(d) {return (d.y + lineHeight) * height / 480;});
          // .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
          // .style("stroke-opacity", 1);

        line.enter()
          .append('line')
          .transition()
          .duration(700)
          .attr("x1", function(d) {return d.x * width / 640;})
          .attr("y1", function(d) {return d.y * height / 480;})
          .attr("x2", function(d) {return d.x * width / 640;})
          .attr("y2", function(d) {return (d.y + lineHeight) * height / 480;})
          .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
          .style("stroke-opacity", 1);

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
          .attr("y2", function(line) {return (line.y + lineHeight) * height / 480;});
          // .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
          // .style("stroke-opacity", 1);
};


var reformatOptiFlowZones = function (optiFlowData) {
  var zones = optiFlowData.zones;
  var lineCoords = [];
  var scalingFactor = 2;
  _.each(zones, function(zone) {
    zone.xPrime = zone.x + scalingFactor*zone.u;
    zone.yPrime = zone.y + scalingFactor*zone.v;
  });
  return zones;
};

setInterval(randomMovement, 500);

server.on('optiFlowData', update);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .on(("ontouchstart" in document ? "touchmove" : "mousemove"), particle);

   // .attr("width", 10)
   // .attr("height", 15)
   // .attr("cx", 400)
   // .attr("cy", 400)
   // .attr("r", 5)

var particle = function (dataPoint) {
  console.log(dataPoint);
};
