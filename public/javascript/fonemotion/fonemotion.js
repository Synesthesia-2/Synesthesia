var server = io.connect('/linedance');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });


var width = Math.max(960, innerWidth), //640
    height = Math.max(500, innerHeight); //480

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var updateData = function(optiFlowData) {

        var circles = svg.selectAll('circle').data(optiFlowData.zones, function(d,i){return (d.x + "x" + d.y);});

        circles//.data(optiFlowData.zones, function(d,i){return (d[i].x + "x" + d[i].y);})
          .attr("r", 0)
          .style("stroke-opacity", 1)
          .attr("cx", function(d) {return d.x * width / 640;})
          .attr("cy", function(d) {return d.y * height / 480;})
          .transition()
          .duration(1500)
          // .attr("r", function(d) { return Math.max(0.3, (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))));})
          .attr("r", function(d) { return (3 * (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))));})
          // .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
          .style("stroke", function(d,i){return "hsl(" + 15*(d.u+d.v) + ",100%,50%)";})
          .style("stroke-opacity", 0);

        circles.enter()
          .append('circle')
          .attr("cx", function(d) {return d.x * width / 640;})
          .attr("cy", function(d) {return d.y * height / 480;})
          .attr("r", 0)
          .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
          .style("stroke-opacity", 1)
          .transition()
          .duration(1500)
          // .attr("r", function(d) { return Math.max(0.3, (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))));})
          .attr("r", function(d) { return (3 * (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))));})
          // .attr("r", 50)
          // .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
          .style("stroke-opacity", 0);
};


server.on('optiFlowData', function(data){
  console.log(data.zones.length);
  updateData(data);
});
