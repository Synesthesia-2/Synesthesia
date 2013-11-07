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
  },

  togglePaint: function() {
    var paint = this.get('paint');
    paint = !paint;
    this.trigger('togglePaint', { paint: paint });
    this.set('paint', paint);
  },

  toggleStrobe: function() {
    var strobe = this.get('strobe');
    strobe = !strobe;
    this.trigger('toggleStrobe', { strobe: strobe });
    this.set('strobe', strobe);
  },

  sendColor: function(color, fadeTime) {
    this.trigger('changeColor', { color: color, fadeTime: fadeTime });
  },

  randomColor: function(colors,fadeTime) {
    this.trigger('randomColor', { colors: colors, fadeTime: fadeTime });
  }

});