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

var filterChain = function(){
  var chain = {
    first: null,
    last: null,
    output: null
  };
  chain.connect = function(node){
    this.output = node;
    if (this.last) {this.last.connect(this.output);}
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