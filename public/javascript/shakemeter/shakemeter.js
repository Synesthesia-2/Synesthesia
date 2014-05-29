var server = io.connect('/shakemeter');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

var WIDTH = Math.max(960, innerWidth); //640
var HEIGHT = Math.max(500, innerHeight); //480
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

  // Insert your favorite shake-messages here.
  var labels = {
    0: "So weak.",
    1: "Do you even shake bro?",
    2: "Warm up then come back.",
    3: "D+.",
    4: "Hey, not bad.",
    5: "Legit shaker!",
    6: "Do you do this for a living?",
    7: "Crushing it!!",
    8: "DANGER: shakebuffer almost full!!",
    9: "WARNING: You're breaking the system!!!",
    10: "SHAKE OVERLOAD!SHAKE OVERLOAD!SHAKE OVERLOAD!",
  };

  var prevHeight = bars.attr("height");
  var nextHeight = zFilter(acceleration,prevHeight);
  var displayText = (nextHeight >= HEIGHT) ? "MAX SHAKES!!!1" : Math.floor(nextHeight) + " shakes";
  var subText = labels[Math.floor(10 * nextHeight/HEIGHT)] || "";


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
    .text(subText + " " + displayText)
    .attr("font-size", "48px")
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("fill", "white");
};

server.on('motionData', function(data){
  // console.log("Orientation Data: " + (data)); // for testing purposes
  shakeData += data.totalAcc;
});

server.on('orientationData', function(data){
  // console.log("Orientation Data: " + JSON.stringify(data)); // for testing purposes
});

setInterval(function(){
  foneVisualize(shakeData);
  // server.emit("shakeData", shakeData);
  shakeData = 0;
}, 100);