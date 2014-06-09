jQuery(function($) {
  var server = io.connect('/iris');
  server.on('welcome', function (data) {
      console.log('welcomed', data);
    });

  // Set window parameters
  var WIDTH = innerWidth;
  var HEIGHT = innerHeight;

  // Increase this to make shakes count for less. Default is 1.
  var SENSITIVITY = 50;

  // This is the minimum value that the iris will contract to, even without any motion. (written as a decimal percentage)
  var MINIMUMRADIUS = 0.05;
  var minR = MINIMUMRADIUS * WIDTH;

  // This will hold the sum of all incoming acceleration data
  var shakeData = 0;
  // This will hold the current value, which is just a snapshot of shakeData
  var currentValue = 0;

  var svg = d3.select("body").append("svg")
      .style("background-color", "black")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);
    svg.append("circle")
      .attr("cx", WIDTH / 2)
      .attr("cy", HEIGHT / 2);

  // This function smoothes out the jitteriness of transitioning between very
  // different scores. Set 'z' higher for more smoothing, and lower for less effect
  var zFilter = function(inputData, previousValue){
    var z = 0.9; // set this between 0 and 1
    return (z*previousValue + (1-z)*inputData);
  };

  var irisExpand = function(score){

    var bars = d3.select("circle");

    bars
      .transition()
      .duration(100)
      .attr("r", minR + score)
      .style("fill", "white");
  };

  server.on('audienceMotionData', function(data){
    shakeData += data.totalAcc;
  });

  setInterval(function(){
    shakeData = Math.floor(shakeData * SENSITIVITY);
    currentValue = Math.floor(zFilter(shakeData, currentValue));
    irisExpand(currentValue);
    // Reset shakeData to 0, otherwise meter will keep growing
    shakeData = 0;
  }, 50);
});
