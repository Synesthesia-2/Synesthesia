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
  console.log(data);
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
navigator.getUserMedia( {audio:true}, streamLoaded, function(data){console.log(data)});

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
