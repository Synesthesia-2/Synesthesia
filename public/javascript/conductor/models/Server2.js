ConductorSpace.Server = Backbone.Model.extend({

  initialize: function() {
    this.set('ip', window.location.host);
    this.connection = io.connect('http://' + window.location.host + "/conductor2");
    console.log('Server connected');
    this.connection.on('welcome', this.resetSelf.bind(this));
  },

  emit: function(event, data) {
    this.connection.emit(event, data);
    console.log('Conductor backbone server emitted: ', event, data);
  },

  resetSelf: function() {
    this.trigger('resetSelf');
  }

});