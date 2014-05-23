var server = io.connect('/linedance');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });


var throttledUpdate = _.throttle(function(optiFlowData) {
      if(optiFlowData.zones.length > 1000) {
        circle.data(optiFlowData.zones)
          .transition()
          .duration(100)
          .attr("cx", function(d) {return d.x})
          .attr("cy", function(d) {return d.y})
          .attr("r", function(d) { return Math.max(0.1, (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))))})
          .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
          .style("stroke-opacity", 1)
      }
}, 50);


server.on('optiFlowData', throttledUpdate);

var width = Math.max(960, innerWidth),
    height = Math.max(500, innerHeight);

var init = [];
init.length = 1036;

var i = 0;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .on("ontouchstart" in document ? "touchmove" : "mousemove", particle);

var circle = svg.selectAll("circle")
   .data(init)
   .enter()
   .append('circle')
   .attr("width", 10)
   .attr("height", 15)
   .attr("cx", 400)
   .attr("cy", 400)

var particle = function (dataPoint) {
  console.log(dataPoint);
  
}
