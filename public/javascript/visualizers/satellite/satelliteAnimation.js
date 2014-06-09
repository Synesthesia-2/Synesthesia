// For optimal aesthetics, stay within the following ranges:
    /////////////////////////////////////////
    //  Satellite Projection Data Ranges   //
    /////////////////////////////////////////
    //  center[0]  (-2,2)     // x-pos     //
    //  center[1]  (0, 6)     // y-pos     //
    //  tilt       (-20 20)   // slope     //
    /////////////////////////////////////////

// **note: expect osc input camera resolution to be 640 x 480

 var visualizer = window.visualizer = {};

  visualizer.settings = {
    // size of the rendered visualization
    width: Math.max(320, window.innerWidth),
    height: Math.max(240, window.innerHeight),

    //resolution of the input camera data
    camWidth: 640,
    camHeight: 480,

    //parameter for weighting optical flow data
    flowDataScalingFactor: 1,

    // set a lower limit on optical flow data to collect (in order to reduce the effect of background noise)
    flowThreshold: 0.7,

    // default centerpoint for the satellite projection as well as a holder for target center points
    centerCoords: [0, 3],

    // parameter for controlling magnitude of random walk steps
    wobbleFactor: 0.3,

    // state to indicate whether or not random (projection translation) walk is enabled
    wobble: false,

    // indicate whether or not a tilt change is occuring in the next projection
    tilting: false,

    // parameter for weighting accelerometer data
    // may need to be adjusted depending on the number of contributing data sources
    shakeScale: 0.15,

    // shake value threshold -- exceeding this value induces a tilt change and resets the visualizer's shake property
    maxShake: 8,

    // grid thickness is proportional to the visualizer's current shake value
    // an offset is necessary so that the grid is always visible (i.e. grid thickness > 0 )
    shakeOffset: 2,

    tiltAngle: {
      X: 0,
      Y: 0
    }

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


  visualizer.accelerationAccumulator = 0;
  visualizer.shake = 0;

  visualizer.graticule = d3.geo.graticule()
      .extent([[-93, 27], [-47 + 1e-6, 57 + 1e-6]])
      .step([0.5, 0.5]);





  visualizer.opticalFlowData = {
      flowU: 0,
      flowV: 0
  };

  visualizer.setShake = function (accelerationAccumulator) {
    this.shake = zFilter(this.accelerationAccumulator, this.shake);
    var scaled = this.shake * this.settings.shakeScale;
    // console.log(scaled);
    // console.log(this.settings.maxShake);
    // console.log('setshakethis',this);
    // debugger;
    if (scaled < this.settings.maxShake) {
      this.projectionParams.shake  = scaled + this.settings.shakeOffset;
    } else {
      this.tiltChange();
      // this.projectionParams.shake = 3;
      this.shake = 0;
    }
  };


  visualizer.tiltChangeBase = function (angle) {
      if (angle === 0) {
        angle = 0.1;
      }
      var tilt = angle || Math.random() * 45 - 20; // new tilt will be between -20 and +25
      visualizer.projectionParams.tilt = tilt;
      this.settings.tilting = true;
  };

  // visualizer.tiltChange = _.throttle(visualizer.tiltChangeBase, 1000);

  visualizer.tiltChange = function(tilt) {
    for (dimension in visualizer.settings.tiltAngle) {
      visualizer.settings.tiltAngle[dimension] = zFilter(tilt[dimension], visualizer.settings.tiltAngle[dimension], 0.999);
    }
    visualizer.settings.tiltAngle = tilt;
          // this.settings.tilting = true;
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

  visualizer.handleTilt = function(tiltAngle) {
    // console.log(tiltAngle);
    visualizer.tiltChange(tiltAngle);
    // d3.select('path')
    // .attr("transform", function(d) { return "skewX(" + visualizer.settings.tiltAngle.X + ")" + "skewY(" + visualizer.settings.tiltAngle.Y + ")"; })
  };

  visualizer.nextMove = function () {
      var nextPath;
      var globe = d3.select(this);
      visualizer.shiftCenter(visualizer.opticalFlowData);
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
          .style('opacity', 1)
          .transition()
          .duration(3000)
          .attr("d", nextPath)
          .attr("transform", function(d) { return "skewX(" + 0 + ")" + "skewY(" + 0 + ")"; })
          .each("end", visualizer.nextMove);
      } else {
        globe
          .transition()
          .duration(50)
          .attr("d", nextPath)
          .style("stroke-width", visualizer.projectionParams.shake)
          .style("stroke", function(d,i){return "hsl(" + ((visualizer.projectionParams.freq/1000)*360) + ",100%,50%)";})
          // .attr("transform")
          .attr("transform", function(d) { return "skewX(" + visualizer.settings.tiltAngle.X + ")" + "skewY(" + visualizer.settings.tiltAngle.Y + ")"; })
          .each("end", visualizer.nextMove);
      }
  };

  visualizer.collectopticalFlowData = function (opticalFlowData) {
    console.log('flowed');
      if (Math.abs(opticalFlowData.u) > visualizer.settings.flowThreshold){
          visualizer.opticalFlowData.flowU += visualizer.settings.flowDataScalingFactor * opticalFlowData.u; 
      }
      if (Math.abs(opticalFlowData.v) > visualizer.settings.flowThreshold){
          visualizer.opticalFlowData.flowV += visualizer.settings.flowDataScalingFactor * opticalFlowData.v; 
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

 $(document).ready(function(){

  visualizer.path = makeProjPath(visualizer.projectionParams);

  visualizer.svg = d3.select("body").append("svg")
      .attr("width", visualizer.settings.width)
      .attr("height", visualizer.settings.height);

  visualizer.svg.append("path")
      .datum(visualizer.graticule)
      .attr("class", "graticule")
      .attr("d", visualizer.path);

  d3.select("path")
        .attr("d", visualizer.path) //move center
        .transition()
        // .style('opacity', 0.8)
        .each("end", visualizer.nextMove);

    setInterval(function(){
      visualizer.setShake(visualizer.accelerationAccumulator);
      visualizer.accelerationAccumulator = 0;
    }, 100);

    d3.select(self.frameElement).style("height", visualizer.settings.height + "px");
  });
