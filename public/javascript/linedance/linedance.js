var server = io.connect('/linedance');

server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

server.on('optiFlowData', function(optiFlowData) {
  
    // var circles = 
    //     .data(optiFlowData.zones)
    //     .enter()
    //     .append("circle");
        // .attr("cx", function(d) { console.log("d",d);return d.x})
        // .attr("cy", function(d) {return d.y})
        // .attr("r", function(d) { return Math.max(0.01, (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))))})
        // .style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
        // .style("stroke-opacity", 1)
      circle.data(optiFlowData.zones)
      // .transition()
        // .duration(2000)
        // .ease(Math.sqrt)
        .attr("cx", function(d) { console.log("d",d);return d.x})
        .attr("cy", function(d) {return d.y})
        .attr("r", function(d) { return Math.max(0.01, (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))))})
        .style("stroke", d3.hsl((i = (i + 1) % 360), 1, .5))
        .style("stroke-opacity", 1)
        // .attr("r", function(d) {console.log("!!!", (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2)))); return Math.max(0.01, (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))))})
        // .style("stroke-opacity", 1e-6)
        // .remove();

  
})


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
