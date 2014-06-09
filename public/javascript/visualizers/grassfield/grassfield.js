jQuery(function($) {
  var server = io.connect('/grassfield');
    server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

  var oflowData = [];

  server.on('opticalFlow', function(data){
    oflowData = data.zones;
  });

  var width = Math.max(960, innerWidth), //640
      height = Math.max(500, innerHeight); //480

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

  var grassDance = function(transitionTime){

    inputData = oflowData;
    transitionTime = transitionTime || 2000;

    var lineHeight = 25;
    var randomFactor = 5;

    // Here we use a key function to make sure the data join works properly
    var line = svg.selectAll("path").data(inputData, function(d){return d.x + "x" + d.y;});

    line
      .transition()
      .duration(transitionTime/2)
      .ease('elastic')
      .attr("d", function(d){
        // This random factor is what lets the grass "blow in the wind"...
        var rf = randomFactor*(Math.random() - 0.5);
        // This is an SVG bezier curve. Looks just like a grass blade!
        // http://www.w3.org/TR/SVG11/paths.html#PathDataQuadraticBezierCommands
        var path = "";
        path += "M" + d.x * width / 640 + "," + d.y * height / 480;
        path += " Q" + (d.x - lineHeight/8) * width / 640 + "," + (d.y - lineHeight/4) * height / 480;
        path += " " + (d.x - rf/2) * width / 640 + "," + (d.y - lineHeight/2) * height / 480;
        path += " T" + (d.x - d.u - rf) * width / 640 + "," + (d.y - lineHeight) * height / 480;
        return path;
      });

    line.enter()
      .append('path')
      .transition()
      .duration(transitionTime/2)
      .attr("d", function(d){
        var rx = randomFactor*(Math.random() - 0.5);
        var path = "";
        path += "M" + (d.x + rx) * width / 640 + "," + d.y * height / 480;
        path += " Q" + (d.x - lineHeight/8) * width / 640 + "," + (d.y - lineHeight/4) * height / 480;
        path += " " + (d.x) * width / 640 + "," + (d.y - lineHeight/2) * height / 480;
        path += " T" + (d.x) * width / 640 + "," + (d.y - lineHeight) * height / 480;
        return path;
      })
     .style("stroke", function(d,i){return "hsl(" + 15*(d.u+d.v) + ",100%,50%)";});
  };

  setInterval(function(){
    grassDance();
  }, 200);
});