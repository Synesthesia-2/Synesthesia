(function(){
  var server = io.connect('/linedance');
  server.on('welcome', function (data) {
      console.log('welcomed', data);
    });

  window.visualizer  = {};
  var visualizer = window.visualizer;

  visualizer.settings = {
    width: Math.max(960, window.innerWidth),
    height: Math.max(500, window.innerHeight),
    inputWidth: 640,
    inputHeight: 480,
    dropDuration: 1500
  };

  visualizer.svg = d3.select("body").append("svg")
      .attr("width", visualizer.settings.width)
      .attr("height", visualizer.settings.height);

  visualizer.circleVisualize = function(optiFlowData) {
    var hslFactor = 15;

    // Key function ensures data-join updates proper elements.
    var circles = visualizer.svg.selectAll('circle').data(optiFlowData.zones, function(d,i){return (d.x + "x" + d.y);});

    circles
      .attr("r", 0)
      .style("stroke-opacity", 1)
      .attr("cx", function(d) {return d.x * visualizer.settings.width / visualizer.settings.inputWidth;})
      .attr("cy", function(d) {return d.y * visualizer.settings.height / visualizer.settings.inputHeight;})
      .transition()
      .duration(visualizer.settings.dropDuration)
      .attr("r", function(d) { return (3 * (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))));})
      .style("stroke", function(d,i){return "hsl(" + hslFactor*(d.u+d.v) + ",100%,50%)";})
      .style("stroke-opacity", 0);

    circles.enter()
      .append('circle')
      .attr("cx", function(d) {return d.x * visualizer.settings.width / visualizer.settings.inputWidth;})
      .attr("cy", function(d) {return d.y * visualizer.settings.height / visualizer.settings.inputHeight;})
      .attr("r", 0)
      .style("stroke", "green")
      .style("stroke-opacity", 1)
      .transition()
      .duration(visualizer.settings.dropDuration)
      .attr("r", function(d) { return (3 * (Math.sqrt(Math.pow(d.u, 2) + Math.pow(d.v, 2))));})
      .style("stroke-opacity", 0);
  };

  server.on('optiFlowData', function(data){
    visualizer.circleVisualize(data);
  });
})();

