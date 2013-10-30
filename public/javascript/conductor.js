// conductor.js

var server = io.connect('/conductor');

server.on('welcome', function(data){
  console.log(data);
});

angular.module('conductorApp', [])

.controller('conductorController', function($scope) {

});

$(document).ready(function() {
  
  var specOption, colorOptions;

  $('#allOneColor').on('click touchend', function(e) {
    e.preventDefault();
    specOption = "allOneColor";
    $('#optionPalette').show();
    $('#optionBuilder h2').text("Pick a color to transmit:");
    $('.color').on('click touchend', function(e) {
      e.preventDefault();
      colorOptions = { color: $(this).data('color') };
      server.emit('changeColor',colorOptions);
      $('#optionPalette').hide();
      $('#optionBuilder h2').text("Please select an option below:");
      $('#currentBar h3').text("Currently Deployed: All One Color");
    });
  });

  $('#allRandomColors').on('click touchend', function(e) {
    e.preventDefault();
    colorOptions = { color: ["#CC0000","#FFFFFF","#00CC00","#0000CC","#B5FC9B","#9BDAFC","#F50FF1","#F5AC0F","#FFE203","#000000"] };
    server.emit("allRandomColors",colorOptions);
    $('#currentBar h3').text("Currently Deployed: All Random Colors");
  });

  $('#splitColors').on('click touchend', function(e) {
    e.preventDefault();
    $('#optionPalette').show();
    $('#optionBuilder h2').text("Pick colors to use:");
    var colorOptions = [];
    $('.color').on('click touchend', function(e) {
      e.preventDefault();
      colorOptions.push($(this).data('color'));
      $(this).css({ 'border-color': '#000'});
    });

    $('#submitOption').on('click touchend', function(e){
      e.preventDefault();
      colorsToSend = { color: colorOptions};
      server.emit('splitColors',colorsToSend);
      $('#optionPalette').hide();
      $('#optionBuilder h2').text("Please select an option below:");
      $('#currentBar h3').text("Currently Deployed: Split Colors");
    });
  });

  $('#clientPaint').on('click touchend', function(e) {
    e.preventDefault();
    if ($(this).text() === "TURN PAINTING ON") {
      $(this).text('TURN PAINTING OFF');
      server.emit('switchPainting',{paint: true});
    } else {
      server.emit('switchPainting',{paint: false});
      $(this).text('TURN PAINTING ON');
    }
  });
});