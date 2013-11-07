var server = io.connect('/audio');
var h1 = $('h1');

var contextClass = (window.AudioContext || 
  window.webkitAudioContext || 
  window.mozAudioContext || 
  window.oAudioContext || 
  window.msAudioContext);
if (contextClass) {
  var audioContext = new contextClass();
} else {
  h1.text("web audio is not enabled, sorry."); // For development testing only.
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
  h1.text("Audio input enabled. Waiting for command from server.")
  var calibrate = function() {
    h1.text("Calibrating...")
    analyser.smoothingTimeConstant = 0.9;
    var start = new Date().getTime();
    var e = start+4000;
    var results = [];
    var analyze = function(){
      var addFilter = function(freq) {
        console.log("adding filter at " + freq);
        var filter = audioContext.createBiquadFilter();
        filter.type = filter.PEAKING;
        filter.gain.value = (data.avg-ptAvg)*0.7;
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
    h1.text('Streaming started.')
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
  server.on("startAudio",function() {
    calibrate();
    setTimeout(process, 4500);
  });
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia( {audio:true}, streamLoaded );




/* Kicks are detected when the amplitude (normalized 
  values between 0 and 1) of a specified frequency, or 
  the max amplitude over a range, is greater than the 
  minimum threshold, as well as greater than the previously 
  registered kick's amplitude, which is decreased by the 
  decay rate per frame.

  createKick( options ) creates a new kick instance tied 
  to the dancer instance, with an options object passed 
  as an argument. Options listed below.
  frequency the frequency (element of the spectrum) to 
  check for a spike. Can be a single frequency (number) 
  or a range (2 element array) that uses the frequency 
  with highest amplitude. Default: [ 0, 10 ]
  threshold the minimum amplitude of the frequency range 
  in order for a kick to occur. Default: 0.3
  decay the rate that the previously registered kick's 
  amplitude is reduced by on every frame. Default: 0.02
  onKick the callback to be called when a kick is detected.
  offKick the callback to be called when there is no kick 
  on the current frame.*/

