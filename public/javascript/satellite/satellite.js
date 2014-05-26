
var width = 1000,
    height = 960;

var projection = d3.geo.satellite()
    .distance(1.1)
    .scale(5500)
    .rotate([76.00, -34.50, 32.12])
    .center([-2, 5])
    .tilt(25)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);

var projection2 = d3.geo.satellite()
    .distance(1.1)
    .scale(5500)
    .rotate([76.00, -34.50, 32.12])
    .center([-4, 2])
    .tilt(25)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);


var projection3 = d3.geo.satellite()
    .distance(1.1)
    .scale(5500)
    .rotate([76.00, -34.50, 32.12])
    .center([2, 2])
    .tilt(24)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);
    


var graticule = d3.geo.graticule()
    .extent([[-93, 27], [-47 + 1e-6, 57 + 1e-6]])
    .step([3, 3]);

var path = d3.geo.path()
    .projection(projection);

var path2 = d3.geo.path()
    .projection(projection2);

var path3 = d3.geo.path()
    .projection(projection3);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path)
    .transition()
    .duration(3000)
    .attr("d", path2)
    .transition()
    .duration(3000)
    .attr("d", path)
    .transition()
    .duration(1000)
    .attr("d", path3);

d3.select(self.frameElement).style("height", height + "px");