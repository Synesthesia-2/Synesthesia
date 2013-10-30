// conductor.js

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

      // socket shit
      
      $('#optionPalette').hide();
      $('#optionBuilder h2').text("Please select an option below:");
      $('#currentBar h3').text("Currently Deployed: All One Color");
    });
  });

  $('#allRandomColors').on('click touchend', function(e) {
    e.preventDefault();
    specOption = "allRandomColors";
    colorOptions = { color: 'random' };
    // socket shit
    
    $('#currentBar h3').text("Currently Deployed: All Random Colors");
  });

  $('#splitColors').on('click touchend', function(e) {
    e.preventDefault();
    specOption = "splitColors";
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
      // socket
      
      $('#optionPalette').hide();
      $('#optionBuilder h2').text("Please select an option below:");
      $('#currentBar h3').text("Currently Deployed: Split Colors");
    });

  });


});