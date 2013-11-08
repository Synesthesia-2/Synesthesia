ConductorSpace.Conductor = Backbone.Model.extend({

  initialize: function() {
    this.set('strobe', false);
    this.set('paint', false);
    this.set('sound', false);
  },

  toggleSound: function() {
    var sound = this.get('sound');
    sound = !sound;
    this.trigger('toggleSound', { sound: sound });
    this.set('sound', sound);
    if (sound) {
      $('#toggleSound').addClass('toggled');
    } else {
      $('#toggleSound').removeClass('toggled');
    }
  },

  reset: function() {
    this.initialize();
    $('#toggleSound').removeClass('toggled');
    $('#togglePaint').removeClass('toggled');
    $('#toggleStrobe').removeClass('toggled');
  },

  sendNewFadeTime: function(newFadeTime) {
    this.trigger('newFadeTime', { fadeTime: newFadeTime });
  },

  togglePaint: function() {
    var paint = this.get('paint');
    paint = !paint;
    this.trigger('togglePaint', { paint: paint });
    this.set('paint', paint);
    if (paint) {
      $('#togglePaint').addClass('toggled');
    } else {
      $('#togglePaint').removeClass('toggled');
    }
  },

  toggleStrobe: function() {
    var strobe = this.get('strobe');
    strobe = !strobe;
    this.trigger('toggleStrobe', { strobe: strobe });
    this.set('strobe', strobe);
    if (strobe) {
      $('#toggleStrobe').addClass('toggled');
    } else {
      $('#toggleStrobe').removeClass('toggled');
    }
  },

  sendColor: function(color, fadeTime) {
    if ($('#togglePaint').hasClass("toggled")) {
      this.togglePaint();
    }
    this.trigger('changeColor', { color: color, fadeTime: fadeTime });
  },

  randomColor: function(colors,fadeTime) {
    this.trigger('randomColor', { colors: colors, fadeTime: fadeTime });
  }

});