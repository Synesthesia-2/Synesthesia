// 3. Refactor dynamic filter adding to use addFilter
// 4. Fix microphone hooking-up
// 5. Test stream loading
// 6. Move helper functions out if possible.
// 7. Gist for making filters

// Tip: If you have access to soundcard settings, adjust input gain so that 
// microphone input averages between 50% and 75% metering on soundcard.
// Good rule of thumb for analyser is that -100dB is a very quiet room and 0 is 
// a very loud input. Under this setup most inputs should avg between -40 and 
// -5 dB, but it all depends on the environment, input gain, 
// and analyserminDecibels.

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

var state = {
  serverReady: false,
  inputEnabled: false,
  emitting: false,
};
var server = io.connect('/audio');
var microphone;
var hiPass = makeFilter(audioContext,"HIGHPASS",80);
var loPass = makeFilter(audioContext,"LOWPASS",1200);
var filters = makeFilterChain();
var pitchAnalyser = makePitchAnalyser(audioContext,filters);
filters.add(hiPass,loPass);

server.on("welcome",function(data){
  console.log(data);
  if (data.start && !state.serverReady) {
    state.serverReady = true;
  }
});
server.on("startAudio",function() {
  if (!state.serverReady) {
    state.serverReady = true;
  }
  if (!state.emitting && state.inputEnabled) {
    startEmitting();
  }
});

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia( {audio:true}, streamLoaded);

var streamLoaded = function(stream) {
  h1.text("Audio input enabled. Waiting for command from server.");
  state.inputEnabled = true;
  microphone = audioContext.createMediaStreamSource(stream);
  microphone.connect(filters.first);
  if (state.serverReady) { startEmitting(); }
};

var startEmitting = function() {
  state.emitting = true;
  h1.text("Calibrating...");
  pitchAnalyser.calibrate();
  setTimeout(function(){
    h1.text('Emitting audio stream.');
    pitchAnalyser.process(60, function (data){
      if (data.volume > pitchAnalyser.threshold) {
        server.emit("audio",data);
      }
    });
  }, 4500);
};

// var calibrate = function() {
//   analyser.smoothingTimeConstant = 0.9;
//   var start = new Date().getTime();
//   var e = start+4000;
//   var results = [];
//   var offset = 20;
//   var analyze = function(){
//     var noiseCancel = function(freq) {
//       console.log("adding filter at " + freq,data.avg);
//       var filter = audioContext.createBiquadFilter();
//       filter.type = filter.PEAKING;
//       filter.gain.value = (data.avg-ptAvg)*0.7;
//       filter.Q.value = 1;
//       filter.connect(analyser);
//       var lastFilter = dynamicFilters.length;
//       if (lastFilter) {
//         dynamicFilters[lastFilter-1].disconnect(analyser);
//         dynamicFilters[lastFilter-1].connect(filter);
//         dynamicFilters.push(filter);
//       } else {
//         // the last static filter in line to the analyser
//         loPass.disconnect(analyser);
//         loPass.connect(filter);
//         dynamicFilters.push(filter);
//       }
//     };
//     analyser.getFloatFrequencyData(FFTData);
//     var targetRange = findMaxWithIndex(FFTData);
//     var sample = {
//       volume: targetRange[1][1],
//       hz: convertToHz(targetRange)
//     };
//     results.push(sample);
//     var cur = new Date().getTime();
//     if (cur < e) {
//       setTimeout(analyze,50);
//     } else {
//       var data = getPeaks(results);
//       for (var f in data.freqs) {
//         var pt = data.freqs[f];
//         var ptAvg = pt.vol/pt.hits;
//         if (pt.hits > results.length*0.3) {
//           noiseCancel(f);
//         }
//       }
//       if (data.avg >= -60 && data.avg <= -40) {
//         offset = 10;
//       } else if (data.avg > -40) {
//         offset = 0;
//       }
//       state.threshold = data.avg+offset;
//     }
//   };
//   analyze();
// };

// var process = function(){
//   analyser.smoothingTimeConstant = 0;
//   setInterval(function(){
//     analyser.getFloatFrequencyData(FFTData);
//     var targetRange = findMaxWithIndex(FFTData);
//     var volume = targetRange[1][1];
//     var hz = convertToHz(targetRange);
//     // state.volume = volume;
//     // state.hz = hz;
//     var data = {
//       hz: hz,
//       volume: volume
//     };
//     if (volume > state.threshold) { server.emit("audio",data); }
//   },60);
// };

// var getPeaks = function(array) {
//   var sum = 0;
//   var freqs = {};
//   var i = array.length;
//   while(i--) {
//     var vol = array[i].volume;
//     var freq = Math.round(array[i].hz / 5) * 5;
//     if (freqs[freq]) {
//       freqs[freq].hits+=1;
//       freqs[freq].vol+=vol;
//     } else {
//       freqs[freq] = {hits:1,vol:vol};
//     }
//     sum+=vol;
//   }
//   return {
//     avg: sum/array.length,
//     freqs: freqs
//   };
// };

// var findMaxWithIndex = function(array) {
//   var max = Math.max.apply(Math, array);
//   var index = Array.prototype.indexOf.call(array,max);
//   return [[index-1,array[index-1]],[index,max],[index+1,array[index+1]]];
// };

// var convertToHz = function(bucket) {
//   var targetRange = bucket[1][0];
//   var lowD = ((bucket[1][1])-(bucket[0][1]));
//   var highD = ((bucket[1][1])-(bucket[2][1]));
//   var shift = (lowD < highD ? -(highD - lowD) : (lowD - highD));
//   var adjShift = (shift*0.5)*0.1;
//   return (targetRange + adjShift) / 1024 * (44100 * 0.5);
// };


// var h1 = $('h1');
// var contextClass = (window.AudioContext ||
//   window.webkitAudioContext ||
//   window.mozAudioContext ||
//   window.oAudioContext ||
//   window.msAudioContext);
// if (contextClass) {
//   var audioContext = new contextClass();
// } else {
//   h1.text("web audio is not enabled, sorry."); // For development testing only.
// }

// var state = {
//   serverReady: false,
//   inputEnabled: false,
//   emitting: false,
// };
// var server = io.connect('/audio');
// var microphone;
// var hiPass = makeFilter(audioContext,"HIGHPASS",80);
// var loPass = makeFilter(audioContext,"LOWPASS",1200);
// var filters = makeFilterChain();
// var analyser = makeAnalyser(audioContext,2048,-30,-144);
// var FFTData = new Float32Array(analyser.frequencyBinCount);
// FFTData.indexOf = Array.prototype.indexOf;
// analyser.getFloatFrequencyData(FFTData);
// filters.addFilter(hiPass,loPass);
// microphone.connect(filters.first);
// filters.connect(analyser);

// server.on("welcome",function(data){
//   console.log(data);
//   if (data.start && !state.serverReady) {
//     state.serverReady = true;
//   }
// });
// server.on("startAudio",function() {
//   if (!state.serverReady) {
//     state.serverReady = true;
//   }
//   if (!state.emitting && state.inputEnabled) {
//     startEmitting();
//   }
// });

// navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
// navigator.getUserMedia( {audio:true}, streamLoaded);

// var streamLoaded = function(stream) {
//   h1.text("Audio input enabled. Waiting for command from server.");
//   state.inputEnabled = true;
//   microphone = audioContext.createMediaStreamSource(stream);
//   if (state.serverReady) { startEmitting(); }
// };

// var startEmitting = function() {
//   state.emitting = true;
//   h1.text("Calibrating...");
//   calibrate();
//   setTimeout(function(){
//     h1.text('Emitting audio stream.');
//     process();
//   }, 4500);
// };

// var addFilter = function(filter) {
//   staticFilters
// } 

// var calibrate = function() {
//   analyser.smoothingTimeConstant = 0.9;
//   var start = new Date().getTime();
//   var e = start+4000;
//   var results = [];
//   var offset = 20;
//   var analyze = function(){
//     var noiseCancel = function(freq) {
//       console.log("adding filter at " + freq,data.avg);
//       var filter = audioContext.createBiquadFilter();
//       filter.type = filter.PEAKING;
//       filter.gain.value = (data.avg-ptAvg)*0.7;
//       filter.Q.value = 1;
//       filter.connect(analyser);
//       var lastFilter = dynamicFilters.length;
//       if (lastFilter) {
//         dynamicFilters[lastFilter-1].disconnect(analyser);
//         dynamicFilters[lastFilter-1].connect(filter);
//         dynamicFilters.push(filter);
//       } else {
//         // the last static filter in line to the analyser
//         loPass.disconnect(analyser);
//         loPass.connect(filter);
//         dynamicFilters.push(filter);
//       }
//     };
//     analyser.getFloatFrequencyData(FFTData);
//     var targetRange = findMaxWithIndex(FFTData);
//     var sample = {
//       volume: targetRange[1][1],
//       hz: convertToHz(targetRange)
//     };
//     results.push(sample);
//     var cur = new Date().getTime();
//     if (cur < e) {
//       setTimeout(analyze,50);
//     } else {
//       var data = getPeaks(results);
//       for (var f in data.freqs) {
//         var pt = data.freqs[f];
//         var ptAvg = pt.vol/pt.hits;
//         if (pt.hits > results.length*0.3) {
//           noiseCancel(f);
//         }
//       }
//       if (data.avg >= -60 && data.avg <= -40) {
//         offset = 10;
//       } else if (data.avg > -40) {
//         offset = 0;
//       }
//       state.threshold = data.avg+offset;
//     }
//   };
//   analyze();
// };

// var process = function(){
//   analyser.smoothingTimeConstant = 0;
//   setInterval(function(){
//     analyser.getFloatFrequencyData(FFTData);
//     var targetRange = findMaxWithIndex(FFTData);
//     var volume = targetRange[1][1];
//     var hz = convertToHz(targetRange);
//     // state.volume = volume;
//     // state.hz = hz;
//     var data = {
//       hz: hz,
//       volume: volume
//     };
//     if (volume > state.threshold) { server.emit("audio",data); }
//   },60);
// };

// var getPeaks = function(array) {
//   var sum = 0;
//   var freqs = {};
//   var i = array.length;
//   while(i--) {
//     var vol = array[i].volume;
//     var freq = Math.round(array[i].hz / 5) * 5;
//     if (freqs[freq]) {
//       freqs[freq].hits+=1;
//       freqs[freq].vol+=vol;
//     } else {
//       freqs[freq] = {hits:1,vol:vol};
//     }
//     sum+=vol;
//   }
//   return {
//     avg: sum/array.length,
//     freqs: freqs
//   };
// };

// var findMaxWithIndex = function(array) {
//   var max = Math.max.apply(Math, array);
//   var index = Array.prototype.indexOf.call(array,max);
//   return [[index-1,array[index-1]],[index,max],[index+1,array[index+1]]];
// };

// var convertToHz = function(bucket) {
//   var targetRange = bucket[1][0];
//   var lowD = ((bucket[1][1])-(bucket[0][1]));
//   var highD = ((bucket[1][1])-(bucket[2][1]));
//   var shift = (lowD < highD ? -(highD - lowD) : (lowD - highD));
//   var adjShift = (shift*0.5)*0.1;
//   return (targetRange + adjShift) / 1024 * (44100 * 0.5);
// };

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

