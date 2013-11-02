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
};
