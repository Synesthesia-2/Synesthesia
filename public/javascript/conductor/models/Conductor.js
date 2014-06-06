ConductorSpace.Conductor = Backbone.Model.extend({

  initialize: function() {
    this.set('strobe', false);
    this.set('motion', false);
    this.set('opticalFlowFlocking', false);
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
      $('#toggleSound').text('STOP SOUND STREAMING');
    } else {
      $('#toggleSound').removeClass('toggled');
      $('#toggleSound').text('START SOUND STREAMING');
    }
  },

  reset: function() {
    this.initialize();
    $('#toggleSound').removeClass('toggled');
    $('#toggleMotion').removeClass('toggled');
    $('#toggleOpticalFlowTracking').removeClass('toggled');
    $('#toggleStrobe').removeClass('toggled');
  },

  sendNewFadeTime: function(newFadeTime) {
    this.trigger('newFadeTime', { fadeTime: newFadeTime });
  },

  toggleMotion: function() {
    var motion = this.get('motion');
    motion = !motion;
    this.trigger('toggleMotion', { motion: motion });
    this.set('motion', motion);
    if (motion) {
      $('#toggleMotion').addClass('toggled');
      $('#toggleMotion').text('STOP MOTION TRACKING');
    } else {
      $('#toggleMotion').removeClass('toggled');
      $('#toggleMotion').text('START MOTION TRACKING');
    }
  },

  toggleOpticalFlowTracking: function() {
    var opticalFlowFlocking = this.get('opticalFlowFlocking');
    opticalFlowFlocking = !opticalFlowFlocking;
    this.trigger('toggleOpticalFlowFlocking', { opticalFlowFlocking: opticalFlowFlocking });
    this.set('opticalFlowFlocking', opticalFlowFlocking);
    if (opticalFlowFlocking) {
      $('#toggleOpticalFlowFlocking').addClass('toggled');
      $('#toggleOpticalFlowFlocking').text('STOP MOTION TRACKING');
    } else {
      $('#toggleOpticalFlowFlocking').removeClass('toggled');
      $('#toggleOpticalFlowFlocking').text('START MOTION TRACKING');
    }
  },

  toggleStrobe: function() {
    var strobe = this.get('strobe');
    strobe = !strobe;
    this.trigger('toggleStrobe', { strobe: strobe });
    this.set('strobe', strobe);
    if (strobe) {
      $('#toggleStrobe').addClass('toggled');
      $('#toggleStrobe').text('STOP CLIENT LIGHT STROBE');
    } else {
      $('#toggleStrobe').removeClass('toggled');
      $('#toggleStrobe').text('START CLIENT LIGHT STROBE');
    }
  },

  toggleAudioLights: function() {
    var audioLightControl = this.get('audioLightControl');
    audioLightControl = !audioLightControl;
    this.trigger('audioLightControl', {audioLightControl: audioLightControl});
    this.set('audioLightControl', audioLightControl);
    if (audioLightControl) {
      $('#toggleAudioLights').addClass('toggled');
      $('#toggleAudioLights').text('AUDIO LIGHT SHOW CONTROL');
    } else {
      $('#toggleAudioLights').removeClass('toggled');
      $('#toggleAudioLights').text(' MANUAL LIGHT SHOW CONTROL');
    }
  },

  sendColor: function(color, fadeTime) {
    this.trigger('changeColor', { color: color, fadeTime: fadeTime });
  },

  randomColor: function(colors,fadeTime) {
    this.trigger('randomColor', { colors: colors, fadeTime: fadeTime });
  }

});