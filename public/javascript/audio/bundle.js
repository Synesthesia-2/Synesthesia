;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Tip: If you have access to soundcard settings, adjust input gain so that 
// microphone input averages between 50% and 75% metering on soundcard.
// Good rule of thumb for analyser is that -100dB is a very quiet room and 0 is 
// a very loud input. Under this setup most inputs should avg between -40 and 
// -5 dB, but it all depends on the environment, input gain, 
// and analyser.minDecibels.

var helpers = require('./audioHelpers.js');
var makePitchAnalyser = require('./makePitchAnalyser.js');

var h1 = $('h1');
var contextClass = (window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext);
if (contextClass) {
  var audioContext = new contextClass();
} else {
  h1.text("web audio is not enabled, sorry.");
}

var state = {
  serverReady: false,
  inputEnabled: false,
  emitting: false,
};
var server = io.connect('/audio');
var microphone;
var hiPass = helpers.makeFilter(audioContext,"HIGHPASS",80);
var loPass = helpers.makeFilter(audioContext,"LOWPASS",1200);
var filters = helpers.nodeChain();
filters.add(hiPass,loPass);
server.on("welcome",function(data){
  if (data.audio) {
    state.serverReady = true;
  }
});
server.on("toggleSound",function(data) {
  state.serverReady = data.sound;
  if (!state.emitting && state.inputEnabled && state.serverReady) {
    startEmitting();
  } else if (state.emitting && !state.serverReady) {
    stopEmitting();
  }
});
server.on("reset", function() {
  state.serverReady = false;
  if (state.emitting) {
    stopEmitting();
  }
});
var streamLoaded = function(stream) {
  h1.text("Audio input enabled. Waiting for command from server.");
  state.inputEnabled = true;
  microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(filters.first);
  if (state.serverReady) { startEmitting(); }
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia( {audio:true}, streamLoaded);

var startEmitting = function() {
  h1.text("Calibrating...");
  pitchAnalyser = makePitchAnalyser(audioContext,filters);
  pitchAnalyser.calibrate(function(){
    h1.text('Emitting audio stream.');
    state.emitting = true;
    pitchAnalyser.start(60,function(data){
      if (data.volume > pitchAnalyser.threshold) {
        server.emit("audio",data);
      }
    });
  });
};

var stopEmitting = function() {
  h1.text("TRANSMISSION ENDED");
  state.emitting = false;
  pitchAnalyser.end();
};

var resumeEmitting = function() {
  // In future the future can be separate function
  // to resume processing without re-calibrating
};
},{"./audioHelpers.js":2,"./makePitchAnalyser.js":3}],2:[function(require,module,exports){
module.exports = {
  makeFilter: function(context,type,freq,gain,q) {
    if (!context) {throw new Error("context argument required");}
    if (!type || typeof(type) !== "string") {
      throw new Error("type must be string");
    }
    var filter = context.createBiquadFilter();
    filter.type = filter[type];
    if (freq) { filter.frequency.value = freq; }
    if (gain) { filter.gain.value = gain; }
    if (q) { filter.Q.value = q; }
    return filter;
  },
  nodeChain: function(){
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
  },
  makeAnalyser: function(context,fftSize,maxdec,mindec,smoothing) {
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
  }
} 

},{}],3:[function(require,module,exports){
var helpers =   require('./audioHelpers.js');

module.exports = function(context,source) {
  var analyser = helpers.makeAnalyser(context,2048,-30,-144);
  analyser.threshold = analyser.minDecibels;
  source.connect(analyser);
  var _FFT = new Float32Array(analyser.frequencyBinCount);
  
  var _findMaxWithI = function(array) {
    var max = Math.max.apply(Math, array);
    var index = Array.prototype.indexOf.call(array,max);
    return [[index-1,array[index-1]],[index,max],[index+1,array[index+1]]];
  };

  var _convertToHz = function(buckets) {
    var targetFreq = buckets[1][0];
    var lowD = ((buckets[1][1])-(buckets[0][1]));
    var highD = ((buckets[1][1])-(buckets[2][1]));
    var shift = (lowD < highD ? -(highD - lowD) : (lowD - highD));
    var aShift = (shift*0.5)*0.1;
    var f = targetFreq+aShift;
    return f/analyser.frequencyBinCount*(context.sampleRate*0.5);
  };

  var _getPeaks = function(array) {
    var sum = 0;
    var freqs = {};
    var i = array.length;
    while(i--) {
      var vol = array[i].volume;
      var freq = Math.round(array[i].hz / 5) * 5;
      if (freqs[freq]) {
        freqs[freq].hits+=1;
        freqs[freq].vol+=vol;
      } else {
        freqs[freq] = {hits:1,vol:vol};
      }
      sum+=vol;
    }
    return {
      avg: sum/array.length,
      freqs: freqs
    };
  };

  var _noiseCancel = function(freq,diff) {
    notchStrength = 0.7;
    var amt = diff*notchStrength;
    console.log("adding noise cancelling filter at "+freq+"hz with gain "+amt);
    source.disconnect(analyser);
    var filter = helpers.makeFilter(context,"PEAKING",freq,amt);
    var chain = analyser.ncFilters;
    if (chain) {
      chain.add(filter);
    } else {
      chain = analyser.ncFilters = helpers.nodeChain();
      chain.add(filter);
      source.connect(chain.first);
      chain.connect(analyser);
    }
  };

  var _setThresh = function(avg,tStr) {
    if (avg > analyser.minDecibels * 0.27) {
      tStr = 0;
    } else if (avg > analyser.minDecibels * 0.4) {
      tStr *= 0.5;
    }
    analyser.threshold = avg+tStr;
  };

  var _analyseEnv = function(time,tStrength,done) {
    var interval = 50;
    var start = new Date().getTime();
    var e = start + time;
    var results = [];
    var tick = function() {
      analyser.getFloatFrequencyData(_FFT);
      var fftIndex = _findMaxWithI(_FFT);
      var sample = {
        volume: fftIndex[1][1],
        hz: _convertToHz(fftIndex)
      };
      results.push(sample);
      var cur = new Date().getTime();
      if (cur < e) {
        setTimeout(tick,interval);
      } else {
        var data = _getPeaks(results);
        for (var f in data.freqs) {
          var freq = data.freqs[f];
          var freqAvg = freq.vol/freq.hits;
          if (freq.hits > results.length*0.3) {
            var diff = data.avg - freqAvg;
            _noiseCancel(f,diff);
          }
        }
        _setThresh(data.avg,tStrength);
        done();
      }
    };
    tick();
  };

  analyser.calibrate = function(time,tStrength,callback) {
    if (typeof(time) === "function") {
      callback = time;
      time = undefined;
    }
    if (typeof(tStrength) === "function") {
      callback = tStrength;
      tStrength = undefined;
    }
    this.smoothingTimeConstant = 0.9;
    time = time || 4000;
    tStrength = tStrength || 20;
    if (tStrength < 0 || tStrength > 50) {
      throw new Error("threshold strength must be between 0 and 50");
    }
    _analyseEnv(time,tStrength,callback);
  };

  analyser.start = function(interval,smooth,callback){
    var startInterval = function(){
      return setInterval(function(){
        analyser.getFloatFrequencyData(_FFT);
        var targetRange = _findMaxWithI(_FFT);
        var volume = targetRange[1][1];
        var hz = _convertToHz(targetRange);
        var data = {
          hz: hz,
          volume: volume
        };
        callback(data);
      }, interval);
    };
    if (typeof(interval) === 'function') {
      callback = interval;
      interval = undefined;
    } else if (typeof(smooth) === 'function') {
      callback = smooth;
      smooth = undefined;
    }
    interval = interval || 60;
    this.smoothingTimeConstant = smooth || 0;
    var processor = startInterval();
    this.end = function() {
      clearInterval(processor);
    };
  };

  analyser.end = function(){
    return "End called but analyser not processing yet.";
  };

  return analyser;
};
},{"./audioHelpers.js":2}]},{},[1])
;