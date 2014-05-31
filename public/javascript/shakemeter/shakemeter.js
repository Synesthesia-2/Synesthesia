var server = io.connect('/shakemeter');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

var WIDTH = Math.max(960, innerWidth); //640
var HEIGHT = Math.max(500, innerHeight); //480

var shakeData = 0;
var hiScore = 0;

var svg = d3.select("body").append("svg")
    .style("background-color", "black")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

svg.append("rect");
svg.append("text").attr("id", "maintext");
svg.append("text").attr("id", "score");

var foneVisualize = function(acceleration){
  var bars = d3.select("rect");
  var text = d3.select("#maintext");
  var scoretext = d3.select("#score");

  var zFilter = function(inputData, previousValue){
    var z = 0.9; // set this between 0 and 1
    return (z*previousValue + (1-z)*inputData);
  };

  // Insert your favorite shake-messages here. The key corresponds to 
  // how much of the shakometer is filled.
  var labels = {
    0: "So weak.",
    1: "Do you even shake bro?",
    2: "Warm up then come back.",
    3: "D+",
    4: "Okay, not bad.",
    5: "Legit shaker!",
    6: "Crushing it!",
    7: "Beast!!",
    8: "DANGER: Approching shakebuffer limit!!",
    9: "DANGER: Way too many shakes!!!",
    10: "SHAKE OVERLOAD!SHAKE OVERLOAD!SHAKE OVERLOAD!"
  };

  var DIFFICULTY = 1; // Increase this to make shakes count for less

  var prevHeight = bars.attr("height");
  acceleration = acceleration / DIFFICULTY;
  var nextHeight = Math.floor(zFilter(acceleration,prevHeight));
  
  // set text to be displayed
  var displayText = (nextHeight >= HEIGHT) ? "MAX SHAKES!!!!" : nextHeight + " shakes";
  hiScore = (nextHeight > hiScore) ? nextHeight : hiScore;

  // This is for selecting the 'smacktalk' to be displayed
  var percent = Math.floor(10 * nextHeight/HEIGHT);
  var maxlabel = Math.max(Object.keys(labels));
  var subText;
  if (percent > maxlabel){
    subText = labels[maxlabel];
  } else {
    subText = labels[percent] || "";
  }

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

  scoretext
    .transition()
    .duration(100)
    .attr("x", WIDTH * 0.75)
    .attr("y", HEIGHT * 0.25)
    .text("HiScore: " + hiScore)
    .attr("font-size", "48px")
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("fill", "white");
};

server.on('motionData', function(data){
  shakeData += data.totalAcc;
});

setInterval(function(){
  foneVisualize(shakeData);
  shakeData = 0;
}, 100);