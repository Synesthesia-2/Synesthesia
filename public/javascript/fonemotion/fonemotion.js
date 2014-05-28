var server = io.connect('/fonemotion');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

var WIDTH = Math.max(960, innerWidth), //640
    HEIGHT = Math.max(500, innerHeight); //480

var shakeData = 0;

var svg = d3.select("body").append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

svg.append("rect");

var foneVisualize = function(acceleration){
  var bars = d3.select("rect");

  // this will smoothen the visualization so its not choppy when acceleration differs greatly. 
  var zFilter = function(inputData, previousValue){
    var z = 0.9; // set this between 0 and 1
    return (z*previousValue + (1-z)*inputData);
  };

  var prevHeight = bars.attr("height");
  var nextHeight = zFilter(acceleration,prevHeight);

  bars
    .attr("x", 0)
    .attr("y", HEIGHT - nextHeight)
    .attr("height", nextHeight)
    .attr("width", WIDTH)
    .style("fill", function(d,i){return "hsl(" + nextHeight + ",100%,50%)";});
};

server.on('motionData', function(data){
  // console.log("Orientation Data: " + (data)); // for testing purposes
  // foneVisualize(data);
  shakeData += data;
});

server.on('orientationData', function(data){
  console.log("Orientation Data: " + JSON.stringify(data)); // for testing purposes
});

setInterval(function(){
  foneVisualize(shakeData);
  // console.log("Total shakes: " + shakeData);
  shakeData = 0;
}, 100);