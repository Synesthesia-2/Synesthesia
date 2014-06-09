var zFilter = function(inputData, previousValue, zFactor){
      var z = zFactor || 0.9; // set the z param between 0 and 1
      return ( z * previousValue + ( 1 - z ) * inputData ) ;
  };

var randomCenterAdjustment = function(oldCoords, scalingFactor) {
      var updatedCoords = [];
      updatedCoords[0] = oldCoords[0] + (Math.random() - 0.5) * scalingFactor;
      updatedCoords[1] = oldCoords[1] + (Math.random() - 0.5) * scalingFactor;
      return updatedCoords;
};



var makeProjPath = function(projParams) {
    var projection = d3.geo.satellite()
      .distance(projParams.distance)
      .scale(projParams.scale)
      .rotate(projParams.rotate)
      .center(projParams.center)
      .tilt(projParams.tilt)
      .clipAngle(projParams.clipAngle)
      .precision(projParams.precision);
    return d3.geo.path()
      .projection(projection);
  };

