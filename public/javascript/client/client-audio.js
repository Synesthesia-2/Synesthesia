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

var streamLoaded = function(stream) {
  var process = function(){
    setInterval(function(){
      analyser.getFloatFrequencyData(FFTData);
      var targetRange = findMaxWithIndex(FFTData)
      var volume = targetRange[1][1];
      var hz = convertToHz(targetRange);
      // state.volume = volume;
      // state.hz = hz;
      var data = {
        hz: hz,
        volume: volume
      };
      // console.log(data);
      server.emit("audio",data);
    },60);
  };

  var findMaxWithIndex = function(array) {
    var max = Math.max.apply(Math, array);
    var index = Array.prototype.indexOf.call(array,max);
    return [[index-1,array[index-1]],[index,max],[index+1,array[index+1]]];
  };

  var convertToHz = function(bucket) {
    var targetRange = bucket[1][0];
    var lowDifference = ((bucket[1][1])-(bucket[0][1]));
    var highDifference = ((bucket[1][1])-(bucket[2][1]));
    var shift = (lowDifference < highDifference ? -(highDifference - lowDifference) : (lowDifference - highDifference));
    var adjShift = (shift*0.5)*0.1;
    return (targetRange + adjShift) / 1024 * (44100 * 0.5);
  };

  // TODO: Initalization loop gets ambient room sound and implements noise canceling

  var microphone = audioContext.createMediaStreamSource(stream);
  var analyser = audioContext.createAnalyser();
  analyser.smoothingTimeConstant = 0;
  var hiPass = audioContext.createBiquadFilter();
  hiPass.type = hiPass.HIGHPASS;
  hiPass.frequency.value = 200;
  var loPass = audioContext.createBiquadFilter();
  loPass.type = loPass.LOWPASS;
  loPass.frequency.value = 1200;
  analyser.fftSize = 2048;
  analyser.minDecibels = -144;
  var FFTData = new Float32Array(analyser.frequencyBinCount);
  FFTData.indexOf = Array.prototype.indexOf;
  analyser.getFloatFrequencyData(FFTData)
  microphone.connect(hiPass);
  hiPass.connect(loPass);
  loPass.connect(analyser);
  process();
  // console.log(microphone);
};

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
navigator.getUserMedia( {audio:true}, streamLoaded );

  // var findVolume = function(array) {
  //   var i = array.length;
  //   var sum = 0;
  //   while (i--) {
  //     sum+= array[i]-analyser.minDecibels;
  //   }
  //   return (sum/1024);
  // };