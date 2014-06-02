var server = io.connect('/satellite');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

//note: expect camera resolution to be 640 x 480
var width = Math.max(320, innerWidth),
    height = Math.max(240, innerHeight);
var camWidth = 640,
    camHeight = 480;

var centerShifting = true;
var tilting = false;

var yOffset = 3;
var flowDataScalingFactor = 1;
var xMax = 2,
    xMin = -2,
    yMin = 0,
    yMax = 5;

var blobCoords = [0, 3];
var blobWobble = false;
var wobbleFactor = 0.3;
var shakeData = 0;
var shake = 0;
var shakeScalingFactor = 20;
var flowCutOff = 0.7;

var setShake = function (shakeData) {
  // console.log(shakeData, 'sdata');
  shake = zFilter(shakeData, shake);
  // console.log(shake, 'shake');
  var scaled = shake / shakeScalingFactor;
  if (scaled < 6) {
    projectionParams.shake  = scaled + 1;
  } else {
    tiltChange();
    projectionParams.shake = 1;
    shake = 0;
  }
};
//////////////////////////
//  Projection Data Ranges
/////////
//  center x (-2,2)
//  center y (0, 6)
//  tilt (-20 20)
//////////////////////////


var projectionParams = {
  distance: 1.1,
  scale: 8500,
  rotate: [76.00, -34.50, 32.12],
  center: [0, 3],
  tilt: 25,
  prevTilt:0,
  clipAngle: (Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6),
  precision: 0.1,
  colorClass: 'graticule',
  freq: 440,
  shake: 1
};



var zFilter = function(inputData, previousValue, zVal){
    var z = zVal || 0.9; // set this between 0 and 1
    return (z*previousValue + (1-z)*inputData);
};

var randomCenterAdjustment = function(blobCoords, scalingFactor) {
    blobCoords[0] += (Math.random() - 0.5) * scalingFactor;
    blobCoords[1] += (Math.random() - 0.5) * scalingFactor;
    return blobCoords;
};

var tiltChange = function () {
    var tilt = Math.random() * 45 - 20; //tilt will be between -20 and +25
    projectionParams.tilt = tilt;
    tilting = true;
};


var makeProjPath = function(projParams) {
  var projection = d3.geo.satellite()
    .distance(projParams.distance)
    .scale(projParams.scale)
    .rotate(projParams.rotate)
    .center(projParams.center)
    .tilt(projParams.tilt)
    .clipAngle(projParams.clipAngle)
    .precision(projParams.precision);
  return d3.geo.path()
    .projection(projection);
};


var path = makeProjPath(projectionParams);

var tiltProjPath = function() {
    var projection = d3.geo.satellite()
    .distance(1.1)
    .scale(6500)
    .rotate([76.00, -34.50, 32.12])
    .center([3 * uVect, 3 * vVect])
    .tilt(25)
    .clipAngle(Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6)
    .precision(.1);

  return d3.geo.path()
    .projection(projection);
};

var graticule = d3.geo.graticule()
    .extent([[-93, 27], [-47 + 1e-6, 57 + 1e-6]])
    .step([0.5, 0.5]);

// var path = d3.geo.path()
//     .projection(projection);

// var path2 = d3.geo.path()
//     .projection(projection2);

// var path3 = d3.geo.path()
//     .projection(projection3);

// var path4 = d3.geo.path()
//     .projection(projection4);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);


//get oflow data
//u, v typically [-1.5, 1.5]
// make a new projection with updated center
//transition


var collectedData = {
    flowU: 0,
    flowV: 0
};


var resetCollectionBins = function () {
  for (var key in collectedData) {
    collectedData[key] = 0;
  }
};

var shiftCenter = function(collectedData) {
    var xShift, yShift;
    // console.log(collectedData);
    // if (collectedData.flowU >= 0 ) {
    //     xShift = Math.min(collectedData.flowU, 2);
    // } else {
    //     xShift = Math.max(collectedData.flowU, -2);
    // }

    // if (collectedData.flowV >= 0 ) {
    //     yShift = Math.min(collectedData.flowV, 3);
    // } else {
    //     yShift = Math.max(collectedData.flowV, -3);
    // }

    // xShift *= 0.1;
    // yShift *= 0.1;
    // console.log('shifts',xShift,yShift);

    xShift = collectedData.flowU / 12;
    yShift = collectedData.flowV / 12;
    // var nextX = projectionParams.center[0] + xShift;
    // if((nextX >= xMin) && (nextX <= xMax)) {
    //     projectionParams.center[0] = nextX;
    // }
    // // projectionParams.center[1] += ;

    // var nextY = projectionParams.center[1] + (yShift + yOffset);
    // if(nextY >= yMin && nextY <= yMax) {
    //   projectionParams.center[1] = nextY;
    // }

    blobCoords[0] += xShift;
    blobCoords[1] += yShift;
} ;

var nextMove = function () {
    var nextPath;
    var globe = d3.select(this);
    if (centerShifting) {
        shiftCenter(collectedData);        
    }
    resetCollectionBins();
    if (blobWobble) {
      blobCoords = randomCenterAdjustment(blobCoords, wobbleFactor);
    }

    projectionParams.center[0] = zFilter(blobCoords[0], projectionParams.center[0], 0.4);
    projectionParams.center[1] = zFilter(blobCoords[1], projectionParams.center[1], 0.4);

    nextPath = makeProjPath(projectionParams);



    if (tilting) {
      tilting = false;
      globe
        .transition()
        .duration(1500)
        .attr("d", nextPath)
        .each("end", nextMove);
    } else {
      globe
        .transition()
        .duration(200)
        .attr("d", nextPath)
        .style("stroke-width", projectionParams.shake)
        .style("stroke", function(d,i){return "hsl(" + ((projectionParams.freq/1000)*360) + ",100%,50%)";})
        .each("end", nextMove);
    }
    // }

};

d3.select("path")
    .attr("d", path) //move center
    .transition()
    .each("end", nextMove);



var collectOptiFlowData = function (optiFlowData) {
    if (Math.abs(optiFlowData.u) > flowCutOff){
        collectedData.flowU += flowDataScalingFactor * optiFlowData.u; 
    }
    if (Math.abs(optiFlowData.v) > flowCutOff){
        collectedData.flowV += flowDataScalingFactor * optiFlowData.v; 
    }
};

var scaleToScreenCoords = function (coordArr) {
    console.log("scale to screen");
    var x = coordArr[0] / camWidth;
    var y = coordArr[1] / camHeight;
    // x and y should now be in range (0, 1);
    x = x * 4 - 2; //sets x to be in range (-2, 2)
    y = y * 6;
    console.log([x,y]);
    return [x, y];

};
var getBlobCoords = function (blobData) {
  console.log('getBlobCoords');
  var x, y;
  if(blobData[2][0] === '/cur') {
      x = blobData[2][2];
      y = blobData[2][3]; 
      blobCoords = scaleToScreenCoords([x, y]);     
  }
};
var getFreq = function ( audioData ) {
   // console.log(audioData);
    var freq = audioData.hz;
    projectionParams.freq = zFilter(freq, projectionParams.freq, 0.96);
};

var handleShakes = function(data){
  // console.log('data',data);

  shakeData += data.totalAcc;
  // console.log(shakeData, 'sdata');
};

//// blob data format: [ '#bundle', 2.3283064365386963e-10, [ '/cur', 73, 320, 240 ] ]

server.on('optiFlowData', collectOptiFlowData);
server.on('blob', getBlobCoords);
server.on('audio', getFreq);
d3.select(self.frameElement).style("height", height + "px");
server.on('motionData', handleShakes);


setInterval(function(){
  setShake(shakeData);
  shakeData = 0;
}, 100);


/////





