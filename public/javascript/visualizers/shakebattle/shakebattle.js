var server = io.connect('/shakebattle');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

// Set window parameters
var WIDTH = innerWidth;
var HEIGHT = innerHeight;

// This will hold the sum of all acceleration data coming in
var shakeBalance = 0;
// This will hold the current 'balance'
var currentBalance = 0;

var svg = d3.select("body").append("svg")
    .style("background-color", "black")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);
  svg.append("rect");
  svg.append("text");

// This function smoothes out the jitteriness of transitioning between very 
// different scores. Set 'z' higher for more smoothing, and lower for less effect
var zFilter = function(inputData, previousValue){
  var z = 0.9; // set this between 0 and 1
  return (z*previousValue + (1-z)*inputData);
};


var shakeBattleVisualize = function(balance){
  var bars = d3.select("rect");
  var text = d3.select("text");

  var DIFFICULTY = 2; // Increase this to make shakes count for less

  // Get previous height value and flip sign if negative shakes were winning.
  // var prevHeight = bars.attr("y") < (HEIGHT/2) ? -1*(bars.attr("height")) : bars.attr("height");
  balance = balance / DIFFICULTY;
  // var nextHeight = zFilter(balance,prevHeight);

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

  var displayText = (Math.abs(balance) >= HEIGHT/2) ? "MAX SHAKES!!!!" : Math.floor(balance) + " shakes!";

  // This is for selecting the 'smacktalk' to be displayed
  var percent = Math.floor(10 * Math.abs(balance)/(HEIGHT/2));
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
    .attr("y", (HEIGHT / 2) + Math.min(0, balance))
    .attr("height", Math.abs(balance))
    .attr("width", WIDTH)
    .style("fill", function(d,i){return "hsl(" + (balance/HEIGHT*360) + ",100%,50%)";});

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

server.on('audienceMotionData', function(data){
  // checks for sign of beta
  var shakeSign = data.totalAcc * ((data.beta > 0) - (data.beta < 0)); 
  shakeBalance += shakeSign;
});

setInterval(function(){
  currentBalance = Math.floor(zFilter(shakeBalance, currentBalance));
  shakeBattleVisualize(currentBalance);
}, 100);