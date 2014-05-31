var server = io.connect('/spotlights');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

var WIDTH = Math.max(960, innerWidth); //640
var HEIGHT = Math.max(500, innerHeight); //480

var spotlightsData = {};

var svg = d3.select("body").append("svg")
    .style("background-color", "black")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

var showSpotlights = function(inputData){

  inputData = d3.entries(inputData);

  var xOrigin = WIDTH / 2;
  var yOrigin = HEIGHT / 2;
  var xScaleFactor = WIDTH  / 90;
  var yScaleFactor = HEIGHT / 90;
  var lights = svg.selectAll("circle")
      .data(inputData, function(d){ return d.key; });

  lights
    .transition()
    .duration(200)
    .attr("r", 50)
    .attr("cx", function(d){return (xOrigin + d.value.beta * xScaleFactor);})
    .attr("cy", function(d){return (yOrigin - d.value.gamma * yScaleFactor);});

  lights
    .enter()
    .append("circle")
    .transition()
    .duration(200)
    .attr("r", 100)
    .attr("cx", function(d){return (xOrigin + d.value.beta * xScaleFactor  );})
    .attr("cy", function(d){return (yOrigin - d.value.gamma * yScaleFactor);})
    // .style("fill", "white")
    .style("fill", function(d){return "hsl(" + Math.random()*360 + ",100%,50%)";})
    .style("stroke-opacity", 0.7);

  lights
    .exit()
    .remove();
};

server.on('motionData', function(data){
  if (data.id){ spotlightsData[data.id] = data; }
});

server.on('foneDisconnect', function(id){
  console.log("User " + id + " ran out of batteries.");
  console.log(spotlightsData.length + " users still shining.")
  delete spotlightsData[id];
});

setInterval(function(){
  showSpotlights(spotlightsData);
}, 50);