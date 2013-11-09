ConductorSpace.Conductor = Backbone.Model.extend({

  initialize: function() {
    this.set('strobe', false);
    this.set('paint', false);
    this.set('sound', false);
    this.set('audioLightControl', false);
  },

  toggleSound: function() {
    var sound = this.get('sound');
    sound = !sound;
    this.trigger('toggleSound', { sound: sound });
    this.set('sound', sound);
    if (sound) {
      $('#toggleSound').addClass('toggled');
      $('#toggleSound').text('TOGGLE SOUND OFF');
    } else {
      $('#toggleSound').removeClass('toggled');
      $('#toggleSound').text('TOGGLE SOUND ON');
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
      $('#togglePaint').text('TOGGLE PAINT OFF');
    } else {
      $('#togglePaint').removeClass('toggled');
      $('#togglePaint').text('TOGGLE PAINT ON');
    }
  },

  toggleStrobe: function() {
    var strobe = this.get('strobe');
    strobe = !strobe;
    this.trigger('toggleStrobe', { strobe: strobe });
    this.set('strobe', strobe);
    if (strobe) {
      $('#toggleStrobe').addClass('toggled');
      $('#toggleStrobe').text('TOGGLE STROBE OFF');
    } else {
      $('#toggleStrobe').removeClass('toggled');
      $('#toggleStrobe').text('TOGGLE STROBE ON');
    }
  },

  toggleAudioLights: function() {
    var audioLightControl = this.get('audioLightControl');
    audioLightControl = !audioLightControl;
    this.trigger('audioLightControl', {audioLightControl: audioLightControl});
    this.set('audioLightControl', audioLightControl);
    if (audioLightControl) {
      $('#toggleAudioLights').addClass('toggled');
      $('#toggleAudioLights').text('AUDIO LIGHT SHOW');
    } else {
      $('#toggleAudioLights').removeClass('toggled');
      $('#toggleAudioLights').text('MANUAL LIGHT SHOW');
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