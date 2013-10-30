// conductor.js

var server = io.connect('/conductor');

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
      server.emit('colorChange',colorOptions);
      $('#optionPalette').hide();
      $('#optionBuilder h2').text("Please select an option below:");
      $('#currentBar h3').text("Currently Deployed: All One Color");
    });
  });

  $('#allRandomColors').on('click touchend', function(e) {
    e.preventDefault();
    colorOptions = { color: 'random' };
    server.emit("allRandomColors",colorOptions);
    $('#currentBar h3').text("Currently Deployed: All Random Colors");
  });

  $('#splitColors').on('click touchend', function(e) {
    e.preventDefault();
    $('#optionPalette').show();
    $('#optionBuilder h2').text("Pick colors to use:");
    colorOptions = [];
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


});