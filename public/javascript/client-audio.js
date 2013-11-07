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
      var targetRange = findMaxWithIndex(FFTData);
      var volume = targetRange[1][1];
      var hz = convertToHz(targetRange);
      state.volume = volume;
      state.hz = hz;
      var data = {
        hz: hz,
        volume: volume
      };
      // console.log(data);
      server.emit("audio",data);
    },60);
  };

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
  analyser.smoothingTimeConstant = 0.1;
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
  analyser.getFloatFrequencyData(FFTData);
  // for (var i = 0; i < analyser.frequencyBinCount; i++) {
  //   var value = FFTData[i];
  //   var percent = value / 256;
  //   var height = HEIGHT * percent;
  //   var offset = HEIGHT - height - 1;
  //   var barWidth = WIDTH/analyser.frequencyBinCount;
  // }
  microphone.connect(hiPass);
  hiPass.connect(loPass);
  loPass.connect(analyser);
  process();
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