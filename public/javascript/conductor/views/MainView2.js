ConductorSpace.MainView = Backbone.View.extend({

  events: {
    'click .color': 'sendColor',
    'click .random': 'sendRandomColor',
    'click #toggleSound': 'toggleSound',
    'click #toggleMotion': 'toggleMotion',
    'click #toggleStrobe': 'toggleStrobe',
    'click #toggleAudioLights': 'toggleAudioLights',
    'click #tiltGrid': 'tiltGrid',
    'change #fader': 'updateFadeTime',
    'change #updateSeparationFactor': 'updateSeparationFactor',
    'change #updateCohesionFactor': 'updateCohesionFactor',
    'change #updateAlignmentFactor': 'updateAlignmentFactor',
    'change #updateSpeedFactor': 'updateSpeedFactor'
  },

  initialize: function() {
    this.template = this.model.get('templates')['mainView'];
    this.fadeTime = 1500;
  },

  render: function() {
    this.$el.html(this.template());
    return this;
  },

  updateFadeTime: function(e) {
    this.fadeTime = e.target.value;
    var rounded = this.fadeTime / 1000;
    rounded = rounded.toFixed(1);
    $('#fadeTimeText').text('FADE: ' + rounded + ' Seconds');
    this.model.sendNewFadeTime(this.fadeTime);
  },

  updateSeparationFactor: function(e) {
    this.separationFactor = e.target.value;
    var rounded = this.separationFactor / 1000;
    rounded = rounded.toFixed(1);
    this.model.sendNewSeparationFactor(this.separationFactor);
  },

  updateCohesionFactor: function(e) {
    this.cohesionFactor = e.target.value;
    var rounded = this.cohesionFactor / 1000;
    rounded = rounded.toFixed(1);
    this.model.sendNewCohesionFactor(this.cohesionFactor);
  },

  updateAlignmentFactor: function(e) {
    this.alignmentFactor = e.target.value;
    var rounded = this.alignmentFactor / 1000;
    rounded = rounded.toFixed(1);
    this.model.sendNewAlignmentFactor(this.alignmentFactor);
  },

  updateSpeedFactor: function(e) {
    this.speedFactor = e.target.value;
    var rounded = this.speedFactor / 1000;
    rounded = rounded.toFixed(1);
    this.model.sendNewSpeedFactor(this.speedFactor);
  },

  sendColor: function(e) {
    var color = e.target.dataset.color;
    this.model.sendColor(color, this.fadeTime);
  },

  sendRandomColor: function(e) {
    var colorOptions = { color: ["#CC0000","#FFFFFF","#00CC00","#0000CC","#B5FC9B","#9BDAFC","#F50FF1","#F5AC0F","#FFE203","#000000", "#AA84E0", "#7A0014"] };
    this.model.randomColor(colorOptions, this.fadeTime);
  },

  toggleSound: function() {
    this.model.toggleSound();
  },

  toggleMotion: function() {
    this.model.toggleMotion();
  },

  toggleStrobe: function() {
    this.model.toggleStrobe();
  },

  toggleAudioLights: function() {
    if (this.model.get('audioLightControl')) {
      $('.audioControlled').removeAttr('disabled');
      $('.audioControlled').css('opacity', '1.0');
    } else {
      $('.audioControlled').prop('disabled', 'disabled');
      $('.audioControlled').css('opacity', '0.7');
      if (this.model.get('strobe')) {
        this.model.toggleStrobe();
      }
    }
    this.model.toggleAudioLights();
  }

});