// audioHelpers.js

var makeFilter = function(context,type,freq,q,gain) {
  if (!context) { throw "context required"; }
  if (!type || typeof(type) !== "string") { throw "type must be string"; }
  var filter = context.createBiquadFilter();
  filter.type = filter[type];
  if (freq) { filter.frequency.value = freq; }
  if (q) { filter.Q.value = q; }
  if (gain) { filter.gain.value = gain; }
  return filter;
};

var addFilter = function(filter,chain) {
  if (!chain.connect) {
    chain.connect = function(node) {
      if (!chain.length) {
        throw new Error("nothing in chain to connect");
      } else {
        chain[chain.length-1].connect(node);
      }
    };
  }
  if (!Array.isArray(chain)) {
    throw "chain must be an array";
  }
  if (chain.length) {
    var last = chain[chain.length-1];
    chain.push(filter);
    last.connect(filter);
  } else {
    chain.push(filter);
  }
};