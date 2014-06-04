/////////
// helpers:

/////////////


(function(){

  var server = io.connect('/satellite');
  server.on('welcome', function (data) {
      console.log('welcomed', data);
    });

  var zFilter = function(inputData, previousValue, zFactor){
      var z = zFactor || 0.9; // set the z param between 0 and 1
      return ( z * previousValue + ( 1 - z ) * inputData ) ;
  };

  var randomCenterAdjustment = function(oldCoords, scalingFactor) {
      var updatedCoords = [];
      updatedCoords[0] = oldCoords[0] + (Math.random() - 0.5) * scalingFactor;
      updatedCoords[1] = oldCoords[1] + (Math.random() - 0.5) * scalingFactor;
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



  // ** expect osc input camera resolution to be 640 x 480

  /////////////////////////////////////////
  //  Satellite Projection Data Ranges   //
  /////////////////////////////////////////
  //  center[0]  (-2,2)     // x-pos     //
  //  center[1]  (0, 6)     // y-pos     //
  //  tilt       (-20 20)   // slope     //
  /////////////////////////////////////////




  window.visualizer = {};

  var visualizer = window.visualizer;

  visualizer.accelerationAccumulator = 0;
  visualizer.shake = 0;

  visualizer.settings = {
    width: Math.max(320, window.innerWidth),
    height: Math.max(240, window.innerHeight),
    camWidth: 640,
    camHeight: 480,
    flowDataScalingFactor: 1,
    centerCoords: [0, 3],
    wobbleFactor: 0.3,
    wobble: false,
    centerShifting: true,
    tilting: false,
    flowThreshold: 0.7,
    shakeScale: 1/20,
    maxShake: 8,
    shakeOffset: 1
  };

  visualizer.projectionParams = {
    distance: 1.1,
    scale: 8500,
    rotate: [76.00, -34.50, 32.12],
    center: [0, 3],
    tilt: 25,
    clipAngle: (Math.acos(1 / 1.1) * 180 / Math.PI - 1e-6),
    precision: 0.1,
    colorClass: 'graticule',
    freq: 440,
    shake: 1
  };

  visualizer.graticule = d3.geo.graticule()
      .extent([[-93, 27], [-47 + 1e-6, 57 + 1e-6]])
      .step([0.5, 0.5]);


  visualizer.path = makeProjPath(visualizer.projectionParams);




  visualizer.svg = d3.select("body").append("svg")
      .attr("width", visualizer.settings.width)
      .attr("height", visualizer.settings.height);

  visualizer.svg.append("path")
      .datum(visualizer.graticule)
      .attr("class", "graticule")
      .attr("d", visualizer.path);


  visualizer.opticalFlowData = {
      flowU: 0,
      flowV: 0
  };

  visualizer.setShake = function (accelerationAccumulator) {
    this.shake = zFilter(accelerationAccumulator, this.shake);
    var scaled = this.shake * this.settings.shakeScale;
    // console.log('setshakethis',this);
    // debugger;
    if (scaled < this.settings.maxShake) {
      this.projectionParams.shake  = scaled + this.shakeOffset;
    } else {
      this.tiltChange();
      this.projectionParams.shake = 1;
      this.shake = 0;
    }
  };


  visualizer.tiltChange = function () {
      var tilt = Math.random() * 45 - 20; // new tilt will be between -20 and +25
      visualizer.projectionParams.tilt = tilt;
      this.settings.tilting = true;
  };

  visualizer.resetCollectionBins = function () {
    for (var key in visualizer.opticalFlowData) {
      visualizer.opticalFlowData[key] = 0;
    }
  };

  visualizer.shiftCenter = function () {
      var xShift, yShift;
      xShift = this.opticalFlowData.flowU / 12;
      yShift = this.opticalFlowData.flowV / 12;
      this.settings.centerCoords[0] += xShift;
      this.settings.centerCoords[1] += yShift;
  } ;

  visualizer.getFreq = function ( audioData ) {
     console.log(audioData);
      var freq = audioData.hz;
      visualizer.projectionParams.freq = zFilter(freq, visualizer.projectionParams.freq, 0.96);
  };

  visualizer.handleShakes = function(data){
    visualizer.accelerationAccumulator += data.totalAcc;
  };

  visualizer.nextMove = function () {
      var nextPath;
      var globe = d3.select(this);
      if (visualizer.settings.centerShifting) {
          visualizer.shiftCenter(visualizer.opticalFlowData);        
      }
      visualizer.resetCollectionBins();
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
          .each("end", visualizer.nextMove);
      } else {
        globe
          .transition()
          .duration(200)
          .attr("d", nextPath)
          .style("stroke-width", visualizer.projectionParams.shake)
          .style("stroke", function(d,i){return "hsl(" + ((visualizer.projectionParams.freq/1000)*360) + ",100%,50%)";})
          .each("end", visualizer.nextMove);
      }
  };

  visualizer.collectOptiFlowData = function (optiFlowData) {
      if (Math.abs(optiFlowData.u) > visualizer.settings.flowThreshold){
          visualizer.opticalFlowData.flowU += visualizer.settings.flowDataScalingFactor * optiFlowData.u; 
      }
      if (Math.abs(optiFlowData.v) > visualizer.settings.flowThreshold){
          visualizer.opticalFlowData.flowV += visualizer.settings.flowDataScalingFactor * optiFlowData.v; 
      }
  };

  visualizer.scaleToScreenCoords = function (coordArr) {
      // console.log("scale to screen");
      // scale x and y be in range (0, 1);
      var x = coordArr[0] / this.settings.camWidth;
      var y = coordArr[1] / this.settings.camHeight;

      x = x * 4 - 2; // sets x to be in range (-2, 2)
      y = y * 6; // set y to be in range (0, 6)
      // console.log([x,y]);
      return [x, y];

  };

  visualizer.getBlobCoords = function (blobData) {
    // console.log('getBlobCoords');
    //// sample blob data from osc: [ '#bundle', 2.3283064365386963e-10, [ '/cur', 73, 320, 240 ] ]
    var x, y;
    if(blobData[2][0] === '/cur') {
        x = blobData[2][2];
        y = blobData[2][3]; 
        visualizer.settings.centerCoords = visualizer.scaleToScreenCoords([x, y]);     
    }
  };


  d3.select("path")
      .attr("d", visualizer.path) //move center
      .transition()
      .each("end", visualizer.nextMove);

  setInterval(function(){
    visualizer.setShake(visualizer.accelerationAccumulator);
    visualizer.accelerationAccumulator = 0;
  }, 100);

  server.on('optiFlowData', visualizer.collectOptiFlowData);
  server.on('blob', visualizer.getBlobCoords);
  server.on('audio', visualizer.getFreq);
  d3.select(self.frameElement).style("height", visualizer.settings.height + "px");
  server.on('audienceMotionData', visualizer.handleShakes);

})();
