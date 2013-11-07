var contextClass = (window.AudioContext || 
  window.webkitAudioContext || 
  window.mozAudioContext || 
  window.oAudioContext || 
  window.msAudioContext);
if (contextClass) {
  var audioContext = new contextClass();
  server.send("audio Context created!"); // For development testing only.
} else {
  server.send("web audio is not enabled, sorry."); // For development testing only.
}

var getPeaks = function(array) {
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

var streamLoaded = function(stream) {
  var calibrate = function() {
    analyser.smoothingTimeConstant = 0.9;
    var start = new Date().getTime();
    var e = start+4000;
    var results = [];
    var analyze = function(){
      var addFilter = function(freq) {
        console.log("adding filter at " + freq);
        var filter = audioContext.createBiquadFilter();
        filter.type = filter.PEAKING;
        filter.gain.value = data.avg-ptAvg;
        filter.connect(analyser);
        var lastFilter = dynamicFilters.length;
        if (lastFilter) {
          dynamicFilters[lastFilter-1].disconnect(analyser);
          dynamicFilters[lastFilter-1].connect(filter);
          dynamicFilters.push(filter);
        } else {
          loShelf.disconnect(analyser);
          loShelf.connect(filter);
          dynamicFilters.push(filter);
        }
      };
      analyser.getFloatFrequencyData(FFTData);
      var targetRange = findMaxWithIndex(FFTData);
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
            addFilter(f);
          }
        }
        threshold = data.avg+20;
      }
    };
    analyze();
  };

  var process = function(){
    analyser.smoothingTimeConstant = 0;
    setInterval(function(){
      analyser.getFloatFrequencyData(FFTData);
      var targetRange = findMaxWithIndex(FFTData);
      var volume = targetRange[1][1];
      var hz = convertToHz(targetRange);
      // state.volume = volume;
      // state.hz = hz;
      var data = {
        hz: hz,
        volume: volume
      };
      if (volume > threshold) { server.emit("audio",data); }
    },60);
  };

  var findMaxWithIndex = function(array) {
    var max = Math.max.apply(Math, array);
    var index = Array.prototype.indexOf.call(array,max);
    return [[index-1,array[index-1]],[index,max],[index+1,array[index+1]]];
  };

  var convertToHz = function(bucket) {
    var targetRange = bucket[1][0];
    var lowD = ((bucket[1][1])-(bucket[0][1]));
    var highD = ((bucket[1][1])-(bucket[2][1]));
    var shift = (lowD < highD ? -(highD - lowD) : (lowD - highD));
    var adjShift = (shift*0.5)*0.1;
    return (targetRange + adjShift) / 1024 * (44100 * 0.5);
  };

  var threshold = -80;
  var dynamicFilters = [];
  var microphone = audioContext.createMediaStreamSource(stream);
  var analyser = audioContext.createAnalyser();
  var hiPass = audioContext.createBiquadFilter();
  hiPass.type = hiPass.HIGHPASS;
  hiPass.frequency.value = 200;
  var loPass = audioContext.createBiquadFilter();
  loPass.type = loPass.LOWPASS;
  loPass.frequency.value = 1200;
  var loShelf = audioContext.createBiquadFilter();
  loShelf.type = loShelf.LOWSHELF;
  loShelf.frequency.value = 330;
  loShelf.gain.value = -10;
  analyser.fftSize = 2048;
  analyser.minDecibels = -144;
  var FFTData = new Float32Array(analyser.frequencyBinCount);
  FFTData.indexOf = Array.prototype.indexOf;
  analyser.getFloatFrequencyData(FFTData);
  microphone.connect(hiPass);
  hiPass.connect(loPass);
  loPass.connect(loShelf);
  loShelf.connect(analyser);
  calibrate();
  setTimeout(process, 6000);
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia( {audio:true}, streamLoaded );