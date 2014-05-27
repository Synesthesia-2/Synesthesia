var server = io.connect('/linedance');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });


var width = Math.max(960, innerWidth), //640
    height = Math.max(500, innerHeight); //480

var throttledUpdate = _.throttle(function(optiFlowData) {
      var linedata = reformatOptiFlowZones(optiFlowData);
      if(linedata.length > 100) {
        line.data(linedata)
          .transition()
          .duration(700)
          .attr("x1", function(d) {return d.x * width / 640})
          .attr("y1", function(d) {return d.y * height / 480})
          .attr("x2", function(d) {return d.xPrime * width / 640})
          .attr("y2", function(d) {return d.yPrime * height / 480})
          .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
          .style("stroke-opacity", 1)


      }
}, 200);

var reformatOptiFlowZones = function (optiFlowData) {
  var zones = optiFlowData.zones;
  var lineCoords = [];
  _.each(zones, function(zone) {
    zone.xPrime = zone.x + 3*zone.u;
    zone.yPrime = zone.y + 3*zone.v;
  });
  return zones;
}


server.on('optiFlowData', throttledUpdate);

var init = [];
init.length = 1036;

var i = 0;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .on(("ontouchstart" in document ? "touchmove" : "mousemove"), particle);

var line = svg.selectAll("line")
   .data(init)
   .enter()
   .append('line')
   // .attr("width", 10)
   // .attr("height", 15)
   // .attr("cx", 400)
   // .attr("cy", 400)
   // .attr("r", 5)

var particle = function (dataPoint) {
  console.log(dataPoint);
  
}
