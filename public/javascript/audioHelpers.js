var makeFilter = function(context,type,freq,gain,q) {
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
};

var nodeChain = function(){
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