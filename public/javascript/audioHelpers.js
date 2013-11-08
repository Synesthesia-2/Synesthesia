var makeFilter = function(context,type,freq,gain,q) {
  if (!context) {throw new Error("context argument required");}
  if (!type || typeof(type) !== "string") {throw new Error("type must be string");}
  var filter = context.createBiquadFilter();
  filter.type = filter[type];
  if (freq) { filter.frequency.value = freq; }
  if (gain) { filter.gain.value = gain; }
  if (q) { filter.Q.value = q; }
  return filter;
};

var makeFilterChain = function(){
  var chain = {
    first: null,
    last: null,
    output: null
  };
  chain.connect = function(node){
    this.output = node;
    if (this.last) {this.last.connect(this.output);}
  };
  chain.disconnect = function(node){
    this.output = null;
    if (this.last) {this.last.disconnect(node);}
  };
  chain.add = function(filter){
    if (arguments.length > 1) {
      for (var i=0; i<arguments.length; i++) {
        this.add(arguments[i]);
      }
      return this;
    }
    if (!this.first) {
      this.first = filter;
      this.last = filter;
      if (this.output) {this.last.connect(this.output);}
    } else {
      if (this.output) {
        this.last.disconnect(this.output);
        filter.connect(this.output);
      }
      this.last.connect(filter);
      this.last = filter;
    }
    return this;
  };
  return chain;
};

var makeAnalyser = function(context,fftSize,maxdec,mindec,smoothing) {
  if (arguments.length === 3) {
    smoothing = maxdec;
    maxdec = undefined;
  }
  if (!context) {throw new Error("context argument required");}
  var analyser = context.createAnalyser();
  analyser.context = context;
  if (fftSize) {analyser.fftSize = fftSize;}
  if (maxdec) {analyser.maxDecibels = maxdec;}
  if (mindec) {analyser.minDecibels = mindec;}
  if (smoothing) {analyser.smoothingTimeConstant = smoothing;}
  return analyser;
};

var makePitchAnalyser = function(context,source) {
  var analyser = makeAnalyser(context,2048,-30,-144);
  source.connect(analyser);
  var _FFT = new Float32Array(analyser.frequencyBinCount);
  var _findMaxWithI = function(array) {
    var max = Math.max.apply(Math, array);
    var index = Array.prototype.indexOf.call(array,max);
    return [[index-1,array[index-1]],[index,max],[index+1,array[index+1]]];
  };
  var _noiseCancel = function(freq) {
    var amount = (data.avg-ptAvg)*notchStrength;
    console.log("adding filter at " + freq,data.avg);
    source.disconnect(analyser);
    var filter = makeFilter(context,"PEAKING",freq,amount);
    var chain = analyser.ncFilters;
    if (chain) {
      chain.add(filter);
    } else {
      chain = analyser.ncFilters = makeFilterChain();
      chain.add(filter);
      source.connect(chain);
      chain.connect(analyser);
    }
  }
  analyser.calibrate = function(context,time,notchStrength) {
    this.smoothingTimeConstant = 0.9;
    var start = new Date().getTime();
    var e = start+4000;
    var offset = 20;
    var results = [];
    this.getFloatFrequencyData(_FFT);
    var targetRange = _findMaxWithI(_FFT);
    var sample = {
      volume: targetRange[1][1],
      hz: convertToHz(targetRange)
    };
  }
  analyser.process = function(){};
  return analyser;
}





var calibrate = function(context,time,notchStrength) {
  var analyze = function(){
    var noiseCancel = function(freq) {
      var amount = (data.avg-ptAvg)*notchStrength
      console.log("adding filter at " + freq,data.avg);
      var filter = makeFilter(context,"PEAKING",freq,amount);

      filter.connect(analyser);
      var lastFilter = dynamicFilters.length;
      if (lastFilter) {
        dynamicFilters[lastFilter-1].disconnect(analyser);
        dynamicFilters[lastFilter-1].connect(filter);
        dynamicFilters.push(filter);
      } else {
        // the last static filter in line to the analyser
        loPass.disconnect(analyser);
        loPass.connect(filter);
        dynamicFilters.push(filter);
      }
    };
    analyser.getFloatFrequencyData(FFTData);
    var targetRange = findMaxWithI(FFTData);
    var sample = {
      volume: targetRange[1][1],
      hz: convertToHz(targetRange)
    };
    results.push(sample);
    var cur = new Date().getTime();
    if (cur < e) {
      setTimeout(analyze,50);
    } else {
      var data = getPeaks(results);
      for (var f in data.freqs) {
        var pt = data.freqs[f];
        var ptAvg = pt.vol/pt.hits;
        if (pt.hits > results.length*0.3) {
          noiseCancel(f);
        }
      }
      if (data.avg >= -60 && data.avg <= -40) {
        offset = 10;
      } else if (data.avg > -40) {
        offset = 0;
      }
      state.threshold = data.avg+offset;
    }
  };
  analyze();
};


var makeThing = function() {
  var thing = {};
  var blah = function() {
    thing.word = true;
  };
  thing.callBlah = function(){
    blah();
  };
  return thing;
};







// // HOW TO USE THESE HELPER FUNCTIONS:
// var contextClass = window.AudioContext || window.webkitAudioContext;
// if (contextClass) {
//   var audioContext = new contextClass();
// } else {
//   throw new Error("webaudio not supported.")
// }

// var input = // Input can be an oscillator node,
//             // live mic input, other filters, etc.

// var hiPass = makeFilter(audioContext,"HIGHPASS",80);
// var loPass = makeFilter(audioContext,"LOWPASS",1200);
// var loShelf = makeFilter(audioContext,"LOWSHELF",330,-10);

// var newChain = makeFilterChain();
// // Output connection can be defined at any time.
// newChain.connect(audioContext.destination);
// newChain.addFilter(hiPass,loPass,loShelf);
// input.connect(newChain.first);