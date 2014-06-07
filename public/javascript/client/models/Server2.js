ClientSpace.Server = Backbone.Model.extend({

  initialize:function() {
    this.set('ip', window.location.host);

    this.connection = io.connect('http://' + window.location.host + "/client");
    this.connection.on('welcome', this.setID.bind(this));
    this.connection.on('changeColor', this.setBackgroundColor.bind(this));
    this.connection.on('randomColor', this.randomBackgroundColor.bind(this));
    this.connection.on('toggleStrobe', this.toggleStrobe.bind(this));
    this.connection.on('newFadeTime', this.newFadeTime.bind(this));
    this.connection.on('newSeparationFactor', this.newSeparationFactor.bind(this));
    this.connection.on('newCohesionFactor', this.newCohesionFactor.bind(this));
    this.connection.on('newAlignmentFactor', this.newAlignmentFactor.bind(this));
    this.connection.on('newSpeedFactor', this.newSpeedFactor.bind(this));
    this.connection.on('audio', this.audioColor.bind(this));
    this.connection.on('reset', this.reset.bind(this));
  },

  reset: function() {
    this.trigger('reset');
  },

  newSeparationFactor: function(data) {
    this.trigger('newSeparationFactor', data);
  },

  newCohesionFactor: function(data) {
    this.trigger('newCohesionFactor', data);
  },

  newAlignmentFactor: function(data) {
    this.trigger('newAlignmentFactor', data);
  },

  newSpeedFactor: function(data) {
    this.trigger('newSpeedFactor', data);
  },

  emit: function(event, data) {
    this.connection.emit(event, data);
  }

});
