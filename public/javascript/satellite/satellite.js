var server = io.connect('/satellite');
server.on('welcome', function (data) {
    console.log('welcomed', data);
  });

// camera and optical flow constants
// ** expect osc input camera resolution to be 640 x 480
var CAMERAWIDTH = 640,
    CAMERAHEIGHT = 480,
    OFLOWSCALE = 1,
    OFLOWCUTOFF = 0.7;
    
// satellite projection constants and defaults
var PROJ_DISTANCE = 1.1,
    PROJ_SCALE = 8500,
    PROJ_ROTATION = [76.00, -34.50, 32.12],
    PROJ_CLIP_ANGLE = (Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6),
    PROJ_COLOR_CLASS = 'graticule',
    DEFAULT_PROJ_CENTER = [0, 3],
    DEFAULT_PROJ_TILT = 25,
    DEFAULT_PROJ_PRECISION = 0.1;

/////////////////////////////////////////
//  Satellite Projection Data Ranges   //
/////////////////////////////////////////
//  center[0]  (-2,2)     // x-pos     //
//  center[1]  (0, 6)     // y-pos     //
//  tilt       (-20 20)   // slope     //
/////////////////////////////////////////



//  grid visualizer constants and defaults
var DEFAULT_VISUALIZER_WIDTH = 320,
    DEFAULT_VISUALIZER_HEIGHT = 420,
    DEFAULT_WOBBLE_FACTOR = 0.3,
    SHAKE_SCALING_FACTOR = 20,
    MAX_SCALED_SHAKE = 6,
    INIT_FREQ = 440,
    INIT_SHAKE_PARAM = 1,
    INIT_WOBBLE_STATUS = false,
    INIT_CENTER_SHIFT_STATUS = true,
    INIT_TILT_STATUS = false,
    INNERWIDTH = window.innerWidth,
    INNERHEIGHT = window.innerHeight;



var visualizer = {};

visualizer.accelerationAccumulator = 0;
visualizer.shake = 0;

visualizer.settings = {};
visualizer.settings.width = Math.max(DEFAULT_VISUALIZER_WIDTH, INNERWIDTH);
visualizer.settings.height = Math.max(DEFAULT_VISUALIZER_HEIGHT, INNERHEIGHT);
visualizer.settings.camWidth = CAMERAWIDTH;
visualizer.settings.camHeight = CAMERAHEIGHT;
visualizer.settings.flowDataScalingFactor = OFLOWSCALE;
visualizer.settings.centerCoords = DEFAULT_PROJ_CENTER;
visualizer.settings.wobbleFactor = DEFAULT_WOBBLE_FACTOR;
visualizer.settings.wobble = INIT_WOBBLE_STATUS;
visualizer.settings.centerShifting = INIT_CENTER_SHIFT_STATUS;
visualizer.settings.tilting = INIT_TILT_STATUS;



visualizer.projectionParams = {
  distance: PROJ_DISTANCE,
  scale: PROJ_SCALE,
  rotate: PROJ_ROTATION,
  center: DEFAULT_PROJ_CENTER,
  tilt: DEFAULT_PROJ_TILT,
  clipAngle: PROJ_CLIP_ANGLE,
  precision: DEFAULT_PROJ_PRECISION,
  colorClass: PROJ_COLOR_CLASS,
  freq: INIT_FREQ,
  shake: INIT_SHAKE_PARAM
};



visualizer.setShake = function (accelerationAccumulator) {
  this.shake = zFilter(accelerationAccumulator, this.shake);
  var scaled = this.shake / SHAKE_SCALING_FACTOR;
  if (scaled < MAX_SCALED_SHAKE) {
    this.projectionParams.shake  = scaled + 1;
  } else {
    this.tiltChange();
    this.projectionParams.shake = 1;
    this.shake = 0;
  }
};


visualizer.settings.tiltChange = function () {
    var tilt = Math.random() * 45 - 20; //tilt will be between -20 and +25
    visualizer.projectionParams.tilt = tilt;
    this.tilting = true;
};


var zFilter = function(inputData, previousValue, zVal){
    var z = zVal || 0.9; // set the z param between 0 and 1
    return (z*previousValue + (1-z)*inputData);
};

var randomCenterAdjustment = function(oldCoords, scalingFactor) {
    var updatedCoords = [];
    updatedCoords[0] += (Math.random() - 0.5) * scalingFactor;
    updatedCoords[1] += (Math.random() - 0.5) * scalingFactor;
    return updatedCoords;
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


var path = makeProjPath(visualizer.projectionParams);


var graticule = d3.geo.graticule()
    .extent([[-93, 27], [-47 + 1e-6, 57 + 1e-6]])
    .step([0.5, 0.5]);


var svg = d3.select("body").append("svg")
    .attr("width", visualizer.settings.width)
    .attr("height", visualizer.settings.height);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);


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
    xShift = collectedData.flowU / 12;
    yShift = collectedData.flowV / 12;
    visualizer.settings.centerCoords[0] += xShift;
    visualizer.settings.centerCoords[1] += yShift;
} ;

var nextMove = function () {
    var nextPath;
    var globe = d3.select(this);
    if (visualizer.settings.centerShifting) {
        shiftCenter(collectedData);        
    }
    resetCollectionBins();
    if (visualizer.settings.wobble) {
      visualizer.settings.centerCoords = randomCenterAdjustment(visualizer.settings.centerCoords, visualizer.settings.wobbleFactor);
    }

    visualizer.projectionParams.center[0] = zFilter(visualizer.settings.centerCoords[0], visualizer.projectionParams.center[0], 0.4);
    visualizer.projectionParams.center[1] = zFilter(visualizer.settings.centerCoords[1], visualizer.projectionParams.center[1], 0.4);

    nextPath = makeProjPath(visualizer.projectionParams);



    if (visualizer.settings.tilting) {
      visualizer.settings.tilting = false;
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
        .style("stroke-width", visualizer.projectionParams.shake)
        .style("stroke", function(d,i){return "hsl(" + ((visualizer.projectionParams.freq/1000)*360) + ",100%,50%)";})
        .each("end", nextMove);
    }
};

d3.select("path")
    .attr("d", path) //move center
    .transition()
    .each("end", nextMove);



var collectOptiFlowData = function (optiFlowData) {
    if (Math.abs(optiFlowData.u) > flowCutOff){
        collectedData.flowU += visualizer.settings.flowDataScalingFactor * optiFlowData.u; 
    }
    if (Math.abs(optiFlowData.v) > flowCutOff){
        collectedData.flowV += visualizer.settings.flowDataScalingFactor * optiFlowData.v; 
    }
};

var scaleToScreenCoords = function (coordArr) {
    console.log("scale to screen");
    var x = coordArr[0] / visualizer.settings.camWidth;
    var y = coordArr[1] / visualizer.settings.camHeight;
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
      visualizer.settings.centerCoords = scaleToScreenCoords([x, y]);     
  }
};
var getFreq = function ( audioData ) {
   console.log(audioData);
    var freq = audioData.hz;
    visualizer.projectionParams.freq = zFilter(freq, visualizer.projectionParams.freq, 0.96);
};

var handleShakes = function(data){
  visualizer.accelerationAccumulator += data.totalAcc;
};


//// sample blob data: [ '#bundle', 2.3283064365386963e-10, [ '/cur', 73, 320, 240 ] ]

server.on('optiFlowData', collectOptiFlowData);
server.on('blob', getBlobCoords);
server.on('audio', getFreq);
d3.select(self.frameElement).style("height", visualizer.settings.height + "px");
server.on('motionData', handleShakes);


setInterval(function(){
  visualizer.setShake(visualizer.accelerationAccumulator);
  visualizer.accelerationAccumulator = 0;
}, 100);