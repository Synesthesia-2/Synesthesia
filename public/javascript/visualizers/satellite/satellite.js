var server = io.connect('/satellite');

$(document).ready(function(){
  $('body').append('<div id=instructions></div>');

  (function(){

    var server = io.connect('/satellite');
    server.on('welcome', function (data) {
        console.log('Connected to server:', data);
    });
     
    // ** expect osc input camera resolution to be 640 x 480

    /////////////////////////////////////////
    //  Satellite Projection Data Ranges   //
    /////////////////////////////////////////
    //  center[0]  (-2,2)     // x-pos     //
    //  center[1]  (0, 6)     // y-pos     //
    //  tilt       (-20 20)   // slope     //
    /////////////////////////////////////////

    server.on('opticalFlow', visualizer.collectopticalFlowData);
    server.on('blob', visualizer.getBlobCoords);
    server.on('audio', visualizer.getFreq);

    server.on('audienceMotionData', visualizer.handleShakes);

  })();
});
