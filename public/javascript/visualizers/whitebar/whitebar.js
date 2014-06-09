jQuery(function($) {
  var server = io.connect('/shakemeter');
  server.on('welcome', function (data) {
      console.log('welcomed', data);
    });

  // Set window parameters
  var WIDTH = innerWidth;
  var HEIGHT = innerHeight;

  // Increase this to make shakes count for more.
  var SENSITIVITY = 35;

  // How frequently to refresh the visualization.
  var INTERVAL = 100;

  // This is the minimum value that the meter will contract to, even without any motion. (written as a decimal percentage)
  var MINIMUMHEIGHT = 0.05;
  var minH = MINIMUMHEIGHT * HEIGHT;

  // This will hold the sum of all incoming acceleration data
  var shakeData = 0;
  // This will hold the current value, which is just a snapshot of shakeData
  var currentValue = 0;

  var svg = d3.select("body").append("svg")
      .style("background-color", "black")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);
    svg.append("rect");

  // This function smoothes out the jitteriness of transitioning between very
  // different scores. Set 'z' higher for more smoothing, and lower for less effect
  var zFilter = function(inputData, previousValue){
    var z = 0.9; // set this between 0 and 1
    return (z*previousValue + (1-z)*inputData);
  };

  var foneVisualize = function(value){
    var bars = d3.select("rect");
    var barHeight = minH + value;

    bars
      .transition()
      .duration(INTERVAL)
      .attr("x", 0)
      .attr("y", HEIGHT - barHeight)
      .attr("height", barHeight)
      .attr("width", WIDTH)
      .style("fill", "white");
  };

  server.on('audienceMotionData', function(data){
    shakeData += data.totalAcc;
  });

  setInterval(function(){
    shakeData = Math.floor(shakeData * SENSITIVITY);
    currentValue = Math.floor(zFilter(shakeData, currentValue));
    foneVisualize(currentValue);
    // Reset shakeData to 0, otherwise meter will keep growing
    shakeData = 0;
  }, INTERVAL);
});
