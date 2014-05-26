var server = io.connect('/linedance');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });


var width = Math.max(960, innerWidth), //640
    height = Math.max(500, innerHeight); //480

var throttledUpdate = _.throttle(function(optiFlowData) {
      // if(optiFlowData.zones.length > 1000) {

        var circles = circle.data(optiFlowData.zones);//, function(d,i){return (d[i].x + "x" + d[i].y);});

              circles.enter()
              .append('circle')
              .attr('width', 10)
              .attr('height', 15)
              .attr("cx", function(d) {return d.x * width / 640;})
              .attr("cy", function(d) {return d.y * height / 480;})
              .attr("r", function(d) { return Math.max(0.3, (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))));});


        circles//.data(optiFlowData.zones, function(d,i){return (d[i].x + "x" + d[i].y);})
          .transition()
          .duration(700)
          .attr("cx", function(d) {return d.x * width / 640;})
          .attr("cy", function(d) {return d.y * height / 480;})
          .attr("r", function(d) { return Math.max(0.3, (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))));})
          .style("stroke", "green") //d3.hsl((i = (i + 1) % 360), 1, .5)
          .style("stroke-opacity", 1);

          circles.exit()
                 .transition()
                 .duration(700)
                 .remove();
      // }
}, 200);


server.on('optiFlowData', function(data){
  console.log(data.zones);
  throttledUpdate(data);
});

// var init = [];
// init.length = 1036;

// var i = 0;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// svg.append("rect")
//     .attr("width", width)
//     .attr("height", height)
//     .on(("ontouchstart" in document ? "touchmove" : "mousemove"), particle);

var circle = svg.selectAll("circle");
//    .data(init)
//    .enter()
//    .append('circle')
//    .attr("width", 10)
//    .attr("height", 15)
//    .attr("cx", 400)
//    .attr("cy", 400)
//    .attr("r", 5);

// var particle = function (dataPoint) {
//   console.log(dataPoint);
  
// };
