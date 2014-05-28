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
svg.append("text");

var foneVisualize = function(acceleration){
  var bars = d3.select("rect");
  var text = d3.select("text");

  var zFilter = function(inputData, previousValue){
    var z = 0.9; // set this between 0 and 1
    return (z*previousValue + (1-z)*inputData);
  };

  var prevHeight = bars.attr("height");
  var nextHeight = zFilter(acceleration,prevHeight);
  var displayText = (nextHeight >= HEIGHT) ? "MAX SHAKES!!!1" : Math.floor(nextHeight) + " shakes!";


  bars
    .transition()
    .duration(100)
    .attr("x", 0)
    .attr("y", HEIGHT - nextHeight)
    .attr("height", nextHeight)
    .attr("width", WIDTH)
    .style("fill", function(d,i){return "hsl(" + (nextHeight/HEIGHT*360) + ",100%,50%)";});

  text
    .transition()
    .duration(100)
    .attr("x", WIDTH / 2)
    .attr("y", HEIGHT / 2)
    .text(displayText)
    .attr("font-size", "48px")
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("fill", "white");
};

server.on('motionData', function(data){
  // console.log("Orientation Data: " + (data)); // for testing purposes
  shakeData += data;
});

server.on('orientationData', function(data){
  // console.log("Orientation Data: " + JSON.stringify(data)); // for testing purposes
});

setInterval(function(){
  foneVisualize(shakeData);
  shakeData = 0;
}, 100);