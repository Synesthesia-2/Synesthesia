var server = io.connect('/spotlights');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

var WIDTH = Math.max(960, innerWidth); //640
var HEIGHT = Math.max(500, innerHeight); //480
var spotlightsData = {};
var svg = d3.select("body").append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

var showSpotlights = function(inputData){

  inputData = d3.entries(inputData);

  console.log(JSON.stringify(inputData));
  var lights = svg.selectAll("circle")
      .data(inputData, function(d){ return d.key; });

  lights
    .transition()
    .duration(200)
    .attr("r", 10)
    .attr("cx", function(d){return (d.value.gamma);})
    .attr("cy", function(d){return (d.value.beta);})
    .style("stroke", function(d){return "hsl(" + 15 + ",100%,50%)";})
    .style("stroke-opacity", 0.5);

  lights
    .enter()
    .append("circle")
    .transition()
    .duration(200)
    .attr("r", 10)
    .attr("cx", function(d){return (d.value.gamma);})
    .attr("cy", function(d){return (d.value.beta);})
    .style("stroke", function(d){return "hsl(" + 15 + ",100%,50%)";})
    .style("stroke-opacity", 0.5);

  // lights
  //   .exit()
  //   .remove();

};

server.on('motionData', function(data){
  spotlightsData[data.id] = {
    alpha: data.alpha,
    beta: data.beta,
    gamma: data.gamma
  };
  // console.log("id: " + data.id + ", data: " + JSON.stringify(spotlightsData[data.id]));
});

setInterval(function(){
  showSpotlights(spotlightsData);
}, 100);