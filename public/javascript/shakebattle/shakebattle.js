var server = io.connect('/shakebattle');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

var WIDTH = Math.max(960, innerWidth); //640
var HEIGHT = Math.max(500, innerHeight); //480
var shakeBalance = 0;
var svg = d3.select("body").append("svg")
    .style("background-color", "black")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

svg.append("rect");
svg.append("text");

var shakeBattleVisualize = function(shakedata){
  var bars = d3.select("rect");
  var text = d3.select("text");

  var zFilter = function(inputData, previousValue){
    var z = 0.9; // set this between 0 and 1
    return (z*previousValue + (1-z)*inputData);
  };

  var prevHeight = bars.attr("height");
  var nextHeight = zFilter(shakedata,prevHeight);
  console.log(nextHeight - shakedata);
  var displayText = (Math.abs(nextHeight) >= HEIGHT/2) ? "MAX SHAKES!!!1" : Math.floor(nextHeight) + " shakes!";


  bars
    .transition()
    .duration(100)
    .attr("x", 0)
    .attr("y", (HEIGHT / 2) + Math.min(0, nextHeight))
    .attr("height", Math.abs(nextHeight))
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
  // console.log(data);
  var shakeSign = data.totalAcc * ((data.beta > 0) - (data.beta < 0)); // checks for sign of beta
  // console.log("Orientation Data: " + (shakeSign)); // for testing purposes
  var raw = Math.floor(data.accel.x + data.accel.y + data.accel.z);
  var abs = Math.floor(Math.abs(data.accel.x) + Math.abs(data.accel.y) + Math.abs(data.accel.z));
  shakeBalance += shakeSign;
  // console.log(shakeBalance);
});

server.on('orientationData', function(data){
  // console.log("Orientation Data: " + JSON.stringify(data)); // for testing purposes
});

setInterval(function(){
  shakeBattleVisualize(shakeBalance);
  // server.emit("shakeBalance", shakeBalance);
  // shakeBalance = 0;
}, 100);